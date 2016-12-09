package com.eeg_project.components.EEGGraph;

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

import java.lang.ref.WeakReference;


// Android View that handles basic single channel EEGGraph activities
public class EEGGraph extends FrameLayout {

    // ----------------------------------------------------------------------
    // Variables
    public XYPlot eegPlot;
    public static final int PLOT_LENGTH = 220;
    public PlotUpdater plotUpdater;
    EEGDataSource data;
    public DynamicSeries dataSeries;
    String TAG = "EEGGraph";
    Thread dataThread;
    Thread renderingThread;
    LineAndPointFormatter lineFormatter;
    public DataListener dataListener;
    public final double[] eegBuffer = new double[4];
    private boolean eegStale;

    // Bridged props
    // Default channelOfInterest = 1 (left ear)
    public int channelOfInterest = 1;

    // Grab reference to global Muse
    MainApplication appState;

    // ------------------------------------------------------------------------
    // Constructors
    public EEGGraph(Context context) {
        super(context);
        appState = ((MainApplication)context.getApplicationContext());
        initView(context);
    }

    // -----------------------------------------------------------------------
    // Bridge functions
    public void setChannelOfInterest(int channel) {

        channelOfInterest = channel;
        dataSeries.clear();
        /* Uncomment to make plot change color based on selected electrode
        eegPlot.getGraph().getBackgroundPaint().setColor(Color.rgb(255,255,255));

        // Set color based on selected channel
        switch(channel) {
            case 1:
                lineFormatter.getLinePaint().setColor(Color.rgb(232,106,33));
                break;
            case 2:
                lineFormatter.getLinePaint().setColor(Color.rgb(0,153,135));
                break;
            case 3:
                lineFormatter.getLinePaint().setColor(Color.rgb(86,92,155));
                break;
            case 4:
                lineFormatter.getLinePaint().setColor(Color.rgb(209,14,137));
                break;
        }
        */
    }

    // -----------------------------------------------------------------------
    // Lifecycle methods (initView and onVisibilityChanged)

    // Initializes and styles the AndroidPlot XYPlot component of EEGGraph
    // All styling is performed entirely within this function, XML is not used
    public void initView(Context context) {

        // Create eegPlot
        eegPlot = new XYPlot(context, "Raw EEG Plot");

        // Create PlotUpdater and EEGDataSource runnables
        plotUpdater = new PlotUpdater(eegPlot);
        data = new EEGDataSource(appState.connectedMuse.isLowEnergy());

        // Create series that will actually be drawn on eegPlot
        // (Y will be dataSeries, x will be implicitly generated):
        dataSeries = new DynamicSeries("EEG data");

        // Set X and Y domain
        eegPlot.setRangeBoundaries(500, 1100, BoundaryMode.FIXED);
        eegPlot.setDomainBoundaries(0, PLOT_LENGTH, BoundaryMode.FIXED);

        // This is critical for being able to set the color of the plot
        // (Unused unless code in onVisibilityChanged is uncommented
        // PixelUtils.init(getContext());

        // Create line formatter with set color
        //lineFormatter = new LineAndPointFormatter(Color.rgb(255,255,255), null, null, null);
        lineFormatter = new FastLineAndPointRenderer.Formatter(Color.rgb(255, 255, 255), null,
                null, null);

        // add dataSeries to plot to be drawn by lineFormatter
        eegPlot.addSeries(dataSeries, lineFormatter);

        // Format plot layout
        //Remove margins, padding and border
        eegPlot.setPlotMargins(0, 0, 0, 0);
        eegPlot.setPlotPadding(0, 0, 0, 0);
        // eegPlot.getBorderPaint().setColor(Color.WHITE);

        // Make plot background blue sand remove grid lines
        eegPlot.getGraph().getBackgroundPaint().setColor(Color.rgb(114, 194, 241));
        eegPlot.getGraph().getGridBackgroundPaint().setColor(Color.TRANSPARENT);
        eegPlot.getGraph().getDomainGridLinePaint().setColor(Color.TRANSPARENT);
        eegPlot.getGraph().getDomainOriginLinePaint().setColor(Color.TRANSPARENT);
        eegPlot.getGraph().getRangeGridLinePaint().setColor(Color.TRANSPARENT);
        eegPlot.getGraph().getRangeOriginLinePaint().setColor(Color.TRANSPARENT);

        // Remove axis labels and values
        // Domain = X; Range = Y
        eegPlot.setDomainLabel(null);
        eegPlot.setRangeLabel(null);
        eegPlot.getGraph().getRangeGridLinePaint().setColor(Color.TRANSPARENT);
        eegPlot.getGraph().getRangeOriginLinePaint().setColor(Color.TRANSPARENT);
        eegPlot.getGraph().getDomainGridLinePaint().setColor(Color.TRANSPARENT);
        eegPlot.getGraph().getDomainOriginLinePaint().setColor(Color.TRANSPARENT);

        // Remove legend
        eegPlot.getLayoutManager().remove(eegPlot.getLegend());

        // Set size of plot
        SizeMetric height = new SizeMetric(1, SizeMode.FILL);
        SizeMetric width = new SizeMetric(1, SizeMode.FILL);
        eegPlot.getGraph().setSize(new Size(height, width));

        // Set position of plot (can be tweaked in order to center chart position)
        eegPlot.getGraph().position(0, HorizontalPositioning.ABSOLUTE_FROM_LEFT.ABSOLUTE_FROM_LEFT,
                0, VerticalPositioning.ABSOLUTE_FROM_TOP);

        // Add eegPlot to parent EEGGraph FrameLayout
        this.addView(eegPlot, new LayoutParams(
                LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT));

        // Extra onVisibilityChanged call to ensure graph starts plotting on older devices
        onVisibilityChanged(this, View.VISIBLE);
    }

