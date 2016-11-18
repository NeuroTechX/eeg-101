package com.eeg_project.components.EEGGraph;

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

// Android View that graphs processed EEG data
public class CircularBufferGraph extends FrameLayout {

    // ----------------------------------------------------------------------
    // Variables
    private XYPlot circBufferPlot;
    private static final int PLOT_LENGTH = 220;
    private CircularBufferGraph.MyPlotUpdater plotUpdater;
    CircularBufferGraph.HistoryDataSource dataSource;
    private DynamicSeries dataSeries;
    public CircularBufferGraph.museDataListener dataListener;
    private boolean eegFresh;
    Thread dataThread;
    Thread renderingThread;

    // Bridged props
    // Default channelOfInterest = 1 (left ear)
    private int channelOfInterest = 1;

    // Reference to global application state used for connected Muse
    MainApplication appState;

    // Signal processing
    public CircularBuffer eegBuffer = new CircularBuffer(220, 4);
    public CircularBuffer filteredBuffer = new CircularBuffer(220, 4);
    public Filter filter = new Filter(220, "bandpass");
    public double[] newData = new double[4];

    // ------------------------------------------------------------------------
    // Constructors
    public CircularBufferGraph(Context context) {
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
        plotUpdater = new CircularBufferGraph.MyPlotUpdater(circBufferPlot);

        // Create dataSource
        dataSource = new CircularBufferGraph.HistoryDataSource();

        // Create dataSeries that will be drawn on plot (Y will be obtained from dataSource, x will be implicitly generated):
        dataSeries = new DynamicSeries("Buffer Plot");

        // Set X and Y domain
        circBufferPlot.setRangeBoundaries(-10, 10, BoundaryMode.FIXED);
        circBufferPlot.setDomainBoundaries(0, PLOT_LENGTH, BoundaryMode.FIXED);

        // add dataSeries to plot and define color of plotted line
        circBufferPlot.addSeries(dataSeries,
                new LineAndPointFormatter(Color.rgb(255,255,255), null, null, null));

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
    }

    // Called when user navigates away from parent React Native component. Stops active threads in order to limit memory usage
    @Override
    public void onVisibilityChanged(View changedView, int visibility){
        if (visibility == View.INVISIBLE){
            stopThreads();
        }
        else{
            startDataThread();
            startRenderingThread();
            dataListener = new CircularBufferGraph.museDataListener();
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

        double[][] latestSamples;
        double[][] filteredSamples;
        double[] filtResult;

        // Constructor
        museDataListener() {
        }

        // Called whenever an incoming data packet is received. Handles different types of incoming data packets and updates data correctly
        @Override
        public void receiveMuseDataPacket(final MuseDataPacket p, final Muse muse) {
            switch (p.packetType()) {
                case EEG:
                    getEegChannelValues(newData,p);
                    eegBuffer.update(newData);
                    if (dataSeries.size() >= PLOT_LENGTH) {
                        dataSeries.clear();
                    }
                    // Extract latest raw and filtered samples
                    latestSamples = eegBuffer.extract(filter.getNB());
                    filteredSamples = filteredBuffer.extract(filter.getNA() - 1);

                    // Filter new raw sample
                    filtResult = filter.transform(latestSamples, filteredSamples);
                    Log.w("EEG 101", "filtRes: " + filtResult[channelOfInterest - 1]);

                    // Update filtered buffer
                    filteredBuffer.update(filtResult);
                    dataSeries.addLast(filtResult[channelOfInterest - 1] );
                    break;
                default:
                    break;
            }
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
    public class HistoryDataSource implements Runnable {

        //private MyObservable notifier;
        private boolean keepRunning = true;



        @Override
        public void run() {
            android.os.Process.setThreadPriority(android.os.Process.THREAD_PRIORITY_BACKGROUND);
            keepRunning = true;
                while (keepRunning) {

                }
        }

        public void stopThread() {
            keepRunning = false;
        }

    }

}
