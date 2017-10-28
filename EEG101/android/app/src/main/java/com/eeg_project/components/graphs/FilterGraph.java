package com.eeg_project.components.graphs;

import android.content.Context;
import android.graphics.Color;

import android.util.Log;
import android.widget.FrameLayout;


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
import com.eeg_project.components.csv.EEGFileReader;
import com.eeg_project.components.csv.EEGFileWriter;
import com.eeg_project.components.signal.CircularBuffer;
import com.eeg_project.components.signal.Filter;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;


/*
View that plots a single-channel filtered EEG graph
Bandstop, bandpass, high-pass, and low-pass filters are availabe in Filter class

Plotting process:
1. Creates AndroidPlot graph and MuseDataListener for EEG dataSource packets
2. MuseDataListener updates circular eegBuffer at 220-260hz
3. raw dataSource is filtered as it comes in with Butterworth filters from DSP Library
3. dataThread and renderThread add latest filter result to dataSeries and render plot at a fixed
frequency
*/
public class FilterGraph extends FrameLayout {

    // ----------------------------------------------------------------------
    // Variables

    public XYPlot filterPlot;
    private static final int PLOT_LENGTH = 256 * 4;
    private static final String PLOT_TITLE = "Filtered_EEG";
    private int PLOT_LOW_BOUND = 600;
    private int PLOT_HIGH_BOUND = 1000;
    private LineAndPointFormatter lineFormatter;
    public DynamicSeries dataSeries;
    private FilterDataListener dataListener;
    public EEGFileWriter fileWriter = new EEGFileWriter(getContext(), PLOT_TITLE);
    private OfflineFilterDataListener offlineDataListener;
    private Thread dataThread;
    public int samplingRate = 256;
    public CircularBuffer eegBuffer = new CircularBuffer(220, 4);

    // Reference to global application state used for connected Muse
    MainApplication appState;

    // Filter states represent info about previous samples; intermediate values that represent
    // polynomial components determined by previous samples in the epoch. For more info, read the Rational Transfer Function description here: https://www.mathworks.com/help/matlab/ref/filter.html
    public double[][] filtState;
    public Filter activeFilter;

    // Bridged props
    // Default channelOfInterest = 1 (left ear)
    public int channelOfInterest = 1;
    private String offlineData = "";
    public boolean isRecording;
    private int notchFrequency;


    // ------------------------------------------------------------------------
    // Constructors

    public FilterGraph(Context context) {
        super(context);
        appState = ((MainApplication)context.getApplicationContext());
        if(appState.connectedMuse != null) {
            if (appState.connectedMuse.isLowEnergy()) {
                samplingRate = 220;
            }
        }
        initView(context);
    }

    // -----------------------------------------------------------------------
    // Bridge functions (can be called from JS by setting props)

    public void setChannelOfInterest(int channel) {
        dataSeries.clear();
        channelOfInterest = channel;
    }

