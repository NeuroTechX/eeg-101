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
import com.androidplot.xy.LineAndPointFormatter;
import com.androidplot.xy.XYPlot;
import com.androidplot.xy.XYSeries;
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
import com.eeg_project.components.signal.FFT;
import com.eeg_project.components.signal.PSDBuffer;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

/*
View that plots a dynamic power spectral density (PSD) curve

Plotting process:
1. Creates AndroidPlot graph and MuseDataListener for incoming EEG data
2. MuseDataListener updates circular eegBuffer at 220-260hz
3. When view is visible, dataThread and renderingThread perform PSD computations and plot
dataSeries, respectively
4. dataThread computes smoothed log PSD with FFT from JTransforms library (in FFT class)
5. renderingThread plots PSDseries at fixed frequency. PSDSeries just points to smoothLogPower in
 dataSource
*/
public class PSDGraph extends FrameLayout {

    // ------------------------------------------------------------------------
    // Variables

    private XYPlot psdPlot;
    private PSDDataSource dataSource;
    public  int PLOT_LENGTH = 50;
    private static final String PLOT_TITLE = "Power_Spectral_Density";
    private PSDSeries dataSeries;
    public PlotUpdater plotUpdater;
    public MuseDataListener dataListener;
    private Thread dataThread;
    private Thread renderingThread;
    public CircularBuffer eegBuffer = new CircularBuffer(220, 4);
    private OfflinePSDDataListener offlineDataListener;
    private Thread offlineDataThread;
    private int samplingRate = 256;

    // Reference to global application state used for connected Muse
    MainApplication appState;

    // Bridged props
    // Default channelOfInterest = 1 (left ear)
    public int channelOfInterest = 1;
    private String offlineData = "";


    // ------------------------------------------------------------------------
    // Constructors

    public PSDGraph(Context context) {
        super(context);
        appState = ((MainApplication) context.getApplicationContext());
        initView(context);
        if(appState.connectedMuse != null) {
            if (!appState.connectedMuse.isLowEnergy()) {
                this.samplingRate = 220;
            }
        }
    }

    // -----------------------------------------------------------------------
    // Bridge functions (can be called from JS by setting props)

    public void setChannelOfInterest(int channel) {
        channelOfInterest = channel;
        dataSource.clearDataBuffer();
    }

    public void startRecording() {
        dataSource.fileWriter.initFile(PLOT_TITLE);
        dataSource.isRecording = true;
    }

    public void stopRecording() {
        dataSource.isRecording = false;
        // if writer = writing, close and save file
        if (dataSource != null && dataSource.fileWriter.isRecording()) {
            dataSource.fileWriter.writeFile(PLOT_TITLE);
        }
    }

    public void setOfflineData(String data) {
        this.offlineData = data;
    }

    // -----------------------------------------------------------------------
    // Lifecycle methods (initView)

    // Initializes and styles the AndroidPlot XYPlot component of EEGGraph
    // All styling is performed entirely within this function, XML is not used
    public void initView(Context context) {

        // Create psdPlot
        psdPlot = new XYPlot(context, "PSD Plot");

        // Create plotUpdater
        plotUpdater = new PlotUpdater(psdPlot);

        // Create dataSource
        dataSource = new PSDDataSource(samplingRate);

        // Create dataSeries that will be drawn on plot (Y will be obtained from dataSource, x will be implicitly generated):
        dataSeries = new PSDSeries(dataSource, "PSD Plot");

        // Set X and Y domain
        psdPlot.setRangeBoundaries(0, 7, BoundaryMode.FIXED);
        psdPlot.setDomainBoundaries(0, PLOT_LENGTH, BoundaryMode.FIXED);

        // add dataSeries to plot and define color of plotted line
        psdPlot.addSeries(dataSeries,
                new LineAndPointFormatter(Color.rgb(255, 255, 255), null, null, null));

        // Set plot background color
        psdPlot.getGraph().getBackgroundPaint().setColor(Color.rgb(114, 194, 241));

        // Format plot layout
        //Remove margins, padding and border
        psdPlot.setPlotMargins(0, 0, 0, 0);
        psdPlot.setPlotPadding(0, 0, 0, 0);

        // Remove gridlines
        psdPlot.getGraph().getGridBackgroundPaint().setColor(Color.TRANSPARENT);

        // Remove axis labels and values
        // Domain = X; Range = Y
        psdPlot.getGraph().getDomainGridLinePaint().setColor(Color.TRANSPARENT);
        psdPlot.getGraph().getRangeGridLinePaint().setColor(Color.TRANSPARENT);
        psdPlot.setDomainLabel(null);
        psdPlot.setRangeLabel(null);

        // Remove extraneous elements
        psdPlot.getLayoutManager().remove(psdPlot.getLegend());

        // Set size of plot
        SizeMetric height = new SizeMetric(1, SizeMode.FILL);
        SizeMetric width = new SizeMetric(1, SizeMode.FILL);
        psdPlot.getGraph().setSize(new Size(height, width));

        // Set position of plot (should be tweaked in order to center chart position)
        psdPlot.getGraph().position(0, HorizontalPositioning.ABSOLUTE_FROM_LEFT.ABSOLUTE_FROM_LEFT,
                0, VerticalPositioning.ABSOLUTE_FROM_TOP);

        // Add plot to FilterGraph
        this.addView(psdPlot, new LayoutParams(
                LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT));
    }


    // ---------------------------------------------------------
    // Thread management functions

