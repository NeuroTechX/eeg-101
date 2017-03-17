package com.eeg_project.components.graphs;

import android.content.Context;
import android.graphics.Color;
import android.view.View;
import android.widget.FrameLayout;

import com.androidplot.Plot;
import com.androidplot.ui.HorizontalPositioning;
import com.androidplot.ui.Size;
import com.androidplot.ui.SizeMetric;
import com.androidplot.ui.SizeMode;
import com.androidplot.ui.VerticalPositioning;
import com.androidplot.xy.BoundaryMode;
import com.androidplot.xy.LineAndPointFormatter;
import com.androidplot.xy.XYPlot;
import com.choosemuse.libmuse.Eeg;
import com.choosemuse.libmuse.Muse;
import com.choosemuse.libmuse.MuseArtifactPacket;
import com.choosemuse.libmuse.MuseDataListener;
import com.choosemuse.libmuse.MuseDataPacket;
import com.choosemuse.libmuse.MuseDataPacketType;
import com.eeg_project.MainApplication;
import com.eeg_project.components.EEGFileWriter;
import com.eeg_project.components.signal.CircularBuffer;
import com.eeg_project.components.signal.Filter;

/*
View that plots a single-channel filtered EEG graph
Bandstop, bandpass, high-pass, and low-pass filters are availabe in Filter class

Plotting process:
1. Creates AndroidPlot graph and MuseDataListener for EEG data packets
2. MuseDataListener updates circular eegBuffer at 220-260hz
3. raw data is filtered as it comes in with Butterworth filters from DSP Library
3. dataThread and renderThread add latest filter result to dataSeries and render plot at a fixed
frequency
*/
public class FilterGraph extends FrameLayout {

    // ----------------------------------------------------------------------
    // Variables

    public XYPlot filterPlot;
    private static final int PLOT_LENGTH = 220;
    public MyPlotUpdater plotUpdater;
    private FilterDataSource dataSource;
    public DynamicSeries dataSeries;
    public museDataListener dataListener;
    double[] filtResult;
    Thread dataThread;
    Thread renderingThread;

    // Reference to global application state used for connected Muse
    MainApplication appState;

    // Filter specific variables
    public int filterFreq;
    public CircularBuffer eegBuffer = new CircularBuffer(220, 4);
    public Filter activeFilter;
    // Filter states represent info about previous samples; intermediate values that represent
    // polynomial components determined by previous samples in the epoch. For more info, read the Rational Transfer Function description here: https://www.mathworks.com/help/matlab/ref/filter.html
    public double[][] filtState;

    public double[] newData = new double[4];

    // Bridged props
    // Default channelOfInterest = 1 (left ear)
    public int channelOfInterest = 1;
    public boolean isRecording;

    // ------------------------------------------------------------------------
    // Constructors

    public FilterGraph(Context context) {
        super(context);
        appState = ((MainApplication)context.getApplicationContext());
        initView(context);
        // Data threads are started in onVisibilityChanged function
    }

    // -----------------------------------------------------------------------
    // Bridge functions (can be called from JS by setting props)

    public void setChannelOfInterest(int channel) {
        dataSeries.clear();
        channelOfInterest = channel;
    }

    public void setFilterType(String filterType) {
        dataSeries.clear();

        if(appState.connectedMuse.isLowEnergy()) { filterFreq = 256; }
        else { filterFreq = 220; }

        switch(filterType) {
            case "lowpass":
                activeFilter = new Filter(filterFreq, "lowpass", 5, 36, 0);
                filtState = new double[4][activeFilter.getNB()];
                break;

            case "bandpass":
                activeFilter = new Filter(filterFreq, "bandpass", 5, 1, 36);
                filtState = new double[4][activeFilter.getNB()];
                break;

            case "highpass":
                activeFilter = new Filter(filterFreq, "highpass", 2, 1, 0);
                filtState = new double[4][activeFilter.getNB()];
                break;
        }
    }

