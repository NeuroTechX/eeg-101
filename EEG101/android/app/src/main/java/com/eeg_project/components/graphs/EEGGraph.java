package com.eeg_project.components.graphs;

import android.content.Context;
import android.graphics.Color;
import android.util.AttributeSet;
import android.util.Log;
import android.view.View;
import android.widget.FrameLayout;

import com.androidplot.Plot;
import com.androidplot.ui.HorizontalPositioning;
import com.androidplot.ui.Size;
import com.androidplot.ui.SizeMetric;
import com.androidplot.ui.SizeMode;
import com.androidplot.ui.VerticalPositioning;
import com.androidplot.util.PixelUtils;
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
    public CircularBuffer eegBuffer = new CircularBuffer(220, 4);
    public double[] newData = new double[4];
    public double[] latestSample;

    // Filter variables
    public int filterFreq;
    public Filter highPassFilter;
    public Filter bandstopFilter;
    public double[] bandstopFiltState;
    public double[] highPassFiltState;
    public double filtInput;
    public double filtResult;

    // Bridged props
    // Default channelOfInterest = 1 (left ear)
    public int channelOfInterest = 1;

    // grab reference to global Muse
    MainApplication appState;

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

        // set up PlotUpdater
        plotUpdater = new PlotUpdater(eegPlot);

        // get datasets (Y will be dataSeries, x will be implicitly generated):
        data = new EEGDataSource(appState.connectedMuse.isLowEnergy());
        dataSeries = new DynamicSeries("EEG data");

        // Create high pass filter as well as bandstop filter if Muse is lowEnergy
        if (appState.connectedMuse.isLowEnergy()) {
            Log.w("EEG", "Created Filters");
            filterFreq = 256;
            bandstopFilter = new Filter(filterFreq, "bandstop", 5, 55, 65);
            bandstopFiltState = new double[bandstopFilter.getNB()];
        } else { filterFreq = 220; }
        highPassFilter = new Filter(filterFreq, "highpass", 2, .1, 0);
        highPassFiltState = new double[bandstopFilter.getNB()];

        // Set X and Y domain
        eegPlot.setRangeBoundaries(-150, 150, BoundaryMode.FIXED);
        eegPlot.setDomainBoundaries(0, PLOT_LENGTH, BoundaryMode.FIXED);

        // This is critical for being able to set the color of the plot
        PixelUtils.init(getContext());

        // Create line formatter with set color
        lineFormatter = new FastLineAndPointRenderer.Formatter(Color.rgb(255, 255, 255), null, null, null);

        // add series to plot
        eegPlot.addSeries(dataSeries,
                lineFormatter);

        // hook up series to data source
        //data.addObserver(plotUpdater);

        // Format plot layout
        //Remove margins, padding and border
        eegPlot.setPlotMargins(0, 0, 0, 0);
        eegPlot.setPlotPadding(0, 0, 0, 0);
        eegPlot.getBorderPaint().setColor(Color.WHITE);

        // Make plot background blue (including removing grid lines)
        eegPlot.getGraph().getBackgroundPaint().setColor(Color.rgb(114, 194, 241));
        //eegPlot.getGraph().setBackgroundPaint(null);
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

        // Remove extraneous elements
        //eegPlot.setTitle(null);
        eegPlot.getLayoutManager().remove(eegPlot.getLegend());

        // Set size of plot
        SizeMetric height = new SizeMetric(1, SizeMode.FILL);
        SizeMetric width = new SizeMetric(1, SizeMode.FILL);
        // Set size of plot
        eegPlot.getGraph().setSize(new Size(height, width));

        // Set position of plot (should be tweaked in order to center chart position)
        eegPlot.getGraph().position(0, HorizontalPositioning.ABSOLUTE_FROM_LEFT.ABSOLUTE_FROM_LEFT,
                0, VerticalPositioning.ABSOLUTE_FROM_TOP);

        // Add children to EEGGraph
        this.addView(eegPlot, new LayoutParams(
                LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT));

        eegPlot.setDrawingCacheEnabled(true);
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

    // Listener that receives incoming data from the Muse. Will run receiveMuseDataPacket
    // Will call receiveMuseDataPacket as data comes in around 220hz (250hz for Muse 2016)
    class DataListener extends MuseDataListener {
        Boolean isLowEnergy;

        DataListener() {
            Log.w("EEG", "Created Data Listener");
            isLowEnergy = appState.connectedMuse.isLowEnergy();
        }

        @Override
        public void receiveMuseDataPacket(final MuseDataPacket p, final Muse muse) {
            getEegChannelValues(newData, p);
            eegBuffer.update(newData);



            // Filter new raw sample
                bandstopFiltState = bandstopFilter.transform(newData[channelOfInterest - 1],
                        bandstopFiltState);
                filtInput = bandstopFilter.extractFilteredSamples(bandstopFiltState);
                highPassFiltState = highPassFilter.transform(filtInput, highPassFiltState);
                filtResult = highPassFilter.extractFilteredSamples(highPassFiltState);



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
        private int stepSize;

        // Choosing these step sizes arbitrarily based on how they look
        public EEGDataSource(Boolean isLowEnergy) {
            if (isLowEnergy) {stepSize = 6;}
            else {
                stepSize = 5;
            }
        }

        @Override
        public void run() {
            try {
                keepRunning = true;
                while (keepRunning) {
                    if (eegBuffer.getPts() >= stepSize) {
                        if (dataSeries.size() >= PLOT_LENGTH) {
                            dataSeries.removeFirst();
                        }
                        dataSeries.addLast(filtResult);
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