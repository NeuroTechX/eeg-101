package com.eeg101.components.EEGGraph;

import android.content.Context;
import android.graphics.Color;
import android.os.Handler;
import android.util.AttributeSet;
import android.util.Log;
import android.view.View;
import android.widget.FrameLayout;

import com.androidplot.Plot;
import com.androidplot.ui.HorizontalPositioning;
import com.androidplot.ui.Size;
import com.androidplot.ui.Size;
import com.androidplot.ui.SizeMetric;
import com.androidplot.ui.SizeMode;
import com.androidplot.ui.VerticalPositioning;
import com.androidplot.xy.BoundaryMode;
import com.androidplot.xy.FastLineAndPointRenderer;
import com.androidplot.xy.SimpleXYSeries;
import com.androidplot.xy.XYPlot;
import com.androidplot.xy.XYSeries;
import com.choosemuse.libmuse.Eeg;
import com.choosemuse.libmuse.Muse;
import com.choosemuse.libmuse.MuseArtifactPacket;
import com.choosemuse.libmuse.MuseDataListener;
import com.choosemuse.libmuse.MuseDataPacket;
import com.choosemuse.libmuse.MuseDataPacketType;
import com.eeg101.MainApplication;

import java.lang.reflect.Array;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.NoSuchElementException;


// Android View that handles basic single channel EEGGraph activities
public class EEGGraph extends FrameLayout {

    // ----------------------------------------------------------------------
    // Variables
    private XYPlot historyPlot;
    private static final int PLOT_LENGTH = 200;
    private MyPlotUpdater plotUpdater;
    HistoryDataSource data;
    private DynamicSeries historySeries;
    private Thread myThread;
    String TAG = "RandomPlot";
    private final Handler handler = new Handler();
    Thread dataThread;
    Thread renderingThread;

    // Bridged props
    // Default channelOfInterest = 1 (left ear)
    private int channelOfInterest = 1;

    // grab reference to global Muse
    MainApplication appState;


    public DataListener dataListener;
    private final double[] eegBuffer = new double[6];
    private boolean eegStale;


    // ------------------------------------------------------------------------
    // Constructors
    public EEGGraph(Context context) {
        super(context);
        appState = ((MainApplication)context.getApplicationContext());

        initView(context);
        // Data threads are started in onVisibilityChanged function
    }

    public EEGGraph(Context context, AttributeSet attrs) {
        super(context, attrs);
        initView(context);
    }

    public EEGGraph(Context context, AttributeSet attrs, int defStyle) {
        this(context, attrs);
        initView(context);
    }

    // -----------------------------------------------------------------------
    // Bridge functions

    public void setChannelOfInterest(int channel) {
        channelOfInterest = channel;
        historySeries.clear();
    }

    // -----------------------------------------------------------------------
    // Lifecycle methods (initView and onVisibilityChanged)

    public void initView(Context context) {

        //This view is styled entirely within this function. XML is not used at all
        // Parameters for EEGGraph Chld
        LayoutParams params = new LayoutParams(
                LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT);

        // Create historyPlot
        historyPlot = new XYPlot(context, "EEG History Plot");

        // set up PlotUpdater
        plotUpdater = new MyPlotUpdater(historyPlot);

        // get datasets (Y will be historySeries, x will be implicitly generated):
        data = new HistoryDataSource();
        historySeries = new DynamicSeries("EEG data");

        // Set X and Y domain
        historyPlot.setRangeBoundaries(400, 1200, BoundaryMode.FIXED);
        historyPlot.setDomainBoundaries(0, PLOT_LENGTH, BoundaryMode.FIXED);


        // add series to plot
        historyPlot.addSeries(historySeries,
                new FastLineAndPointRenderer.Formatter(Color.rgb(255,255,255), null, null, null));

        // hook up series to data source
        //data.addObserver(plotUpdater);

        // Format plot layout
        //Remove margins, padding and border
        historyPlot.setPlotMargins(0, 0, 0, 0);
        historyPlot.setPlotPadding(0, 0, 0, 0);
        historyPlot.getBorderPaint().setColor(Color.WHITE);

        // Make plot background blue (including removing grid lines)
        historyPlot.getGraph().getBackgroundPaint().setColor(Color.rgb(114,194,241));
        //historyPlot.getGraph().setBackgroundPaint(null);


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
        //historyPlot.setTitle(null);
        historyPlot.getLayoutManager().remove(historyPlot.getLegend());

        SizeMetric height = new SizeMetric(1, SizeMode.FILL);
        SizeMetric width = new SizeMetric(1, SizeMode.FILL);
        // Set size of plot
        historyPlot.getGraph().setSize(new Size(height, width));

        // Set position of plot (should be tweaked in order to center chart position)
        historyPlot.getGraph().position(0, HorizontalPositioning.ABSOLUTE_FROM_LEFT.ABSOLUTE_FROM_LEFT,
                0, VerticalPositioning.ABSOLUTE_FROM_TOP);

        // Add children to EEGGraph
        this.addView(historyPlot, params);

    }

    @Override
    public void onVisibilityChanged(View changedView, int visibility){
        if (visibility == View.INVISIBLE){
            stopThreads();
        }
        else{
            startDataThread();
            startRenderingThread();
            // Register a listener to receive connection state changes.
            dataListener = new DataListener();
            appState.connectedMuse.registerDataListener(dataListener, MuseDataPacketType.EEG);
        }
    }

    // ---------------------------------------------------------
    // Thread management functions

    // Start thread that will  update the data whenever a Muse data packet is receive series
    // and perform data processing
    public void startDataThread() {
        dataThread = new Thread (data);
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
        data.stopThread();

        if (dataListener != null) {
            appState.connectedMuse.unregisterDataListener(dataListener, MuseDataPacketType.EEG);
        }
    }

    // --------------------------------------------------------------
    // Listeners
    class DataListener extends MuseDataListener {

        DataListener() {
        }

        @Override
        public void receiveMuseDataPacket(final MuseDataPacket p, final Muse muse) {
            // valuesSize returns the number of data values contained in the packet.
            final long n = p.valuesSize();
            switch (p.packetType()) {
                case EEG:
                    assert(eegBuffer.length >= n);
                    getEegChannelValues(eegBuffer,p);
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

        private void getEegChannelValues(double[] buffer, MuseDataPacket p) {
            buffer[0] = p.getEegChannelValue(Eeg.EEG1);
            buffer[1] = p.getEegChannelValue(Eeg.EEG2);
            buffer[2] = p.getEegChannelValue(Eeg.EEG3);
            buffer[3] = p.getEegChannelValue(Eeg.EEG4);
            /*
            buffer[4] = p.getEegChannelValue(Eeg.AUX_LEFT);
            buffer[5] = p.getEegChannelValue(Eeg.AUX_RIGHT);
            */
        }

        @Override
        public void receiveMuseArtifactPacket(final MuseArtifactPacket p, final Muse muse) {

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
                    Thread.sleep(12);
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


    // Updates historySeries, performs data processing
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
                    if (eegStale) {
                        if (historySeries.size() > PLOT_LENGTH) {
                            historySeries.clear();
                        }

                        historySeries.addLast(eegBuffer[channelOfInterest-1]);
                        eegStale = false;
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

        public void addAll(Number[] y) {
            yVals.addAll(Arrays.asList(y));

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
