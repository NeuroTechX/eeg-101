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
import java.util.Timer;
import java.util.TimerTask;


/*
View that plots a single-channel EEG graph
Bandstop filter is present to remove 60hz noise in 2016 Muse. High pass filter centers graph
around 0

Plotting process:
1. Creates AndroidPlot graph and MuseDataListener for EEG dataSource packets
2. MuseDataListener updates circular eegBuffer at 220-256hz
3. plotTimer runs plotTimerTask every 20ms, adding new data to dataseries and plotting graph
*/
public class EEGGraph extends FrameLayout {

    // ----------------------------------------------------------------------
    // Variables

    public static XYPlot eegPlot;
    public static final int PLOT_LENGTH = 256  * 4;
    private static final String PLOT_TITLE = "Raw_EEG";
    public DynamicSeries dataSeries;
    private LineAndPointFormatter lineFormatter;
    public  DataListener dataListener;
    public  CircularBuffer eegBuffer = new CircularBuffer(220, 4);
    public EEGFileWriter fileWriter = new EEGFileWriter(getContext(), PLOT_TITLE);
    public boolean isRecording;
    public boolean isRunning = false;
    public Timer plotTimer = new Timer();
    public PlotUpdateTask plotTimerTask;

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
        eegPlot.getGraph().setSize(new Size(height, width));

        // Set position of plot (should be tweaked in order to center chart position)
        eegPlot.getGraph().position(0, HorizontalPositioning.ABSOLUTE_FROM_LEFT.ABSOLUTE_FROM_LEFT,
                0, VerticalPositioning.ABSOLUTE_FROM_TOP);

        // Add plot to EEGGraph
        this.addView(eegPlot, new LayoutParams(
                LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT));

    }

    @Override
    public void onVisibilityChanged(View changedView, int visibility){
        if (visibility == View.INVISIBLE){
            stopRendering();
        }
        else {
            startDataListener();
            startRendering();
        }
    }

    // ---------------------------------------------------------
    // Thread management functions

    // Start thread that will render the plot at a fixed speed
    public void startRendering(){
        plotTimer = new Timer();
        plotTimerTask = new PlotUpdateTask(eegPlot);
        plotTimer.schedule(plotTimerTask, 20, 20);
    }

    public void startDataListener(){
        dataListener = new DataListener();
        appState.connectedMuse.registerDataListener(dataListener, MuseDataPacketType.EEG);
    }

    public void stopRendering(){
        if (dataListener != null) {
            appState.connectedMuse.unregisterDataListener(dataListener, MuseDataPacketType.EEG);
        }
        if(isRunning) {
            plotTimer.cancel();
        }
        isRunning = false;
    }

    // --------------------------------------------------------------
    // Listeners

    // Listener that receives incoming dataSource from the Muse.
    // Will call receiveMuseDataPacket as dataSource comes in around 220hz (260hz for Muse 2016)
    // Updates eegBuffer with latest values for all 4 electrodes
    private final class DataListener extends MuseDataListener {
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

            if (filterOn) {
                bandstopFiltState = bandstopFilter.transform(newData, bandstopFiltState);
                newData = bandstopFilter.extractFilteredSamples(bandstopFiltState);
            }

            eegBuffer.update(newData);

            if (isRecording) {
                fileWriter.addDataToFile(newData);
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
            // Does nothing for now
        }
    }


    // --------------------------------------------------------------
    // TimerTasks

    // TimerTask class that updates data series and redraws plot at a fixed frequency
    public class PlotUpdateTask extends TimerTask {
        WeakReference<Plot> plot;

        // Sets WeakReference to plot to avoid memory leaks
        public PlotUpdateTask(Plot plot) {
            this.plot = new WeakReference<Plot>(plot);
        }

        @Override
        public void run() {
            if (eegBuffer.getPts() >= 12) {

                int numEEGPoints = eegBuffer.getPts();
                if (dataSeries.size() >= PLOT_LENGTH) {
                    dataSeries.remove(numEEGPoints);
                }

                // For adding all data points (Full sampling)
                dataSeries.addAll(eegBuffer.extractSingleChannelTransposedAsDouble(numEEGPoints, channelOfInterest - 1));

                // resets the 'points-since-dataSource-read' value
                eegBuffer.resetPts();

                plot.get().redraw();
            }
        }
    }
}