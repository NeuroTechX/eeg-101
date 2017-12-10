package com.eeg_project.components.signal;

import android.app.Activity;
import android.util.Log;

import com.eeg_project.MainActivity;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.apache.commons.lang3.ArrayUtils;

import java.lang.reflect.Array;
import java.nio.ByteBuffer;
import java.util.Arrays; // For printing arrays when debugging

import javax.annotation.Nullable;

// This class implements a simple EEG noise detector based on
// variance thresholding of a short epoch.
public class NoiseDetector {

    // ------------------------------------------------------------------------
    // Variables

    private double t;
    private ReactApplicationContext reactContext;
    private WritableMap noiseMap = Arguments.createMap();

    // ------------------------------------------------------------------------
    // Constructor

    public NoiseDetector(double threshold, @Nullable ReactApplicationContext rctContext) {
        this.reactContext = rctContext;
        t = threshold;
    }


    // Called to emit events to event listeners in JS
    private void sendEvent(String eventName, WritableMap noise) {
        this.reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, noise);
    }

    // ------------------------------------------------------------------------
    // Methods

    public boolean detectArtefact(double[] epoch) {
        // Flag noise/artefact in epoch.
        //
        // Returns true if the epoch is noisy/artefacted
        // Returns false otherwise
        //
        // TODO: Use more advanced method than variance thresholding!

        double epochVar = variance(epoch);

        if (epochVar > t) {
            return true;
        } else {
            return false;
        }
    }

    public boolean[] detectArtefact(double[][] epoch) {
        // Flag noise/artefact in epoch on an array of size [nbCh,nbWindowLength]
        boolean noiseDetected = false;
        boolean[] decisions = new boolean[epoch.length];
        int len = epoch.length;
        for (int c = 0; c < len; c++) {
            decisions[c] = detectArtefact(epoch[c]);
        }

        for(int i =0; i<decisions.length; i++) if(decisions[i]) {
            noiseDetected = true;
            noiseMap.putBoolean(String.valueOf(i),true);
        }

        sendEvent("NOISE", noiseMap);
         noiseMap = Arguments.createMap();
        return decisions;
    }

    private double mean(double[] x) {
        // Compute the mean of vector x

        double sum = 0;
        for (double a: x) {
            sum += a;
        }

        return sum / x.length;
    }

    private double variance(double[] x) {
        // Compute the unbiased variance of vector x
        double mean = mean(x);
        double sum = 0;

        for (double a: x) {
            sum += (a - mean)*(a - mean);
        }
        return sum/(x.length - 1);

    }

    // Example main for testing
    public static void main(String[] args) {

        // Initialize array to filter
        int nbCh = 4;
        int windowLength = 220;
        double[][] x = new double[nbCh][windowLength];
        for(int c = 0; c < nbCh; c++) {
            for(int i = 0; i < windowLength; i++) {
                x[c][i] = 1.1234*i*c;
            }
        }

        // Initialize noise detector
        //NoiseDetector noiseDetector = new NoiseDetector(6000.0);

        // Detect noise!
        //boolean[] decisions = noiseDetector.detectArtefact(x);
        //System.out.println(Arrays.toString(decisions));

    }

}