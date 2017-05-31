package com.eeg_project.components.graphs;

import android.content.Context;
import android.graphics.Color;
import android.util.Log;
import android.view.View;
import android.widget.FrameLayout;

import com.androidplot.Plot;
import com.androidplot.ui.HorizontalPositioning;
import com.androidplot.ui.Size;
import com.androidplot.ui.SizeMetric;
import com.androidplot.ui.SizeMode;
import com.androidplot.ui.VerticalPositioning;
import com.androidplot.xy.BoundaryMode;
import com.androidplot.xy.FastLineAndPointRenderer;
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

import java.lang.ref.WeakReference;

/*
View that plots a single-channel filtered EEG graph
Bandstop, bandpass, high-pass, and low-pass filters are availabe in Filter class

Plotting process:
1. Creates AndroidPlot graph and MuseDataListener for EEG dataSource packets
2. MuseDataListener updates circular eegBuffer at 220-260hz
3. raw dataSource is filtered as it comes in with Butterworth filters from DSP Library
3. dataThread and renderThread add latest filter result to dataSeries and render plot at a fixed
frequency
*/
public class FilterGraph extends FrameLayout {

    // ----------------------------------------------------------------------
    // Variables

    public XYPlot filterPlot;
    private static final int PLOT_LENGTH = 366;
    private static final String PLOT_TITLE = "Filtered_EEG";
    private int PLOT_LOW_BOUND = 600;
    private int PLOT_HIGH_BOUND = 1000;
    public PlotUpdater plotUpdater;
    private FilterDataSource dataSource;
    private LineAndPointFormatter lineFormatter;
    public DynamicSeries dataSeries;
    private museDataListener dataListener;

    Thread dataThread;
    Thread renderingThread;

    // Reference to global application state used for connected Muse
    MainApplication appState;

    // Filter specific variables
    public int samplingRate;
    public CircularBuffer eegBuffer = new CircularBuffer(220, 4);
    public Filter activeFilter;
    // Filter states represent info about previous samples; intermediate values that represent
    // polynomial components determined by previous samples in the epoch. For more info, read the Rational Transfer Function description here: https://www.mathworks.com/help/matlab/ref/filter.html
    public double[][] filtState;


    // Bridged props
    // Default channelOfInterest = 1 (left ear)
    public int channelOfInterest = 1;

    public double[] latestData;

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
        stopThreads();
        dataSeries.clear();

        if(appState.connectedMuse.isLowEnergy()) { samplingRate = 256; }
        else { samplingRate = 220; }

