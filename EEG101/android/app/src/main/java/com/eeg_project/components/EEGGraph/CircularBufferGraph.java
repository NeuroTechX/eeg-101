package com.eeg_project.components.EEGGraph;

import android.content.Context;
import android.graphics.Color;
import android.os.Handler;
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
import com.androidplot.xy.SimpleXYSeries;
import com.androidplot.xy.XYPlot;
import com.androidplot.xy.XYSeries;
import com.choosemuse.libmuse.Eeg;
import com.choosemuse.libmuse.Muse;
import com.choosemuse.libmuse.MuseArtifactPacket;
import com.choosemuse.libmuse.MuseDataListener;
import com.choosemuse.libmuse.MuseDataPacket;
import com.choosemuse.libmuse.MuseDataPacketType;
import com.eeg_project.MainApplication;


import java.util.Arrays;
import com.google.common.primitives.Doubles;
import java.util.LinkedList;
import java.util.NoSuchElementException;

/**
 * Created by dano on 26/10/16.
 */

public class CircularBufferGraph extends FrameLayout {

    // ----------------------------------------------------------------------
    // Variables
    private XYPlot historyPlot;
    private static final int PLOT_LENGTH = 200;
    private CircularBufferGraph.MyPlotUpdater plotUpdater;
    CircularBufferGraph.HistoryDataSource dataSource;
    private DynamicSeries dataSeries;
    private Thread myThread;
    String TAG = "RandomPlot";
    private final Handler handler = new Handler();
    public CircularBufferGraph.museDataListener dataListener;
    private boolean eegStale;
    Thread dataThread;
    Thread renderingThread;

    // Bridged props
    // Default channelOfInterest = 1 (left ear)
    private int channelOfInterest = 1;

    // Reference to global application state used for connected Muse
    MainApplication appState;

    // Circular data buffer
    public double[][] eegBuffer = new double[110][2];
    public int pointsAdded = 0;
    public double[] newData = new double[2];
    public int index = 0;


    // ------------------------------------------------------------------------
    // Constructors
    public CircularBufferGraph(Context context) {
        super(context);
        appState = ((MainApplication)context.getApplicationContext());
        initView(context);
        // Data threads are started in onVisibilityChanged function
    }

    // -----------------------------------------------------------------------
    // Bridge functions

    public void setChannelOfInterest(int channel) {
        channelOfInterest = channel;
    }

    // -----------------------------------------------------------------------
    // Lifecycle methods (initView and onVisibilityChanged)

    // Initialize and style AndroidPlot Graph. XML styling is not used.
    public void initView(Context context) {

        // Set FrameLayout parameters for CircularBufferGraph View, which will be a child of FrameLayout
        FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(
                LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT);

        // Create historyPlot
        historyPlot = new XYPlot(context, "EEG Circ Buffer Plot");

        // Create plotUpdater
        plotUpdater = new CircularBufferGraph.MyPlotUpdater(historyPlot);

        // Create dataSource
        dataSource = new CircularBufferGraph.HistoryDataSource();

        // Create dataSeries that will be drawn on plot (Y will be obtained from dataSource, x will be implicitly generated):
        dataSeries = new DynamicSeries("Buffer Plot");

        // Set X and Y domain
        historyPlot.setRangeBoundaries(400, 1200, BoundaryMode.FIXED);
        historyPlot.setDomainBoundaries(0, PLOT_LENGTH, BoundaryMode.FIXED);

        // add dataSeries to plot and define color of plotted line
        historyPlot.addSeries(dataSeries,
                new LineAndPointFormatter(Color.rgb(255,255,255), null, null, null));

        // Format plot layout
        //Remove margins, padding and border
        historyPlot.setPlotMargins(0, 0, 0, 0);
        historyPlot.setPlotPadding(0, 0, 0, 0);
        historyPlot.getBorderPaint().setColor(Color.WHITE);

        // Set plot background color
        historyPlot.getGraph().getBackgroundPaint().setColor(Color.rgb(114,194,241));

        // Remove gridlines
        historyPlot.getGraph().getGridBackgroundPaint().setColor(Color.TRANSPARENT);
        historyPlot.getGraph().getDomainGridLinePaint().setColor(Color.TRANSPARENT);
        historyPlot.getGraph().getDomainOriginLinePaint().setColor(Color.TRANSPARENT);
        historyPlot.getGraph().getRangeGridLinePaint().setColor(Color.TRANSPARENT);
        historyPlot.getGraph().getRangeOriginLinePaint().setColor(Color.TRANSPARENT);


        // Remove axis labels and values
        // Domain = X; Range = Y
        historyPlot.setDomainLabel(null);
        historyPlot.setRangeLabel(null);
        historyPlot.getGraph().getRangeGridLinePaint().setColor(Color.TRANSPARENT);
        historyPlot.getGraph().getRangeOriginLinePaint().setColor(Color.TRANSPARENT);
        historyPlot.getGraph().getDomainGridLinePaint().setColor(Color.TRANSPARENT);
        historyPlot.getGraph().getDomainOriginLinePaint().setColor(Color.TRANSPARENT);

        // Remove extraneous elements
        historyPlot.getLayoutManager().remove(historyPlot.getLegend());

        // Set size of plot
        SizeMetric height = new SizeMetric(1, SizeMode.FILL);
        SizeMetric width = new SizeMetric(1, SizeMode.FILL);
        historyPlot.getGraph().setSize(new Size(height, width));

        // Set position of plot (should be tweaked in order to center chart position)
        historyPlot.getGraph().position(0, HorizontalPositioning.ABSOLUTE_FROM_LEFT.ABSOLUTE_FROM_LEFT,
                0, VerticalPositioning.ABSOLUTE_FROM_TOP);

        // Add plot to CircularBuffer FrameLayout
        this.addView(historyPlot, params);
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
    //
    public void startRenderingThread(){
        renderingThread = new Thread (plotUpdater);
        renderingThread.start();
    }

    // Start thread that will render the plot at a fixed speed
    //
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

            // valuesSize returns the number of data values contained in the packet.
            final long n = p.valuesSize();
            switch (p.packetType()) {
                case EEG:
                    getEegChannelValues(newData,p);
                    eegBuffer = updateBuffer(eegBuffer, newData);
                    eegStale = true;
                    break;
                case ACCELEROMETER:
                    // Can do other things here for different types of packets
                case ALPHA_RELATIVE:
                case BATTERY:
                case DRL_REF:
                case QUANTIZATION:
                default:
                    break;
            }
        }

