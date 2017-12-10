package com.eeg_project.components.classifier;

import android.os.Handler;
import android.os.HandlerThread;
import android.util.Log;

import com.choosemuse.libmuse.Eeg;
import com.choosemuse.libmuse.Muse;
import com.choosemuse.libmuse.MuseArtifactPacket;
import com.choosemuse.libmuse.MuseDataListener;
import com.choosemuse.libmuse.MuseDataPacket;
import com.choosemuse.libmuse.MuseDataPacketType;
import com.eeg_project.MainApplication;
import com.eeg_project.components.csv.EEGFileWriter;
import com.eeg_project.components.signal.BandPowerExtractor;
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
 * Bridged native module for interacting with the headband for the classifier (and noise detection)
 *
 */

public class ClassifierModule extends ReactContextBaseJavaModule implements BufferListener {

    // ---------------------------------------------------------
    // Variables

    public static final int FFT_LENGTH = 256;
    public static final int NUM_CHANNELS = 4;
    public static final int EPOCHS_PER_SECOND = 4;
    private boolean isTraining;
    private boolean isPredicting;
    private int dataClass;
    public int samplingRate = 256;
    private int nbBins;
    public ClassifierDataListener dataListener;
    public EpochBuffer eegBuffer;
    private HandlerThread dataThread;
    private Handler dataHandler;
    private Promise collectionPromise;
    private PSDBuffer2D psdBuffer2D;
    private FFT fft;
    public BandPowerExtractor bandExtractor;
    private int notchFrequency = 60;

    public NoiseDetector noiseDetector = new NoiseDetector(500, getReactApplicationContext());
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
    public void init(int notchFrequency) {
        Log.w("classifier", "init");
        if(appState.connectedMuse != null) {
            if (!appState.connectedMuse.isLowEnergy()) {
                samplingRate = 220;
            }
        }
        this.notchFrequency = notchFrequency;

        fft = new FFT(samplingRate, FFT_LENGTH, samplingRate);
        nbBins = fft.getFreqBins().length;
        bandExtractor = new BandPowerExtractor(fft.getFreqBins());
        dataListener = new ClassifierDataListener();
    }

    @ReactMethod
    public void collectTrainingData(int dClass, Promise promise) {
        collectionPromise = promise;
        isTraining = true;
        dataClass = dClass;

        // Epoch buffer with no overlap (samplingRate interval) for collecting training data
        // This helps avoid overfitting
        eegBuffer = new EpochBuffer(samplingRate, NUM_CHANNELS, samplingRate);
        eegBuffer.addListener(this);

        appState.connectedMuse.registerDataListener(dataListener, MuseDataPacketType.EEG);
        startThread();
    }