        switch(filterType) {
            case "LOWPASS":
                PLOT_LOW_BOUND = 600;
                PLOT_HIGH_BOUND = 1000;
                filterPlot.setRangeBoundaries(PLOT_LOW_BOUND, PLOT_HIGH_BOUND, BoundaryMode.FIXED);
                activeFilter = new Filter(samplingRate, "lowpass", 5, 35, 0);
                filtState = new double[4][activeFilter.getNB()];
                break;

            case "BANDPASS":
                PLOT_LOW_BOUND = -200;
                PLOT_HIGH_BOUND = 200;
                filterPlot.setRangeBoundaries(PLOT_LOW_BOUND, PLOT_HIGH_BOUND, BoundaryMode.FIXED);
                activeFilter = new Filter(samplingRate, "bandpass", 5, 2, 35);
                filtState = new double[4][activeFilter.getNB()];
                break;

            case "HIGHPASS":
                PLOT_LOW_BOUND = -200;
                PLOT_HIGH_BOUND = 200;
                filterPlot.setRangeBoundaries(PLOT_LOW_BOUND, PLOT_HIGH_BOUND, BoundaryMode.FIXED);
                activeFilter = new Filter(samplingRate, "highpass", 2, 1, 0);
                filtState = new double[4][activeFilter.getNB()];
                break;
        }
        startDataThread();
        startRenderingThread();
    }

    public void startRecording() {
        dataSource.fileWriter.initFile(PLOT_TITLE);
        dataSource.isRecording = true;
    }

    public void stopRecording() {
        dataSource.isRecording = false;
        // if writer = writing, close and save file
        if (dataSource != null && dataSource.fileWriter.isRecording()) {
            dataSource.fileWriter.writeFile(PLOT_TITLE);
        }
    }

    // -----------------------------------------------------------------------
    // Lifecycle methods (initView and onVisibilityChanged)

    // Initialize and style AndroidPlot Graph. XML styling is not used.
    public void initView(Context context) {
        filterPlot = new XYPlot(context, PLOT_TITLE);

        // Create plotUpdater
        plotUpdater = new PlotUpdater(filterPlot);

        // Create dataSource
        dataSource = new FilterDataSource(appState.connectedMuse.isLowEnergy());

        // Create dataSeries that will be drawn on plot (Y will be obtained from dataSource, x will be implicitly generated):
        dataSeries = new DynamicSeries(PLOT_TITLE);

        // Set X and Y domain
        filterPlot.setRangeBoundaries(PLOT_LOW_BOUND, PLOT_HIGH_BOUND, BoundaryMode.FIXED);
        filterPlot.setDomainBoundaries(0, PLOT_LENGTH, BoundaryMode.FIXED);

        // add dataSeries to plot and define color of plotted line
        // Create line formatter with set color
        lineFormatter = new FastLineAndPointRenderer.Formatter(Color.rgb(255, 255, 255), null, null, null);

        // Set line thickness
        lineFormatter.getLinePaint().setStrokeWidth(3);

        filterPlot.addSeries(dataSeries,
                lineFormatter);

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
        }
    }

    // --f-------------------------------------------------------
    // Thread management functions

    // Start thread that will  update the dataSource whenever a Muse dataSource packet is receive series
    // and perform dataSource processing
    public void startDataThread() {
        Log.w("Filter", "startDataThread called");
        dataListener = new museDataListener();
        // Register a listener to receive dataSource packets from Muse. Second argument defines which type(s) of dataSource will be transmitted to listener
        appState.connectedMuse.registerDataListener(dataListener, MuseDataPacketType.EEG);
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

    // Listener that receives incoming Muse dataSource packets and updates the eegbuffer
    private final class museDataListener extends MuseDataListener {
        private double[] newData;
        // Filter variables
        public boolean filterOn = false;
        public Filter bandstopFilter;
        public double[][] bandstopFiltState;
        public double[] bandstopFiltResult;

        museDataListener() {
            if (appState.connectedMuse.isLowEnergy()) {
                filterOn = true;
                bandstopFilter = new Filter(256, "bandstop", 5, 55, 65);
                bandstopFiltState = new double[4][bandstopFilter.getNB()];
            }
            newData = new double[4];
        }

        // Called whenever an incoming dataSource packet is received. Handles different types of incoming dataSource packets and updates dataSource correctly
        @Override
        public void receiveMuseDataPacket(final MuseDataPacket p, final Muse muse) {
            getEegChannelValues(newData, p);

            if(filterOn) {
                bandstopFiltState = bandstopFilter.transform(newData, bandstopFiltState);
                newData = bandstopFilter.extractFilteredSamples(bandstopFiltState);
            }

            filtState = activeFilter.transform(newData, filtState);
            eegBuffer.update(activeFilter.extractFilteredSamples(filtState));
            if (dataSource.isRecording) { dataSource.fileWriter.addDataToFile(eegBuffer.extract(1)[channelOfInterest - 1]);}
        }

        // Updates newData array based on incoming EEG channel values
        private void getEegChannelValues(double[] newData, MuseDataPacket p) {
            newData[0] = p.getEegChannelValue(Eeg.EEG1);
            newData[1] = p.getEegChannelValue(Eeg.EEG2);
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
    class PlotUpdater implements Runnable {
        WeakReference<Plot> plot;
        private boolean keepRunning = true;

        public PlotUpdater(Plot plot) {
            this.plot = new WeakReference<Plot>(plot);
        }

        @Override
        public void run() {
            try {
                keepRunning = true;
                while (keepRunning) {
                    // 33ms sleep = 30 fps
                    Thread.sleep(33);
                    plot.get().redraw();
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
    // Processes raw EEG dataSource and updates dataSeries
    public final class FilterDataSource implements Runnable {
        private boolean keepRunning;
        public EEGFileWriter fileWriter = new EEGFileWriter(getContext(), PLOT_TITLE);
        public boolean isRecording;
        double lastData = 100;

        // Choosing these step sizes arbitrarily based on how they look
        public FilterDataSource(Boolean isLowEnergy) {
        }

        // with getPts = 1, est. sampling rate 193-203hz
        // with no pts, sleep = 5s, 155hz
        // with pts = 1, sleep = 4s, 25HZ
        // with eeg processing code in muse listener, 256hz

        @Override
        public void run() {
            try {
                keepRunning = true;
                while (keepRunning) {
                    if(eegBuffer.getPts()>=3) {
                        if (dataSeries.size() >= PLOT_LENGTH) {
                            dataSeries.removeFirst();
                        }
                        dataSeries.addLast(eegBuffer.extract(1)[0][channelOfInterest - 1]);
                        eegBuffer.resetPts();
                    }
                }
            } catch (Exception e) {}
        }

        public void stopThread() {
            keepRunning = false;
            if (isRecording) {
                fileWriter.writeFile(PLOT_TITLE);
            }
        }
    }
}