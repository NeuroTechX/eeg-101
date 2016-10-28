package com.eeg_101.components.EEGGraph;

import android.content.Context;
import android.util.AttributeSet;
import android.graphics.*;
import android.view.View;
import android.widget.FrameLayout;
import android.os.Handler;

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
import com.choosemuse.libmuse.Eeg;
import com.choosemuse.libmuse.Muse;
import com.choosemuse.libmuse.MuseArtifactPacket;
import com.choosemuse.libmuse.MuseDataListener;
import com.choosemuse.libmuse.MuseDataPacket;
import com.choosemuse.libmuse.MuseDataPacketType;
import com.eeg_101.MainApplication;


// Android View that handles basic single channel EEGGraph activities
public class EEGGraph extends FrameLayout {

    // ----------------------------------------------------------------------
    // Variables
    private XYPlot historyPlot;
    private static final int PLOT_LENGTH = 200;
    private MyPlotUpdater plotUpdater;
    HistoryDataSource data;
    private SimpleXYSeries historySeries;
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
    }

    // -----------------------------------------------------------------------
    // Lifecycle methods (initView and onVisibilityChanged)

    public void initView(Context context) {

        //This view is styled entirely within this function. XML is not used at all
        // Parameters for EEGGraph Chld
        FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(
                LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT);

        // Create historyPlot
        historyPlot = new XYPlot(context, "EEG History Plot");

        // set up PlotUpdater
        plotUpdater = new MyPlotUpdater(historyPlot);

        // get datasets (Y will be historySeries, x will be implicitly generated):
        data = new HistoryDataSource();
        historySeries = new SimpleXYSeries("Sample");
        historySeries.useImplicitXVals();


        // Set X and Y domain
        historyPlot.setRangeBoundaries(400, 1200, BoundaryMode.FIXED);
        historyPlot.setDomainBoundaries(0, PLOT_LENGTH, BoundaryMode.FIXED);


        // add series to plot
        historyPlot.addSeries(historySeries,
                new LineAndPointFormatter(Color.rgb(255,255,255), null, null, null));

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

    // PlotUpdater My observer class that will redraw plot
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
                            historySeries.removeFirst();
                        }

                        historySeries.addLast(null, eegBuffer[channelOfInterest-1]);
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


        /*
        public void addObserver(Observer observer) {
            notifier.addObserver(observer);
        }
        */
    }
}
