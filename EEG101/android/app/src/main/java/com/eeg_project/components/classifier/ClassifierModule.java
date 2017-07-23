package com.eeg_project.components.classifier;

import android.os.Handler;
import android.os.HandlerThread;
import android.util.Log;

import com.choosemuse.libmuse.MuseDataPacketType;
import com.eeg_project.MainApplication;
import com.eeg_project.components.signal.BandPowerExtractor;
import com.eeg_project.components.signal.CircularBuffer;
import com.eeg_project.components.signal.FFT;
import com.eeg_project.components.signal.NoiseDetector;
import com.eeg_project.components.signal.PSDBuffer2D;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.Arrays;
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
    private Promise collectionPromise;

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

        this.collectionPromise = promise;

        eegBuffer = new CircularBuffer(samplingFrequency, M);
        eegBuffer.addListener(this);
        this.dataClass = dClass;
        startThread();
        dataListener = new ClassifierDataListener(eegBuffer);
        appState.connectedMuse.registerDataListener(dataListener, MuseDataPacketType.EEG);

        this.isTraining = true;
    }

    @ReactMethod
    public void getNumSamples(Promise promise) {
        WritableMap samples = Arguments.createMap();
        int numClass1Samples = 0;
        int numClass2Samples = 0;
        if (labels.size() >= 1) {


            for (Integer i : labels) {
                if (i == 1) {
                    numClass1Samples++;
                } else if (i == 2) {
                    numClass2Samples++;
                }
            }
        }
        samples.putInt("class1Samples", numClass1Samples);
        samples.putInt("class2Samples", numClass2Samples);
        promise.resolve(samples);
    }

    @ReactMethod
    public void stopCollecting() {
        // Stop ongoing any ongoing data collection processes
        // Unregister datalistener
        appState.connectedMuse.unregisterDataListener(dataListener, MuseDataPacketType.EEG);
        isPredicting = false;
        isTraining = false;

        if(collectionPromise != null) {
            int numSamples = 0;
            for(int l : labels){
                if(l == dataClass){
                    numSamples++;
                }
            }
            collectionPromise.resolve(numSamples);
            collectionPromise = null;
        }
    }

    @ReactMethod
    public void fit(boolean partialFit) {
        // Train classifier on saved data arrays
        // Return promise with cross-val score
        // Use partialfit if partialFit is true
        if(partialFit){
            Log.w(TAG,"partial fit linkedlist fn needs to be written");
            //classifier.partialFit(trainingData, labels);
        } else {
            classifier.fit(trainingData, labels);
            classifier.print();
        }
    }

    @ReactMethod
    public void fitWithScore(Integer k, Promise promise) {
        WritableMap classifierMap = Arguments.createMap();

        classifierMap.putDouble("score",crossValidate(k));
        classifier.fit(trainingData, labels);
        classifierMap.putString("counts", Arrays.toString(classifier.getClassCounts()));
        classifierMap.putString("priors", Arrays.toString(classifier.getClassPriors()));
        classifierMap.putString("means", Arrays.deepToString(classifier.getMeans()));
        classifierMap.putString("variances", Arrays.deepToString(classifier.getVariances()));
        classifierMap.putString("discrimPower", Arrays.toString(classifier.computeFeatDiscrimPower()));
        classifierMap.putArray("featureRanking", classifier.rankWritableFeats());
        promise.resolve(classifierMap);
    }

    @ReactMethod
    public void runClassification() {
        isTraining = false;
        isPredicting = true;

        dataListener = new ClassifierDataListener(eegBuffer);
        appState.connectedMuse.registerDataListener(dataListener, MuseDataPacketType.EEG);

    }

    @ReactMethod
    public void reset() {
        // Reset entire classifier, including clearing all variables and ongoing processes

        stopCollecting();
        if(dataThread != null) {
            dataThread.quit();
        }
        trainingData = new LinkedList<>();
        labels = new LinkedList<>();
        classifier = new GaussianNaiveBayesClassifier();
    }

    // ------------------------------------------------------------------------------
    // Runnables

    public class ClassifierRunnable implements Runnable {
        public BandPowerExtractor bandExtractor;

        private int samplingFrequency;
        private FFT fft;
        private double[][] rawBuffer;
        private double[][] logpower;
        private double[][] smoothPSD;
        PSDBuffer2D psdBuffer;
        private double[] bandMeans;

        public ClassifierRunnable(double[][] buffer, int frequency) {
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
            dataHandler.post(new ClassifierRunnable(buffer, samplingFrequency));
        }

        public void startThread(){
            dataThread = new HandlerThread("dataThread");
            dataThread.start();
            dataHandler = new Handler(dataThread.getLooper());
        }

        public double crossValidate(Integer k) {
            // runs k fold cross validation on training data List

            if(trainingData.size() < 1) {
                return 0;
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


                // Create test data and label lists from indices
                for(Integer l : testIndices){
                    testData.add(trainingData.get(l));
                    testLabels.add(labels.get(l));
                }



                classifier.fit(trainData, trainLabels);
                scores[i] = classifier.score(testData, testLabels);
            }

            for(double s : scores){
                scoreSum = scoreSum + s;
            }

            return scoreSum/k;
        }

    }



