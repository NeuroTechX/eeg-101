package com.eeg_project.components.classifier;

import android.os.Handler;
import android.os.HandlerThread;
import android.support.annotation.Nullable;
import android.util.Log;

import com.choosemuse.libmuse.MuseDataPacketType;
import com.eeg_project.MainApplication;
import com.eeg_project.components.signal.BandPowerExtractor;
import com.eeg_project.components.signal.CircularBuffer;
import com.eeg_project.components.signal.FFT;
import com.eeg_project.components.signal.NoiseDetector;
import com.eeg_project.components.signal.PSDBuffer2D;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Created by dano on 05/06/17.
 */


public class ClassifierModule extends ReactContextBaseJavaModule implements BufferListener {

    // ---------------------------------------------------------
    // Variables
    private final String TAG = "Classifier";
    public CircularBuffer eegBuffer;
    public int samplingFrequency;
    public ClassifierDataListener dataListener;
    public List<Double> sampleData = new ArrayList<Double>();
    public NoiseDetector noiseDetector = new NoiseDetector(600);
    private double[][] smoothLogPower;
    private HandlerThread dataThread;
    private Handler dataHandler;
    boolean isLowEnergy;

    // grab reference to global Muse
    MainApplication appState;


    // ---------------------------------------------------------
    // Constructor
    public ClassifierModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    // ---------------------------------------------------------
    // React Native Module methods
    // Required by ReactContextBaseJavaModule
    @Override
    public String getName() {
        return "Classifier";
    }

    // Called to emit events to event listeners in JS
    private void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    // ---------------------------------------------------------
    // Bridged methods

    @ReactMethod
    public void collectTrainingData(String dataClass, Promise promise) {
        if (isLowEnergy) {
            samplingFrequency = 256;
        } else samplingFrequency = 220;

        eegBuffer = new CircularBuffer(samplingFrequency, 4);
        eegBuffer.addListener(this);

        // Data processing is handled in a background handler thread
        dataThread = new HandlerThread("dataThread");
        dataThread.start();
        dataHandler = new Handler(dataThread.getLooper());


        dataListener = new ClassifierDataListener(eegBuffer);
        appState.connectedMuse.registerDataListener(dataListener, MuseDataPacketType.EEG);

        // Save as arrays in appropriate format for classifier
        // Return promise once data has been successfully collected and formatted

        Log.w(TAG, "collectTrainingData called " + dataClass);
        promise.resolve(true);
    }

    @ReactMethod
    public void stopCollecting() {
        // Stop ongoing any ongoing data collection processes
        // Unregister datalistener
        appState.connectedMuse.unregisterDataListener(dataListener, MuseDataPacketType.EEG);

        Log.w(TAG, "stopCollecting");

    }

    @ReactMethod
    public void train(boolean partialFit, Promise promise) {
        // Train classifier on saved data arrays
        // Return promise with cross-val score
        // Use partialfit if partialFit is true
        Log.w(TAG, "train");
        promise.resolve(true);
    }

    @ReactMethod
    public void runClassification() {
        Log.w(TAG, "run");
    }

    @ReactMethod
    public void reset() {
        // Reset entire classifier, including clearing all variables and ongoing processes
        Log.w(TAG, "reset");
    }

    // ------------------------------------------------------------------------------
    // Runnables

    public class dataRunnable implements Runnable {
        public BandPowerExtractor bandExtractor;

        private int samplingFrequency;
        private FFT fft;
        private double[][] rawBuffer;
        private double[][] logpower;
        private double[][] smoothPSD;
        PSDBuffer2D psdBuffer;
        private double[][] bandMeans;

        public dataRunnable(double[][] buffer, int frequency) {
            this.samplingFrequency = frequency;
            this.rawBuffer = buffer;
            fft = new FFT(samplingFrequency, 256, samplingFrequency);
            int nbBins = fft.getFreqBins().length;
            psdBuffer = new PSDBuffer2D(samplingFrequency,4, nbBins);
            logpower = new double[4][nbBins];
            smoothLogPower = new double[4][nbBins];
            bandExtractor = new BandPowerExtractor(fft.getFreqBins());
        }

        @Override
        public void run() {
            try {
                if (noisePresent(rawBuffer)) {
                    return;
                }
             smoothPSD = getPSD(rawBuffer);
             bandMeans = bandExtractor.extract(smoothPSD);
            Log.w(TAG, Arrays.deepToString(bandMeans));
            } catch (Exception e) {
                Log.w(TAG, e);
                return;
            }
        }

        public boolean noisePresent(double[][] buffer) {
            for (boolean value : noiseDetector.detectArtefact(buffer)) {
                if (value) {
                    return true;
                }
            }
            return false;
        }

        public double[][] getPSD(double[][] buffer) {
            // [nbch][nbsmp]
            for (int i = 0; i < 4; i++) {
                double[] channelPower = fft.computeLogPSD(buffer[i]);
                for (int j = 0; j < channelPower.length; j++){
                    logpower[i][j] = channelPower[j];
                }
            }
            psdBuffer.update(logpower);
            smoothLogPower = psdBuffer.mean();
            return smoothLogPower;
        }
    }

        // ---------------------------------------------------------
        // Methods

        public void bufferFull(double[][] buffer) {
            dataHandler.post(new dataRunnable(buffer, samplingFrequency));
        }

    }



