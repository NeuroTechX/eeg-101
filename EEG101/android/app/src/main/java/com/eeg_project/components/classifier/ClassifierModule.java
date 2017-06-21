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

import org.apache.commons.lang3.ArrayUtils;

import java.lang.reflect.Array;
import java.util.Collections;
import java.util.LinkedList;

/**
 * Bridged native module for classifier.
 * Starts ClassifierDataListener to record data from Muse
 * Receives contents of CircularBuffer whenever it fills up in bufferFull
 * Posts data to dataRunnable in background HandlerThread to get PSD and extract band powers
 */


public class ClassifierModule extends ReactContextBaseJavaModule implements BufferListener {


    // ---------------------------------------------------------
    // Variables
    public static final int FFT_LENGTH = 256;
    public static final int M = 4;
    private final String TAG = "Classifier";
    private int dataClass;
    public CircularBuffer eegBuffer;
    public int samplingFrequency;
    public ClassifierDataListener dataListener;
    public NoiseDetector noiseDetector = new NoiseDetector(600, getReactApplicationContext());
    private double[][] smoothLogPower;
    private HandlerThread dataThread;
    private Handler dataHandler;
    boolean isLowEnergy;
    private boolean isTraining;
    private boolean isPredicting;

    public GaussianNaiveBayesClassifier classifier = new GaussianNaiveBayesClassifier();
    public LinkedList<double[]> trainingData = new LinkedList<>();
    public LinkedList<Integer> labels = new LinkedList<>();

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
    private void sendEvent(String eventName, int result) {
        getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, result);
    }

    // ---------------------------------------------------------
    // Bridged methods

    @ReactMethod
    public void collectTrainingData(int dClass, Promise promise) {
        if (isLowEnergy) {
            samplingFrequency = FFT_LENGTH;
        } else samplingFrequency = 220;

        eegBuffer = new CircularBuffer(samplingFrequency, M);
        eegBuffer.addListener(this);
        this.dataClass = dClass;
        startThread();
        dataListener = new ClassifierDataListener(eegBuffer);
        appState.connectedMuse.registerDataListener(dataListener, MuseDataPacketType.EEG);

        this.isTraining = true;

        // Save as arrays in appropriate format for classifier
        // Return promise once data has been successfully collected and formatted

        promise.resolve(true);
    }

    @ReactMethod
    public void stopCollecting() {
        // Stop ongoing any ongoing data collection processes
        // Unregister datalistener
        appState.connectedMuse.unregisterDataListener(dataListener, MuseDataPacketType.EEG);
        isPredicting = false;
        isTraining = false;
    }

    @ReactMethod
    public void train(boolean partialFit, Promise promise) {
        // Train classifier on saved data arrays
        // Return promise with cross-val score
        // Use partialfit if partialFit is true
        classifier.fit(trainingData, labels);
        classifier.print();
        promise.resolve(true);
    }

    @ReactMethod
    public void crossValidate(Integer k, Promise promise) {
        // runs k fold cross validation on training data List

        if(trainingData.size() < 1) {
            Log.w(TAG, "not enough data for cross val");
            promise.resolve(false);
            return;
        }

        double[] scores = new double[k];
        double scoreSum = 0;
        LinkedList<Integer> shuffledIndices = new LinkedList<Integer>();



        // equivalent of shuffleIndices = np.arange(0,trainingData.size)
        for(Integer i = 0; i < trainingData.size(); i++){
            shuffledIndices.add(i);
        }
        Collections.shuffle(shuffledIndices);

        int chunk = shuffledIndices.size() / k;

        for(int i = 0; i < k; i++){
            Log.w(TAG, "chunk start = " + i * chunk);


            LinkedList<Integer> testIndices = new LinkedList<Integer>();
            LinkedList<Integer> trainIndices = new LinkedList<Integer>();
            LinkedList<double[]> trainData = new LinkedList<double[]>();
            LinkedList<double[]> testData = new LinkedList<double[]>();
            LinkedList<Integer> trainLabels = new LinkedList<Integer>();
            LinkedList<Integer> testLabels = new LinkedList<Integer>();

            // Get indices for test and train chunks
            for(int j = 0; j < shuffledIndices.size(); j++){
                if(j >= i * chunk && j < i * chunk + chunk){
                    testIndices.add(shuffledIndices.get(j));
                } else {
                    trainIndices.add(shuffledIndices.get(j));
                }
            }

            // Create training data and label lists from indices
            for(Integer l : trainIndices){
                trainData.add(trainingData.get(l));
                trainLabels.add(labels.get(l));
            }
            Log.w(TAG, "trainIndices = " + ArrayUtils.toString(trainIndices));


            // Create test data and label lists from indices
            for(Integer l : testIndices){
                testData.add(trainingData.get(l));
                testLabels.add(labels.get(l));
            }
            Log.w(TAG, "testIndices = " + ArrayUtils.toString(testIndices));



            classifier.fit(trainData, trainLabels);
            scores[i] = classifier.score(testData, testLabels);
        }

        for(double s : scores){
            scoreSum = scoreSum + s;
        }

        Log.w(TAG, "Cross val score is " + scoreSum / k);

        promise.resolve(scoreSum/k);
    }

    @ReactMethod
    public void runClassification() {
        isTraining = false;
        isPredicting = true;

        dataListener = new ClassifierDataListener(eegBuffer);
        appState.connectedMuse.registerDataListener(dataListener, MuseDataPacketType.EEG);

        Log.w(TAG, "run");
    }

    @ReactMethod
    public void reset() {
        // Reset entire classifier, including clearing all variables and ongoing processes
        Log.w(TAG, "reset");
        stopCollecting();
        dataThread.quit();
        trainingData = new LinkedList<>();
        labels = new LinkedList<>();
        classifier = new GaussianNaiveBayesClassifier();
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
        private double[] bandMeans;

        public dataRunnable(double[][] buffer, int frequency) {
            this.samplingFrequency = frequency;
            this.rawBuffer = buffer;
            fft = new FFT(samplingFrequency, FFT_LENGTH, samplingFrequency);
            int nbBins = fft.getFreqBins().length;
            psdBuffer = new PSDBuffer2D(samplingFrequency, M, nbBins);
            logpower = new double[M][nbBins];
            smoothLogPower = new double[M][nbBins];
            bandExtractor = new BandPowerExtractor(fft.getFreqBins());
        }

        @Override
        public void run() {
            try {
                if (noisePresent(rawBuffer)) {
                    return;
                }
             smoothPSD = getPSD(rawBuffer);
             bandMeans = bandExtractor.extract1D(smoothPSD);

             if(isPredicting){
                 sendEvent("PREDICT_RESULT", classifier.predict(bandMeans));
             } else if(isTraining) {
                 trainingData.add(bandMeans);
                 labels.add(dataClass);
             }

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
            for (int i = 0; i < M; i++) {
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

        public void startThread(){
            dataThread = new HandlerThread("dataThread");
            dataThread.start();
            dataHandler = new Handler(dataThread.getLooper());
        }

    }