        // Circular Buffer

        // Updates newData array based on incoming EEG channel values
        private void getEegChannelValues(double[] newData, MuseDataPacket p) {
            newData[0] = p.getEegChannelValue(Eeg.EEG1);
            newData[1] = p.getEegChannelValue(Eeg.EEG2);
            //newData[2] = p.getEegChannelValue(Eeg.EEG3);
            //newData[3] = p.getEegChannelValue(Eeg.EEG4);
        }

        // Adds newData array to current index in circular buffer. When buffer is full, index is reset
        // newData is currently 1D, but could be made 2D in the future.
        private double[][] updateBuffer(double[][] buffer, double[] newData) {
            buffer[index] = newData;
            index++;
            pointsAdded++;
            if (index >= buffer.length - 1) { index = 0;}
            return buffer;
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
    // Updates dataSeries, has room for data processing
    public class HistoryDataSource implements Runnable {

        //private MyObservable notifier;
        private boolean keepRunning = true;

        @Override
        public void run() {
            android.os.Process.setThreadPriority(android.os.Process.THREAD_PRIORITY_BACKGROUND);
            keepRunning = true;
            try {
                while (keepRunning) {
                    Thread.sleep(2);
                    if (dataSeries.size() > PLOT_LENGTH) {
                        dataSeries.removeFirst();
                    }
                    // Performs a data processing operation on a ~1s sample of EEG data
                    if (pointsAdded >= 110) {

                        // Data processing methods will go here
                        // TODO write filtering, artifact detection, and fourier transform methods
                        // TODO implement EJML Matrix library to be able to easily take subarrays of eegBuffer
                        dataSeries.addLast(eegBuffer[index][0]);
                        pointsAdded = 0;
                    }
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        public void stopThread() {
            keepRunning = false;
        }

    }

    // ---------------------------------------------------------------------
// Data Series

    // AndroidPlot class that stores data to be plotted. getX() and getY() are called by XYPlot to to draw graph
    // This implementation only stores Y values, with X values implicitily determined by the index of the data in the LinkedList
    class DynamicSeries implements XYSeries {
        //private int index;
        private String title;
        private volatile LinkedList<Number> yVals = new LinkedList<Number>();



        public DynamicSeries(String title) {
            this.title = title;
        }

        @Override
        public String getTitle() {
            return title;
        }

        @Override
        public int size() {
            return yVals != null ? yVals.size() : 0;
        }

        @Override
        public Number getX(int index) {
            return index;
        }

        @Override
        public Number getY(int index) {
            return yVals.get(index);
        }

        public void addFirst(Number y) {
            yVals.addFirst(y);
        }

        public void addLast(Number y) {
            yVals.addLast(y);
        }

        public void addAll(double[] y) {
            yVals.addAll(Doubles.asList(y));
        }

        public void removeFirst() {
            if (size() <= 0) {
                throw new NoSuchElementException();
            }
            yVals.removeFirst();
        }

        public void removeLast() {
            if (size() <= 0) {
                throw new NoSuchElementException();
            }
            yVals.removeLast();
        }

        public void clear() {
            yVals.clear();
        }

    }
}