    public void startDataListener() {
        if(offlineData.length() >= 1) {
            startOfflineData(offlineData);
        } else {
            if(dataListener == null) {
                dataListener = new DataListener();
            }
            // Register a listener to receive dataSource packets from Muse. Second argument defines which type(s) of dataSource will be transmitted to listener
            appState.connectedMuse.registerDataListener(dataListener, MuseDataPacketType.EEG);
        }
    }

    // Start thread that will  update the dataSource whenever a Muse dataSource packet is receive series
    // and perform dataSource processing
    public void startDataThread() {
        dataThread = new Thread(dataSource);
        dataThread.start();
    }

    // Start thread that will render the plot at a fixed speed
    public void startRenderingThread(){
        renderingThread = new Thread (plotUpdater);
        renderingThread.start();
    }

    public void startOfflineData(String offlineData) {
        offlineDataListener = new OfflinePSDDataListener(offlineData);
        offlineDataThread = new Thread(offlineDataListener);
        offlineDataThread.start();
    }

    // Stop all threads
    public void stopThreads(){
        plotUpdater.stopThread();
        dataSource.stopThread();

        if (dataListener != null || offlineDataListener != null) {
            if(offlineData.length() > 1) {
                offlineDataListener.stopThread();
            } else {
                appState.connectedMuse.unregisterDataListener(dataListener, MuseDataPacketType.EEG);
            }
        }
    }

    // --------------------------------------------------------------
    // Listeners

    // Listener that receives incoming dataSource from the Muse.
    // Will call receiveMuseDataPacket as dataSource comes in around 220hz (260hz for Muse 2016)
    // Updates eegBuffer with latest values for all 4 electrodes
    class DataListener extends MuseDataListener {
        public double[] newData;

        // Constructor
        DataListener() {
            newData  = new double[4];
        }

        // Called whenever an incoming dataSource packet is received. Handles different types of incoming dataSource packets and updates dataSource correctly
        @Override
        public void receiveMuseDataPacket(final MuseDataPacket p, final Muse muse) {
            getEegChannelValues(newData, p);
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
            // Put something here about marking noise maybe
        }
    }

    // Listener that loops over pre-recorded data read from csv
    // Only used in Offline Mode
    // Updates eegbuffer at approx. the same frequency as the real DataListener
    private final class OfflinePSDDataListener implements Runnable {

        List<double[]> data;
        private boolean keepRunning = true;
        private int index = 0;

        OfflinePSDDataListener(String offlineData) {
            try {
                InputStream inputStream = getResources().getAssets().open(offlineData + ".csv");
                EEGFileReader fileReader = new EEGFileReader(inputStream);
                data = fileReader.read();
            } catch (IOException e) { Log.w("PSDGraph", "File not found error"); }
        }

        @Override
        public void run() {
            try {
                while (keepRunning) {
                    Thread.sleep(6);
                    eegBuffer.update(data.get(index));
                    index++;

                    if(index >= data.size()) {
                        index = 0;
                    }
                }
            } catch(InterruptedException e){
                Log.w("PSDGraph", "interrupted exception");
            }
        }

        public void stopThread() {
            keepRunning = false;
        }
    }


    // --------------------------------------------------------------
    // Runnables

    // Data source runnable
    // Processes raw EEG dataSource and updates dataSeries
    public final class PSDDataSource implements Runnable {
        private boolean keepRunning = true;
        double[] latestSamples;
        // TODO: document why this is 26
        int stepSize = 26;
        public boolean isRecording;
        public EEGFileWriter fileWriter = new EEGFileWriter(getContext(), PLOT_TITLE);
        private int samplingFrequency;
        private FFT fft;
        private PSDBuffer psdBuffer;
        private double[] logpower;
        private double[] smoothLogPower;

        public PSDDataSource(int freq) {
            this.samplingFrequency = freq;

            if(samplingFrequency == 220) {
                stepSize = 22;
            }

            // Initialize FFT transform
            fft = new FFT(256, 256, samplingFrequency);

            // Initialize FFT 2D Buffer
            int nbBins =fft.getFreqBins().length;
            psdBuffer = new PSDBuffer(20, nbBins);
            logpower = new double[nbBins];
            smoothLogPower = new double[nbBins];
        }

        @Override
        public void run() {
            try {
                keepRunning = true;
                while (keepRunning) {
                    if (eegBuffer.getPts() >= stepSize) {

                        // Extract latest raw samples
                        latestSamples = eegBuffer.extractSingleChannelTransposed(256,channelOfInterest - 1);

                        // Compute log-PSD for channel of interest
                        logpower = fft.computeLogPSD(latestSamples);

                        // Write new log-PSD in buffer
                        psdBuffer.update(logpower);

                        // Compute average PSD over buffer
                        smoothLogPower = psdBuffer.mean();

                        if (isRecording) { fileWriter.addDataToFile(smoothLogPower);}

                        eegBuffer.resetPts();
                    }
                }
            } catch (Exception e) {
            }
        }

        public void clearDataBuffer() {
            psdBuffer.clear();
            eegBuffer.clear();
        }

        public void stopThread() {
            keepRunning = false;
        }
    }

    class PSDSeries implements XYSeries {
        private PSDDataSource datasource;
        private String title;

        public PSDSeries(PSDDataSource datasource, String title) {
            this.datasource = datasource;
            this.title = title;
        }

        @Override
        public String getTitle() {
            return title;
        }

        @Override
        public int size() {
            return datasource.smoothLogPower.length;
        }

        @Override
        public Number getX(int index) {
            return index;
        }

        @Override
        public Number getY(int index) {
            return datasource.smoothLogPower[index];
        }
    }

}
