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
import com.eeg_project.components.EEGFileWriter;
import com.eeg_project.components.signal.CircularBuffer;
import com.eeg_project.components.signal.Filter;

import java.lang.ref.WeakReference;


/*
View that plots a single-channel EEG graph
Bandstop filter is present to remove 60hz noise in 2016 Muse. High pass filter centers graph
around 0

Plotting process:
1. Creates AndroidPlot graph and MuseDataListener for EEG dataSource packets
2. MuseDataListener updates circular eegBuffer at 220-260hz
3. When view is visible, dataThread and renderingThread add newest values to dataSeries and plot
dataSeries, respectively
*/
public class EEGGraph extends FrameLayout {

    // ----------------------------------------------------------------------
    // Variables

    public static XYPlot eegPlot;
    public static final int PLOT_LENGTH = 256  * 4;
    private static final String PLOT_TITLE = "Raw_EEG";
    public PlotUpdater plotUpdater;
    public DynamicSeries dataSeries;
    private Thread dataThread;
    private Thread renderingThread;
    private LineAndPointFormatter lineFormatter;
    public  DataListener dataListener;
    public  CircularBuffer eegBuffer = new CircularBuffer(220, 4);
    public EEGFileWriter fileWriter = new EEGFileWriter(getContext(), PLOT_TITLE);
    public boolean isRecording;


    // Bridged props
    // Default channelOfInterest = 0 (left ear)
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

    // -----------------------------------------------------------------------
    // Bridge functions
    public void setChannelOfInterest(int channel) {
        channelOfInterest = channel;
        dataSeries.clear();

        // Uncomment to make plot change color based on selected electrode
        /*
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

    public void startRecording() {
        fileWriter.initFile(PLOT_TITLE);
        isRecording = true;
    }

    public void stopRecording() {
        isRecording = false;
        // if writer = writing, close and save file
        if (fileWriter.isRecording()) {
            fileWriter.writeFile(PLOT_TITLE);
        }
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
        //dataSource = new EEGDataSource(appState.connectedMuse.isLowEnergy());
        dataSeries = new DynamicSeries("EEG dataSource");

        // Set X and Y domain
        eegPlot.setRangeBoundaries(600, 1000, BoundaryMode.FIXED);
        eegPlot.setDomainBoundaries(0, PLOT_LENGTH, BoundaryMode.FIXED);

        // This is critical for being able to set the color of the plot
        PixelUtils.init(getContext());

        // Create line formatter with set color
        lineFormatter = new FastLineAndPointRenderer.Formatter(Color.rgb(255, 255, 255), null, null, null);

        // Set line thickness
        lineFormatter.getLinePaint().setStrokeWidth(3);

        // add series to plot
        eegPlot.addSeries(dataSeries,
                lineFormatter);

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

    }

    @Override
    public void onVisibilityChanged(View changedView, int visibility){
        if (visibility == View.INVISIBLE){
            stopThreads();
        }
        else if (renderingThread == null || !renderingThread.isAlive()) {
            startDataListener();
            startRenderingThread();
        }
    }

    // ---------------------------------------------------------
    // Thread management functions

    // Start thread that will render the plot at a fixed speed
    public void startRenderingThread(){
        renderingThread = new Thread (plotUpdater);
        renderingThread.start();
    }

    public void startDataListener(){
        dataListener = new DataListener();
        appState.connectedMuse.registerDataListener(dataListener, MuseDataPacketType.EEG);
    }

    public void stopThreads(){
        plotUpdater.stopThread();

        if (dataListener != null) {
            appState.connectedMuse.unregisterDataListener(dataListener, MuseDataPacketType.EEG);
        }
    }

    // --------------------------------------------------------------
    // Listeners

    // Listener that receives incoming dataSource from the Muse.
    // Will call receiveMuseDataPacket as dataSource comes in around 220hz (260hz for Muse 2016)
    // Updates eegBuffer with latest values for all 4 electrodes
    public final class DataListener extends MuseDataListener {
        public double[] newData;

        // Filter variables
        public boolean filterOn = false;
        public Filter bandstopFilter;
        public double[][] bandstopFiltState;

        // if connected Muse is a 2016 BLE version, init a bandstop filter to remove 60hz noise
        DataListener() {
            if (appState.connectedMuse.isLowEnergy()) {
                filterOn = true;
                bandstopFilter = new Filter(256, "bandstop", 5, 55, 65);
                bandstopFiltState = new double[4][bandstopFilter.getNB()];
            }
            newData = new double[4];
        }

        // Updates eegBuffer with new data from all 4 channels. Bandstop filter for 2016 Muse
        @Override
        public void receiveMuseDataPacket(final MuseDataPacket p, final Muse muse) {
            getEegChannelValues(newData, p);

            if(filterOn) {
                bandstopFiltState = bandstopFilter.transform(newData, bandstopFiltState);
                newData = bandstopFilter.extractFilteredSamples(bandstopFiltState);
            }

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
            // Does nothing for now
        }
    }


    // --------------------------------------------------------------
    // Runnables

    // Runnable class that updates data series and redraws plot at a fixed frequency
    public final class PlotUpdater implements Runnable {
        WeakReference<Plot> plot;
        private boolean keepRunning = true;

        // Sets WeakReference to plot to avoid memory leaks
        public PlotUpdater(Plot plot) {
            this.plot = new WeakReference<Plot>(plot);
        }

        @Override
        public void run() {
            try {
                keepRunning = true;
                while (keepRunning) {

                    // 33ms sleep = 30 fps?
                    // Expect 8 eeg samples per loop
                    Thread.sleep(33);

                    Log.w("EEG", eegBuffer.getPts() + " samples");

                    if (dataSeries.size() >= PLOT_LENGTH) {
                        dataSeries.remove(eegBuffer.getPts());
                    }

                    // For adding all data points (Full sampling)
                    dataSeries.addAll(eegBuffer.extractSingleChannelTransposedAsDouble(eegBuffer.getPts(), channelOfInterest -1));

                    // For adding every 5th or 6th data point (Down sampling)
                    //dataSeries.addLast(eegBuffer.extract(1)[0][channelOfInterest - 1]);

                    // resets the 'points-since-dataSource-read' value
                    eegBuffer.resetPts();

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
}