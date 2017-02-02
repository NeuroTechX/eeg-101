package com.eeg_project.components.graphs;

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
import com.eeg_project.components.signal.CircularBuffer;
import com.eeg_project.components.signal.FFT;
import com.eeg_project.components.signal.PSDBuffer;


// A dynamic power spectra density (PSD) graph generated from a circular buffer
public class PSDGraph extends FrameLayout {

    // ------------------------------------------------------------------------
    // Variables
    private XYPlot psdPlot;
    private PSDDataSource dataSource;
    public  int PLOT_LENGTH = 50;
    private PSDSeries dataSeries;
    public PlotUpdater plotUpdater;
    public MuseDataListener dataListener;
    Thread dataThread;
    Thread renderingThread;

    // Reference to global application state used for connected Muse
    MainApplication appState;

    // CircBuffer specific variables
    public CircularBuffer eegBuffer = new CircularBuffer(220, 4);
    public double[] newData = new double[4];

    // Bridged props
    // Default channelOfInterest = 1 (left ear)
    public int channelOfInterest = 1;

    // ------------------------------------------------------------------------
    // Constructors
    public PSDGraph(Context context) {
        super(context);
        appState = ((MainApplication) context.getApplicationContext());
        initView(context);
    }

    // -----------------------------------------------------------------------
    // Bridge functions (can be called from JS by setting props)
    public void setChannelOfInterest(int channel) {
        channelOfInterest = channel;
        dataSource.clearDataBuffer();
    }

    // Initializes and styles the AndroidPlot XYPlot component of EEGGraph
    // All styling is performed entirely within this function, XML is not used

    public void initView(Context context) {

        // Create circBufferPlot
        psdPlot = new XYPlot(context, "PSD Plot");

        // Create plotUpdater
        plotUpdater = new PlotUpdater(psdPlot);

        // Create dataSource
        dataSource = new PSDDataSource(appState.connectedMuse.isLowEnergy());

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

        // Add plot to CircularBufferGraph
        this.addView(psdPlot, new LayoutParams(
                LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT));

        onVisibilityChanged(this, View.VISIBLE);
    }

    // Called when user navigates away from parent React Native component. Stops active threads in order to limit memory usage
    @Override
    public void onVisibilityChanged(View changedView, int visibility){
        if (visibility == View.INVISIBLE){
            stopThreads();
        }
        else if (dataThread == null || !dataThread.isAlive()) {
            startDataThread();
            startRenderingThread();
            dataListener = new psdDataListener();
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
    public void startRenderingThread(){
        renderingThread = new Thread (plotUpdater);
        renderingThread.start();
    }

    // Stop all threads
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
    class psdDataListener extends MuseDataListener {

        // Constructor
        psdDataListener() {
        }

        // Called whenever an incoming data packet is received. Handles different types of incoming data packets and updates data correctly
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

    // --------------------------------------------------------------
    // Runnables

    // Runnable class that redraws plot at a fixed frequency
    class PlotUpdater implements Runnable {
        Plot plot;
        private boolean keepRunning = true;
        public PlotUpdater(Plot plot) {
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
    // Processes raw EEG data and updates dataSeries
    public class PSDDataSource implements Runnable {
        double[] latestSamples;
        private boolean keepRunning = true;
        int stepSize = 26;

        // Initialize FFT transform
        int fs = 256;
        int bufferLength = fs;
        int windowLength = (int)fs;
        int fftLength = 256; // Should be 256
        FFT fft = new FFT(windowLength, fftLength, fs);
        double[] f = fft.getFreqBins();

        // Initialize FFT 2D Buffer
        int fftBufferLength = 20;
        int nbBins = f.length;
        PSDBuffer psdBuffer = new PSDBuffer(fftBufferLength, nbBins);

        double[] logpower = new double[nbBins];
        public double[] smoothLogPower = new double[nbBins];

        public PSDDataSource(Boolean isLowEnergy) {
            if (isLowEnergy) {
                stepSize = 26;
            } else {
                stepSize = 22;
            }
        }

        @Override
        public void run() {
            try {
                while (keepRunning) {
                    if (eegBuffer.getPts() >= stepSize) {

                        // Extract latest raw and filtered samples
                        latestSamples = eegBuffer.extractSingleChannelTransposed(windowLength, channelOfInterest - 1);

                        // Compute log-PSD for channel of interest
                        double[] logpower = fft.computeLogPSD(latestSamples);

                        // Write new log-PSD in buffer
                        psdBuffer.update(logpower);

                        // Compute average PSD over buffer
                        smoothLogPower = psdBuffer.mean();

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
        private int seriesIndex;
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