    @ReactMethod
    public void runClassification() {
        isPredicting = true;

        // Create PSDBuffer to smooth over last 4 collected epochs
        psdBuffer2D = new PSDBuffer2D(4, NUM_CHANNELS, nbBins);

        // Collect 4 epochs a second for collecting training data
        eegBuffer = new EpochBuffer(samplingRate, NUM_CHANNELS, samplingRate / EPOCHS_PER_SECOND);
        eegBuffer.addListener(this);

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
        isPredicting = false;
        isTraining = false;
        appState.connectedMuse.unregisterDataListener(dataListener, MuseDataPacketType.EEG);
        stopThread();

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
    public void fitWithScore(Integer k, Promise promise) {
        WritableMap classifierMap = Arguments.createMap();
        WritableMap meansMap = Arguments.createMap();
        classifierMap.putDouble("score",crossValidate(k));
        classifier.fit(trainingData, labels);
        classifierMap.putArray("featurePower", classifier.getDiscrimPowerArray());
        promise.resolve(classifierMap);
    }


    @ReactMethod
    public void reset() {
        stopCollecting();
        trainingData = new LinkedList<>();
        labels = new LinkedList<>();
        classifier = new GaussianNaiveBayesClassifier();
    }


    @ReactMethod
    public void exportClassifier() {
        EEGFileWriter fileWriter = new EEGFileWriter(getReactApplicationContext().getCurrentActivity(), "Classifier");
        fileWriter.initFile("Classifier");
        for(int i = 0; i < trainingData.size(); i++){
            double[] newLine = new double[trainingData.get(0).length + 1];
            newLine[0] = labels.get(i);
            for(int j = 0; j < trainingData.get(0).length; j++) {
                newLine[j + 1] = trainingData.get(i)[j];
            }
            fileWriter.addDataToFile(newLine);
        }

        fileWriter.addLineToFile(" ");
        fileWriter.addLineToFile("Summary of GaussianNaiveBayesClassifier");
        fileWriter.addLineToFile("Classes, "+Arrays.toString(classifier.classes).replaceAll(",", "/"));
        fileWriter.addLineToFile("Cross-validation accuracy, " +crossValidate(6));
        fileWriter.addLineToFile("Number of classes, "+classifier.nbClasses);
        fileWriter.addLineToFile("Number of features, "+classifier.nbFeats);
        fileWriter.addLineToFile("Class counts, "+Arrays.toString(classifier.getClassCounts()).replaceAll(",", "/"));
        fileWriter.addLineToFile("Sums, "+Arrays.deepToString(classifier.sum));
        fileWriter.addLineToFile("Sums of squares, "+Arrays.deepToString(classifier.sumSquares));
        fileWriter.addLineToFile("Means, "+Arrays.deepToString(classifier.getMeans()));
        fileWriter.addLineToFile("Variances, "+Arrays.deepToString(classifier.getVariances()));
        fileWriter.addLineToFile("Discriminative power, "+
                Arrays.toString(classifier.computeFeatDiscrimPower()));
        fileWriter.writeFile("Classifier");
    }

    // Just starts the necessary listening and signal processing functions in order to send noise
    // events back to React layer
    @ReactMethod
    public void startNoiseListener() {
        // Sample noise twice a second
        eegBuffer = new EpochBuffer(samplingRate, NUM_CHANNELS, samplingRate / 2);
        eegBuffer.addListener(this);
        appState.connectedMuse.registerDataListener(dataListener, MuseDataPacketType.EEG);
        startThread();
    }

    @ReactMethod
    public void stopNoiseListener() {
        appState.connectedMuse.unregisterDataListener(dataListener, MuseDataPacketType.EEG);
        stopThread();
    }

    // ------------------------------------------------------------------------------
    // Helper functions

    public void getEpoch(double[][] buffer) {
        dataHandler.post(new ClassifierRunnable(buffer));
    }

    public void startThread() {
        dataThread = new HandlerThread("dataThread");
        dataThread.start();
        dataHandler = new Handler(dataThread.getLooper());
    }

    public void stopThread() {
        if (dataHandler != null) {

            // Removes all runnables and things from the Handler
            dataHandler.removeCallbacksAndMessages(null);
            dataThread.quit();
        }
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


            LinkedList<Integer> trainIndices = new LinkedList<Integer>();
            LinkedList<Integer> testIndices = new LinkedList<Integer>();
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

    // ------------------------------------------------------------------------------
    // Helper Classes


    public class ClassifierRunnable implements Runnable {

        private double[][] rawBuffer;
        private double[][] PSD;
        private double[] bandMeans;

        public ClassifierRunnable(double[][] buffer) {
            rawBuffer = buffer;
            PSD = new double[NUM_CHANNELS][nbBins];
        }

        @Override
        public void run() {
            if (noisePresent(rawBuffer)) {
                return;
            }

            if(isTraining) {
                getPSD(rawBuffer);
                bandMeans = bandExtractor.extract1D(PSD);
                trainingData.add(bandMeans);
                labels.add(dataClass);
            }

            else if(isPredicting){
                getSmoothPSD(rawBuffer);
                bandMeans = bandExtractor.extract1D(PSD);
                sendEvent("PREDICT_RESULT", classifier.predict(bandMeans));
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

        public void getPSD(double[][] buffer) {
            // [nbch][nbsmp]
            for (int i = 0; i < NUM_CHANNELS; i++) {
                double[] channelPower = fft.computeLogPSD(buffer[i]);
                for (int j = 0; j < channelPower.length; j++) {
                    PSD[i][j] = channelPower[j];
                }
            }
        }

        public void getSmoothPSD(double[][] buffer) {
            // [nbch][nbsmp]
            for (int i = 0; i < NUM_CHANNELS; i++) {
                double[] channelPower = fft.computeLogPSD(buffer[i]);
                for (int j = 0; j < channelPower.length; j++) {
                    PSD[i][j] = channelPower[j];
                }
            }
            psdBuffer2D.update(PSD);
            PSD = psdBuffer2D.mean();
        }
    }


    public class ClassifierDataListener extends MuseDataListener {

        double[] newData;
        boolean filterOn;
        public Filter bandstopFilter;
        public double[][] bandstopFiltState;


        // if connected Muse is a 2016 BLE version, init a bandstop filter to remove 60hz noise
        ClassifierDataListener() {
            if (samplingRate == 256) {
                filterOn = true;
                bandstopFilter = new Filter(samplingRate, "bandstop", 5, notchFrequency - 5, notchFrequency + 5);
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





