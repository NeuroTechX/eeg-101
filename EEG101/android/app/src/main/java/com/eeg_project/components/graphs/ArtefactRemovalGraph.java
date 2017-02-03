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



import com.eeg_project.components.signal.CircularBuffer;
import com.eeg_project.components.signal.Filter;
import com.eeg_project.components.signal.NoiseDetector;



// Android View that graphs processed EEG data
public class ArtefactRemovalGraph extends FrameLayout {

    // ----------------------------------------------------------------------
    // Variables
    public XYPlot circBufferPlot;
    private static final int PLOT_LENGTH = 220;
    public MyPlotUpdater plotUpdater;
    private FilterDataSource dataSource;
    public DynamicSeries dataSeries;
    public museDataListener dataListener;
    double[] filtResult;
    public int samplesCollected = 0;
    public boolean eegFresh;
    Thread dataThread;
    Thread renderingThread;

    LineAndPointFormatter lineFormatter;


    // Reference to global application state used for connected Muse
    MainApplication appState;

    // CircBuffer specific variables
    public CircularBuffer eegBuffer = new CircularBuffer(220, 4);
    public CircularBuffer filteredBuffer = new CircularBuffer(220, 4);
    public Filter filter = new Filter(220, "lowpass");
    public double[] newData = new double[4];

    // Bridged props
    // Default channelOfInterest = 1 (left ear)
    public int channelOfInterest = 1;

    // ------------------------------------------------------------------------
    // Constructors
    public ArtefactRemovalGraph(Context context) {
        super(context);
        appState = ((MainApplication)context.getApplicationContext());
        initView(context);
        // Data threads are started in onVisibilityChanged function
    }

    // -----------------------------------------------------------------------
    // Bridge functions (can be called from JS by setting props)
    public void setChannelOfInterest(int channel) {
        channelOfInterest = channel;
    }

    // -----------------------------------------------------------------------
    // Lifecycle methods (initView and onVisibilityChanged)

    // Initialize and style AndroidPlot Graph. XML styling is not used.
    public void initView(Context context) {

        // Create circBufferPlot
        circBufferPlot = new XYPlot(context, "EEG Circ Buffer Plot");

        // Create plotUpdater
        plotUpdater = new ArtefactRemovalGraph.MyPlotUpdater(circBufferPlot);

        // Create dataSource
        dataSource = new FilterDataSource(appState.connectedMuse.isLowEnergy());

        // Create dataSeries that will be drawn on plot (Y will be obtained from dataSource, x will be implicitly generated):
        dataSeries = new DynamicSeries("Buffer Plot");

        // Set X and Y domain
        circBufferPlot.setRangeBoundaries(500, 1100, BoundaryMode.FIXED);
        circBufferPlot.setDomainBoundaries(0, PLOT_LENGTH, BoundaryMode.FIXED);

        // Create line formatter with set color
        lineFormatter = new FastLineAndPointRenderer.Formatter(Color.rgb(255, 255, 255), null, null, null);

        // add series to plot
        circBufferPlot.addSeries(dataSeries,
                lineFormatter);

        // Format plot layout
        //Remove margins, padding and border
        circBufferPlot.setPlotMargins(0, 0, 0, 0);
        circBufferPlot.setPlotPadding(0, 0, 0, 0);
        circBufferPlot.getBorderPaint().setColor(Color.WHITE);

        // Set plot background color
        circBufferPlot.getGraph().getBackgroundPaint().setColor(Color.rgb(114,194,241));

        // Remove gridlines
        circBufferPlot.getGraph().getGridBackgroundPaint().setColor(Color.TRANSPARENT);
        circBufferPlot.getGraph().getDomainGridLinePaint().setColor(Color.TRANSPARENT);
        circBufferPlot.getGraph().getDomainOriginLinePaint().setColor(Color.TRANSPARENT);
        circBufferPlot.getGraph().getRangeGridLinePaint().setColor(Color.TRANSPARENT);
        circBufferPlot.getGraph().getRangeOriginLinePaint().setColor(Color.TRANSPARENT);


        // Remove axis labels and values
        // Domain = X; Range = Y
        circBufferPlot.setDomainLabel(null);
        circBufferPlot.setRangeLabel(null);
        circBufferPlot.getGraph().getRangeGridLinePaint().setColor(Color.TRANSPARENT);
        circBufferPlot.getGraph().getRangeOriginLinePaint().setColor(Color.TRANSPARENT);
        circBufferPlot.getGraph().getDomainGridLinePaint().setColor(Color.TRANSPARENT);
        circBufferPlot.getGraph().getDomainOriginLinePaint().setColor(Color.TRANSPARENT);

        // Remove extraneous elements
        circBufferPlot.getLayoutManager().remove(circBufferPlot.getLegend());

        // Set size of plot
        SizeMetric height = new SizeMetric(1, SizeMode.FILL);
        SizeMetric width = new SizeMetric(1, SizeMode.FILL);
        circBufferPlot.getGraph().setSize(new Size(height, width));

        // Set position of plot (should be tweaked in order to center chart position)
        circBufferPlot.getGraph().position(0, HorizontalPositioning.ABSOLUTE_FROM_LEFT.ABSOLUTE_FROM_LEFT,
                0, VerticalPositioning.ABSOLUTE_FROM_TOP);

        // Add plot to CircularBufferGraph
        this.addView(circBufferPlot, new FrameLayout.LayoutParams(
                LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT));

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
            dataListener = new ArtefactRemovalGraph.museDataListener();
            // Register a listener to receive data packets from Muse. Second argument defines which type(s) of data will be transmitted to listener
            appState.connectedMuse.registerDataListener(dataListener, MuseDataPacketType.EEG);
        }
    }

    // ---------------------------------------------------------
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
        double[][] latestSamples;
        double[][] filteredSamples;
        int windowLength = 220;
        double[][] filtWindow = new double[windowLength][4];
        private boolean keepRunning = true;
        NoiseDetector noiseDetector = new NoiseDetector(6000.0); // Should probably be around 400
        // (uV^2)
        boolean[] noiseDecisions = new boolean[4];


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
                        // Extract latest raw and filtered samples
                        latestSamples = eegBuffer.extract(filter.getNB());
                        filteredSamples = filteredBuffer.extract(filter.getNA() - 1);

                        // Filter new raw sample
                        filtResult = filter.transform(latestSamples, filteredSamples);

                        // Update filtered buffer
                        filteredBuffer.update(filtResult);

                        // Noise Detection
                        filtWindow = filteredBuffer.extractTransposed(windowLength);
                        noiseDecisions = noiseDetector.detectArtefact(filtWindow);

                        if (noiseDecisions[0] == true) {
                            Log.w("artefacts", "artefact detected!");
                            lineFormatter.getLinePaint().setColor(Color.rgb(0,153,135));

                        } else { lineFormatter.getLinePaint().setColor(Color.rgb(232,106,33));}
                        dataSeries.addLast(filtResult[channelOfInterest - 1]);

                        eegBuffer.resetPts();
                    }
                }
            } catch (Exception e) {
            }
        }

        public void stopThread() {
            keepRunning = false;
        }

    }

}