    @Override
    public void onVisibilityChanged(View changedView, int visibility){
        if (visibility == View.INVISIBLE){
            stopThreads();
        }
        else if (dataThread == null || !dataThread.isAlive()) {
            startDataThread();
            startRenderingThread();
            // Register a listener to receive connection state changes.
            dataListener = new DataListener();
            appState.connectedMuse.registerDataListener(dataListener, MuseDataPacketType.EEG);
        }
    }

    // ---------------------------------------------------------
    // Thread management functions

    // Start thread that will  update the data whenever a Muse data packet is received
    public void startDataThread() {
        dataThread = new Thread (data);
        dataThread.start();
    }

    // Start thread that will render the plot at a fixed speed
    public void startRenderingThread(){
        renderingThread = new Thread (plotUpdater);
        renderingThread.start();
    }

    public void stopThreads(){
        plotUpdater.stopThread();
        data.stopThread();

        if (dataListener != null) {
            appState.connectedMuse.unregisterDataListener(dataListener, MuseDataPacketType.EEG);
        }
    }

    // --------------------------------------------------------------
    // Listeners

    // Listener that receives incoming data from the Muse. Will run receiveMuseDataPacket
    // Will call receiveMuseDataPacket as data comes in around 220hz (250hz for Muse 2016)
    class DataListener extends MuseDataListener {

        DataListener() {
        }

        @Override
        public void receiveMuseDataPacket(final MuseDataPacket p, final Muse muse) {
            getEegChannelValues(eegBuffer, p);
            eegStale = true;
        }

        private void getEegChannelValues(double[] buffer, MuseDataPacket p) {
            buffer[0] = p.getEegChannelValue(Eeg.EEG1);
            buffer[1] = p.getEegChannelValue(Eeg.EEG2);
            buffer[2] = p.getEegChannelValue(Eeg.EEG3);
            buffer[3] = p.getEegChannelValue(Eeg.EEG4);
        }

        @Override
        public void receiveMuseArtifactPacket(final MuseArtifactPacket p, final Muse muse) {
            // Does nothing for now
        }
    }

    // --------------------------------------------------------------
    // Runnables

    // Runnable class that redraws plot at a fixed frequency
    public final class PlotUpdater implements Runnable {
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


    // Updates dataSeries, performs data processing
    public final class EEGDataSource implements Runnable {
        private boolean keepRunning;
        private int sleepInterval;

        public EEGDataSource(Boolean isLowEnergy) {
            if (isLowEnergy) {sleepInterval = 4;}
            else {
                sleepInterval = 2;
            }
        }

        @Override
        public void run() {
            try {
                keepRunning = true;
                while (keepRunning) {
                    Thread.sleep(sleepInterval);
                    if (eegStale) {
                        if (dataSeries.size() > PLOT_LENGTH) {
                            dataSeries.removeFirst();
                        }
                        dataSeries.addLast(eegBuffer[channelOfInterest - 1]);
                        eegStale = false;
                    }
                }
            } catch (InterruptedException e) {
            }
        }

        public void stopThread() {
            keepRunning = false;
        }
    }


}