    public void setIsRecording(boolean recording) {
        isRecording = recording;

        // if writer = writing, close and save file
        if (dataSource != null && dataSource.fileWriter.isRecording()) {
            dataSource.fileWriter.writeFile("Filtered EEG");
        }
    }

    // -----------------------------------------------------------------------
    // Lifecycle methods (initView and onVisibilityChanged)

    // Initialize and style AndroidPlot Graph. XML styling is not used.
    public void initView(Context context) {
        filterPlot = new XYPlot(context, "EEG Circ Buffer Plot");

        // Create plotUpdater
        plotUpdater = new MyPlotUpdater(filterPlot);

        // Create dataSource
        dataSource = new FilterDataSource(appState.connectedMuse.isLowEnergy());

        // Create dataSeries that will be drawn on plot (Y will be obtained from dataSource, x will be implicitly generated):
        dataSeries = new DynamicSeries("Buffer Plot");

        // Set X and Y domain
        filterPlot.setRangeBoundaries(600, 1000, BoundaryMode.FIXED);
        filterPlot.setDomainBoundaries(0, PLOT_LENGTH, BoundaryMode.FIXED);

        // add dataSeries to plot and define color of plotted line
        filterPlot.addSeries(dataSeries,
                new LineAndPointFormatter(Color.rgb(255,255,255), null, null, null));

        // Format plot layout
        //Remove margins, padding and border
        filterPlot.setPlotMargins(0, 0, 0, 0);
        filterPlot.setPlotPadding(0, 0, 0, 0);
        filterPlot.getBorderPaint().setColor(Color.WHITE);

        // Set plot background color
        filterPlot.getGraph().getBackgroundPaint().setColor(Color.rgb(114,194,241));

        // Remove gridlines
        filterPlot.getGraph().getGridBackgroundPaint().setColor(Color.TRANSPARENT);
        filterPlot.getGraph().getDomainGridLinePaint().setColor(Color.TRANSPARENT);
        filterPlot.getGraph().getDomainOriginLinePaint().setColor(Color.TRANSPARENT);
        filterPlot.getGraph().getRangeGridLinePaint().setColor(Color.TRANSPARENT);
        filterPlot.getGraph().getRangeOriginLinePaint().setColor(Color.TRANSPARENT);

        // Remove axis labels and values
        // Domain = X; Range = Y
        filterPlot.setDomainLabel(null);
        filterPlot.setRangeLabel(null);
        filterPlot.getGraph().getRangeGridLinePaint().setColor(Color.TRANSPARENT);
        filterPlot.getGraph().getRangeOriginLinePaint().setColor(Color.TRANSPARENT);
        filterPlot.getGraph().getDomainGridLinePaint().setColor(Color.TRANSPARENT);
        filterPlot.getGraph().getDomainOriginLinePaint().setColor(Color.TRANSPARENT);

        // Remove extraneous elements
        filterPlot.getLayoutManager().remove(filterPlot.getLegend());

        // Set size of plot
        SizeMetric height = new SizeMetric(1, SizeMode.FILL);
        SizeMetric width = new SizeMetric(1, SizeMode.FILL);
        filterPlot.getGraph().setSize(new Size(height, width));

        // Set position of plot (should be tweaked in order to center chart position)
        filterPlot.getGraph().position(0, HorizontalPositioning.ABSOLUTE_FROM_LEFT.ABSOLUTE_FROM_LEFT,
                0, VerticalPositioning.ABSOLUTE_FROM_TOP);

        // Add plot to FilterGraph
        this.addView(filterPlot, new LayoutParams(
                LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT));

        // Explicity visibility setting handles bug on older devices where graph wasn't starting
        onVisibilityChanged(this, View.VISIBLE);
    }

