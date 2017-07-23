package com.eeg_project.components.classifier;

import android.util.Log;

import com.choosemuse.libmuse.Eeg;
import com.choosemuse.libmuse.Muse;
import com.choosemuse.libmuse.MuseArtifactPacket;
import com.choosemuse.libmuse.MuseDataListener;
import com.choosemuse.libmuse.MuseDataPacket;
import com.choosemuse.libmuse.MuseDataPacketType;
import com.eeg_project.MainApplication;
import com.eeg_project.components.signal.BandPowerExtractor;
import com.eeg_project.components.signal.CircularBuffer;
import com.eeg_project.components.signal.FFT;
import com.eeg_project.components.signal.Filter;
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

public class ClassifierModule extends ReactContextBaseJavaModule {


    // ---------------------------------------------------------
    // Variables
    public static final int FFT_LENGTH = 256;
    public static final int numChannels = 4;
    private final String TAG = "Classifier";
    private int dataClass;
    public CircularBuffer eegBuffer;
    public int samplingRate = 256;
    public ClassifierDataListener dataListener;
    public ClassifierRunnable classifierRunnable = new ClassifierRunnable();
    public NoiseDetector noiseDetector = new NoiseDetector(600, getReactApplicationContext());
    private double[][] smoothLogPower;
    private Thread dataThread;
    boolean isLowEnergy;
    private boolean isTraining;
    private boolean isPredicting;
    private Promise collectionPromise;
    private int stepSize = 4;

    public GaussianNaiveBayesClassifier classifier = new GaussianNaiveBayesClassifier();
    public LinkedList<double[]> trainingData = new LinkedList<>();
    public LinkedList<Integer> labels = new LinkedList<>();

    // grab reference to global Muse
    MainApplication appState;



    // ---------------------------------------------------------
    // Constructor
    public ClassifierModule(ReactApplicationContext reactContext) {
        super(reactContext);
        Log.w("ClassifierModule", "constructor");
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
        Log.w("ClassifierModule", "Collect Training Data called");
        if(appState.connectedMuse != null) {
            if (!appState.connectedMuse.isLowEnergy()) {
                samplingRate = 220;
            }
        }

        this.collectionPromise = promise;
        this.isTraining = true;
        eegBuffer = new CircularBuffer(samplingRate, numChannels);
        this.dataClass = dClass;
        dataListener = new ClassifierDataListener();
        appState.connectedMuse.registerDataListener(dataListener, MuseDataPacketType.EEG);
        startThread();

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
        classifierRunnable.stopThread();
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
        Log.w("ClassifierModule", "runClassification called");
        if(appState.connectedMuse != null) {
            if (!appState.connectedMuse.isLowEnergy()) {
                samplingRate = 220;
            }
        }
        isPredicting = true;
        eegBuffer = new CircularBuffer(samplingRate, numChannels);
        dataListener = new ClassifierDataListener();
        appState.connectedMuse.registerDataListener(dataListener, MuseDataPacketType.EEG);
        startThread();
    }

    @ReactMethod
    public void reset() {
        // Reset entire classifier, including clearing all variables and ongoing processes

        stopCollecting();

        trainingData = new LinkedList<>();
        labels = new LinkedList<>();
        classifier = new GaussianNaiveBayesClassifier();
    }

    // ------------------------------------------------------------------------------
    // Runnables

    public class ClassifierRunnable implements Runnable {
        public BandPowerExtractor bandExtractor;


        private FFT fft;
        private double[][] logpower;
        private double[][] smoothPSD;
        PSDBuffer2D psdBuffer;
        private double[] bandMeans;
        private boolean keepRunning;
        private double[][] latestSamples;

        public ClassifierRunnable() {
            fft = new FFT(samplingRate, FFT_LENGTH, samplingRate);
            int nbBins = fft.getFreqBins().length;
            psdBuffer = new PSDBuffer2D(samplingRate, numChannels, nbBins);
            logpower = new double[numChannels][nbBins];
            smoothLogPower = new double[numChannels][nbBins];
            bandExtractor = new BandPowerExtractor(fft.getFreqBins());
        }

        @Override
        public void run() {
            Log.w("ClassifierModule", "dataclass = " + dataClass);
            try {
                keepRunning = true;
                while (keepRunning) {
                    if (eegBuffer.getPts() >= stepSize) {

                        // Extract latest raw samples
                        latestSamples = eegBuffer.extractTransposed(256);

                        if (!noisePresent(latestSamples)) {
                            smoothPSD = getPSD(latestSamples);
                            bandMeans = bandExtractor.extract1D(smoothPSD);

                            if (isPredicting) {
                                sendEvent("PREDICT_RESULT", classifier.predict(bandMeans));
                            } else if (isTraining) {
                                trainingData.add(bandMeans);
                                labels.add(dataClass);
                            }
                        }
                        eegBuffer.resetPts();
                    }
                }


                    } catch(Exception e){
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
            for (int i = 0; i < numChannels; i++) {
                double[] channelPower = fft.computeLogPSD(buffer[i]);
                for (int j = 0; j < channelPower.length; j++){
                    logpower[i][j] = channelPower[j];
                }
            }
            psdBuffer.update(logpower);
            smoothLogPower = psdBuffer.mean();
            return smoothLogPower;
        }

        public void stopThread() {
            keepRunning = false;
        }
    }

        // ---------------------------------------------------------
        // Methods



        public void startThread(){
            dataThread = new Thread(classifierRunnable);
            dataThread.start();
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

    public class ClassifierDataListener extends MuseDataListener {

        // ------------------------------------------
        // Variables
        double[] newData;
        boolean filterOn;
        public Filter bandstopFilter;
        public double[][] bandstopFiltState;

        // grab reference to global Muse
        MainApplication appState;

        // if connected Muse is a 2016 BLE version, init a bandstop filter to remove 60hz noise
        ClassifierDataListener() {
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


}