    public void setFilterType(String filterType) {
        dataSeries.clear();

        switch(filterType) {

            case "LOWPASS":
                PLOT_LOW_BOUND = 600;
                PLOT_HIGH_BOUND = 1000;
                filterPlot.setRangeBoundaries(PLOT_LOW_BOUND, PLOT_HIGH_BOUND, BoundaryMode.FIXED);
                activeFilter = new Filter(samplingRate, "lowpass", 5, 35, 0);
                filtState = new double[4][activeFilter.getNB()];
                break;

            case "BANDPASS":
                PLOT_LOW_BOUND = -200;
                PLOT_HIGH_BOUND = 200;
                filterPlot.setRangeBoundaries(PLOT_LOW_BOUND, PLOT_HIGH_BOUND, BoundaryMode.FIXED);
                activeFilter = new Filter(samplingRate, "bandpass", 5, 2, 35);
                filtState = new double[4][activeFilter.getNB()];
                break;

            case "HIGHPASS":
                PLOT_LOW_BOUND = -200;
                PLOT_HIGH_BOUND = 200;
                filterPlot.setRangeBoundaries(PLOT_LOW_BOUND, PLOT_HIGH_BOUND, BoundaryMode.FIXED);
                activeFilter = new Filter(samplingRate, "highpass", 2, 1, 0);
                filtState = new double[4][activeFilter.getNB()];
                break;
        }
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

    public void setOfflineData(String data) {
        offlineData = data;
    }

    public void setNotchFrequency(int notchFrequency) {
        this.notchFrequency = notchFrequency;
        if(dataListener != null){
            dataListener.updateFilter(notchFrequency);
        }
    }

    // -----------------------------------------------------------------------
    // Lifecycle methods (initView and onVisibilityChanged)

    // Initialize and style AndroidPlot Graph. XML styling is not used.
    public void initView(Context context) {
        filterPlot = new XYPlot(context, PLOT_TITLE);

        // Create dataSeries that will be drawn on plot (Y will be obtained from dataSource, x will be implicitly generated):
        dataSeries = new DynamicSeries(PLOT_TITLE);

        // Set X and Y domain
        filterPlot.setRangeBoundaries(PLOT_LOW_BOUND, PLOT_HIGH_BOUND, BoundaryMode.FIXED);
        filterPlot.setDomainBoundaries(0, PLOT_LENGTH, BoundaryMode.FIXED);

        // Create line formatter with set color
        lineFormatter = new FastLineAndPointRenderer.Formatter(Color.WHITE, null,  null);

        // Set line thickness
        lineFormatter.getLinePaint().setStrokeWidth(3);

        // Add line to plot
        filterPlot.addSeries(dataSeries, lineFormatter);

        // Format plot layout
        //Remove margins, padding and border
        filterPlot.setPlotMargins(0, 0, 0, 0);
        filterPlot.setPlotPadding(0, 0, 0, 0);
        filterPlot.getBorderPaint().setColor(Color.WHITE);

        // Set plot background color
        filterPlot.getGraph().getBackgroundPaint().setColor(Color.rgb(114,194,241));

        // Remove gridlines
        filterPlot.getGraph().getGridBackgroundPaint().setColor(Color.TRANSPARENT);
        filterPlot.getGraph().getDomainGridLinePaint().setColor(Color.TRANSPARENT);
        filterPlot.getGraph().getDomainOriginLinePaint().setColor(Color.TRANSPARENT);
        filterPlot.getGraph().getRangeGridLinePaint().setColor(Color.TRANSPARENT);
        filterPlot.getGraph().getRangeOriginLinePaint().setColor(Color.TRANSPARENT);

        // Remove axis labels and values
        // Domain = X; Range = Y
        filterPlot.setDomainLabel(null);
        filterPlot.setRangeLabel(null);
        filterPlot.getGraph().getRangeGridLinePaint().setColor(Color.TRANSPARENT);
        filterPlot.getGraph().getRangeOriginLinePaint().setColor(Color.TRANSPARENT);
        filterPlot.getGraph().getDomainGridLinePaint().setColor(Color.TRANSPARENT);
        filterPlot.getGraph().getDomainOriginLinePaint().setColor(Color.TRANSPARENT);

        // Remove extraneous elements
        filterPlot.getLayoutManager().remove(filterPlot.getLegend());

        // Set size of plot
        SizeMetric height = new SizeMetric(1, SizeMode.FILL);
        SizeMetric width = new SizeMetric(1, SizeMode.FILL);
        filterPlot.getGraph().setSize(new Size(height, width));

        // Set position of plot (should be tweaked in order to center chart position)
        filterPlot.getGraph().position(0, HorizontalPositioning.ABSOLUTE_FROM_LEFT.ABSOLUTE_FROM_LEFT,
                0, VerticalPositioning.ABSOLUTE_FROM_TOP);

        // Add plot to FilterGraph
        this.addView(filterPlot, new LayoutParams(
                LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT));
    }


    // ---------------------------------------------------------
    // Listener management functions


    public void startDataListener(){
        if(offlineData.length() >= 1) {
            startOfflineData(offlineData);
        } else {
            if(dataListener == null) {
                dataListener = new FilterDataListener();
            }
            appState.connectedMuse.registerDataListener(dataListener, MuseDataPacketType.EEG);
        }
    }

    public void stopDataListener(){
        if (dataListener != null || offlineDataListener != null) {
            if(offlineData.length() > 1) {
                offlineDataListener.stopThread();
            } else {
                appState.connectedMuse.unregisterDataListener(dataListener, MuseDataPacketType.EEG);
            }
        }
    }

    public void startOfflineData(String offlineData) {
        offlineDataListener = new OfflineFilterDataListener(offlineData);
        dataThread = new Thread(offlineDataListener);
        dataThread.start();
    }


    // --------------------------------------------------------------
    // Listeners

    // Listener that receives incoming dataSource from the Muse.
    // Will call receiveMuseDataPacket as dataSource comes in around 256hz (220hz for Muse 2014)
    // Updates eegBuffer with latest values for all 4 electrodes
    private final class FilterDataListener extends MuseDataListener {
        public double[] newData;
        public boolean isBandStopFilterOn = false;
        public Filter bandstopFilter;
        public double[][] bandstopFiltState;
        private int frameCounter = 0;

        // if connected Muse is a 2016 BLE version, init a bandstop filter to remove 60hz noise
        FilterDataListener() {
            if (appState.connectedMuse.isLowEnergy()) {
                isBandStopFilterOn = true;
                bandstopFilter = new Filter(256, "bandstop", 5, notchFrequency - 5, notchFrequency + 5);
                bandstopFiltState = new double[4][bandstopFilter.getNB()];
            }
            newData = new double[4];
        }

        // Updates eegBuffer with new data from all 4 channels. Bandstop filter for 2016 Muse
        @Override
        public void receiveMuseDataPacket(final MuseDataPacket p, final Muse muse) {
            getEegChannelValues(newData, p);

            // Need to apply a bandpass (notch) filter at 60hz if Muse is 2016 model
            // bandpass filter is built into 2014 Muses
            if (isBandStopFilterOn) {
                bandstopFiltState = bandstopFilter.transform(newData, bandstopFiltState);
                newData = bandstopFilter.extractFilteredSamples(bandstopFiltState);
            }

            filtState = activeFilter.transform(newData, filtState);
            eegBuffer.update(activeFilter.extractFilteredSamples(filtState));

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

        public void updateFilter(int notchFrequency){
            if(bandstopFilter != null){
                bandstopFilter.updateFilter(notchFrequency - 5, notchFrequency + 5);
            }
        }
    }

    // Listener that loops over pre-recorded data read from csv
    // Only used in Offline Mode
    // Updates eegbuffer at approx. the same frequency as the real PSDDataListener
    private final class OfflineFilterDataListener implements Runnable {

        List<double[]> data;
        private boolean keepRunning = true;
        private int counter = 0;
        private int index = 0;

        OfflineFilterDataListener(String offlineData) {
            try {
                InputStream inputStream = getResources().getAssets().open(offlineData + ".csv");
                EEGFileReader fileReader = new EEGFileReader(inputStream);
                data = fileReader.read();
            } catch (IOException e) { Log.w("EEGGraph", "File not found error"); }
        }

        @Override
        public void run() {
            try {
                while (keepRunning) {
                    Thread.sleep(6);
                    filtState = activeFilter.transform(data.get(index), filtState);
                    eegBuffer.update(activeFilter.extractFilteredSamples(filtState));

                    index++;
                    counter++;

                    if (counter % 15 == 0) {
                        updatePlot();
                    }

                    if(index >= data.size()) {
                        index = 0;
                    }
                }
            } catch(InterruptedException e){
                Log.w("FilterGraph", "interrupted exception");
            }
        }

        public void stopThread() {
            keepRunning = false;
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

        filterPlot.redraw();
    }
}