    // Called when user navigates away from parent React Native component. Stops active threads in order to limit memory usage
    @Override
    public void onVisibilityChanged(View changedView, int visibility){
        if (visibility == View.INVISIBLE){
            stopThreads();
        }
        else if (dataThread == null || !dataThread.isAlive()) {
            startDataThread();
            startRenderingThread();
            dataListener = new museDataListener();
            // Register a listener to receive data packets from Muse. Second argument defines which type(s) of data will be transmitted to listener
            appState.connectedMuse.registerDataListener(dataListener, MuseDataPacketType.EEG);
        }
    }

    // --f-------------------------------------------------------
    // Thread management functions

    // Start thread that will  update the data whenever a Muse data packet is receive series
    // and perform data processing
    public void startDataThread() {
        dataThread = new Thread (dataSource);
        dataThread.start();
    }

    // Start thread that will render the plot at a fixed speed
    public void startRenderingThread(){
        renderingThread = new Thread (plotUpdater);
        renderingThread.start();
    }

    // Stop all threads
    public void stopThreads(){
        plotUpdater.stopThread();
        dataSource.stopThread();

        if (dataListener != null) {
            appState.connectedMuse.unregisterDataListener(dataListener, MuseDataPacketType.EEG);
        }
    }

    // --------------------------------------------------------------
    // Listeners

    // Listener that receives incoming Muse data packets and updates the eegbuffer
    class museDataListener extends MuseDataListener {
        // Constructor
        museDataListener() {
        }

        // Called whenever an incoming data packet is received. Handles different types of incoming data packets and updates data correctly
        @Override
        public void receiveMuseDataPacket(final MuseDataPacket p, final Muse muse) {
            getEegChannelValues(newData, p);
            eegBuffer.update(newData);

            // Filter new raw sample
            filtState = activeFilter.transform(newData, filtState);
            filtResult = activeFilter.extractFilteredSamples(filtState);
        }

        // Updates newData array based on incoming EEG channel values
        private void getEegChannelValues(double[] newData, MuseDataPacket p) {
            newData[0] = p.getEegChannelValue(Eeg.EEG1);
            newData[1] = p.        // Explicity visibility setting handles bug on older devices where graph wasn't starting
                    getEegChannelValue(Eeg.EEG2);
            newData[2] = p.getEegChannelValue(Eeg.EEG3);
            newData[3] = p.getEegChannelValue(Eeg.EEG4);
        }

        @Override
        public void receiveMuseArtifactPacket(final MuseArtifactPacket p, final Muse muse) {
            // Put something here about marking noise maybe
        }
    }

    // --------------------------------------------------------------
    // Runnables

    // Runnable class that redraws plot at a fixed frequency
    class MyPlotUpdater implements Runnable {
        Plot plot;
        private boolean keepRunning = true;

        public MyPlotUpdater(Plot plot) {
            this.plot = plot;
        }

        @Override
        public void run() {
            try {
                keepRunning = true;
                while (keepRunning) {
                    // 33ms sleep = 30 fps
                    Thread.sleep(33);
                    plot.redraw();
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        public void stopThread() {
            keepRunning = false;
        }
    }

    // Data source runnable
    // Processes raw EEG data and updates dataSeries
    public class FilterDataSource implements Runnable {
        int stepSize;
        private boolean keepRunning = true;
        EEGFileWriter fileWriter = new EEGFileWriter(getContext(), "Filtered EEG");


        // Choosing these step sizes arbitrarily based on how they look
        public FilterDataSource(Boolean isLowEnergy) {
            if (isLowEnergy) {
                stepSize = 6;
            } else {
                stepSize = 5;
            }
        }

        @Override
        public void run() {
            try {
                while (keepRunning) {
                    if (eegBuffer.getPts() >= stepSize) {
                        if (dataSeries.size() >= PLOT_LENGTH) {
                            dataSeries.removeFirst();
                        }
                        dataSeries.addLast(filtResult[channelOfInterest - 1]);

                        if (isRecording) { fileWriter.addDataToFile(filtResult);}

                        eegBuffer.resetPts();
                    }
                }
            } catch (Exception e) {}
        }

        public void stopThread() {
            keepRunning = false;
        }

    }

}