package com.eeg_project.components.graphs;

import android.content.Context;
import android.graphics.Color;
import android.util.Log;
import android.view.View;
import android.widget.FrameLayout;

import com.androidplot.ui.HorizontalPositioning;
import com.androidplot.ui.Size;
import com.androidplot.ui.SizeMetric;
import com.androidplot.ui.SizeMode;
import com.androidplot.ui.VerticalPositioning;
import com.androidplot.util.PixelUtils;
import com.androidplot.xy.BoundaryMode;
import com.androidplot.xy.FastLineAndPointRenderer;
import com.androidplot.xy.LineAndPointFormatter;
import com.androidplot.xy.XYGraphWidget;
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

import java.util.Timer;


/*
View that plots a single-channel EEG graph
Bandstop filter is present to remove 60hz noise in 2016 Muse. High pass filter centers graph
around 0

Plotting process:
1. Creates AndroidPlot graph and MuseDataListener for EEG dataSource packets
2. MuseDataListener updates circular eegBuffer at 220-256hz
3. Every 15 samples, data is added to dataSeries and plot is updated
*/


public class EEGGraph extends FrameLayout {

    // ----------------------------------------------------------------------
    // Variables

    public static final int BACKGROUND_COLOUR = Color.rgb(114, 194, 241);
    public static final int LINE_COLOUR = Color.rgb(255, 255, 255);
    public static XYPlot eegPlot;
    public static final int PLOT_LENGTH = 256  * 4;
    private static final String PLOT_TITLE = "Raw_EEG";
    public DynamicSeries dataSeries;
    private LineAndPointFormatter lineFormatter;
    public  DataListener dataListener;
    public  CircularBuffer eegBuffer = new CircularBuffer(220, 4);
    public EEGFileWriter fileWriter = new EEGFileWriter(getContext(), PLOT_TITLE);
    public boolean isRecording;

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
        lineFormatter = new FastLineAndPointRenderer.Formatter(Color.WHITE, null,  null);

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
        XYGraphWidget graph = eegPlot.getGraph();
        graph.getBackgroundPaint().setColor(BACKGROUND_COLOUR);
        //eegPlot.getGraph().setBackgroundPaint(null);
        graph.getGridBackgroundPaint().setColor(Color.TRANSPARENT);
        graph.getDomainGridLinePaint().setColor(Color.TRANSPARENT);
        graph.getDomainOriginLinePaint().setColor(Color.TRANSPARENT);
        graph.getRangeGridLinePaint().setColor(Color.TRANSPARENT);
        graph.getRangeOriginLinePaint().setColor(Color.TRANSPARENT);

        // Remove axis labels and values
        // Domain = X; Range = Y
        eegPlot.setDomainLabel(null);
        eegPlot.setRangeLabel(null);
        graph.getRangeGridLinePaint().setColor(Color.TRANSPARENT);
        graph.getRangeOriginLinePaint().setColor(Color.TRANSPARENT);
        graph.getDomainGridLinePaint().setColor(Color.TRANSPARENT);
        graph.getDomainOriginLinePaint().setColor(Color.TRANSPARENT);

        // Remove extraneous elements
        eegPlot.getLayoutManager().remove(eegPlot.getLegend());

        // Set size of plot
        SizeMetric height = new SizeMetric(1, SizeMode.FILL);
        SizeMetric width = new SizeMetric(1, SizeMode.FILL);
        graph.setSize(new Size(height, width));

        // Set position of plot (should be tweaked in order to center chart position)
        graph.position(0, HorizontalPositioning.ABSOLUTE_FROM_LEFT.ABSOLUTE_FROM_LEFT,
                0, VerticalPositioning.ABSOLUTE_FROM_TOP);

        // Add plot to EEGGraph
        this.addView(eegPlot, new LayoutParams(
                LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT));

    }

    @Override
    public void onVisibilityChanged(View changedView, int visibility){
        if (visibility == View.INVISIBLE){
            stopDataListener();
        }
        else {
            startDataListener();
        }
    }

    // ---------------------------------------------------------
    // Listener management functions


    public void startDataListener(){
        dataListener = new DataListener();
        appState.connectedMuse.registerDataListener(dataListener, MuseDataPacketType.EEG);
    }

    public void stopDataListener(){
        Log.w("EEG", "Stop Data listener called");
        if (dataListener != null) {
            appState.connectedMuse.unregisterDataListener(dataListener, MuseDataPacketType.EEG);
        }
    }

    // --------------------------------------------------------------
    // Listeners

    // Listener that receives incoming dataSource from the Muse.
    // Will call receiveMuseDataPacket as dataSource comes in around 220hz (256hz for Muse 2016)
    // Updates eegBuffer with latest values for all 4 electrodes
    private final class DataListener extends MuseDataListener {
        public double[] newData;

        // Filter variables
        public boolean filterOn = false;
        public Filter bandstopFilter;
        public double[][] bandstopFiltState;
        private int frameCounter = 0;

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

            frameCounter++;
            if (frameCounter % 15 == 0) {
                updatePlot();
            }

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

    // ---------------------------------------------------------
    // Plot update functions

    public void updatePlot() {

        int numEEGPoints = eegBuffer.getPts();
        if (dataSeries.size() >= PLOT_LENGTH) {
            dataSeries.remove(numEEGPoints);
        }

        // For adding all data points (Full sampling)
        dataSeries.addAll(eegBuffer.extractSingleChannelTransposedAsDouble(numEEGPoints, channelOfInterest - 1));

        // resets the 'points-since-dataSource-read' value
        eegBuffer.resetPts();

        eegPlot.redraw();
    }
}