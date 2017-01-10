package com.eeg_project.components.signal;
import android.util.Log;

import java.util.Arrays; // For printing arrays when debugging

public class NoiseDetector {
    // This class implements a simple EEG noise detector based on
    // variance thresholding of a short epoch.

    private double t;

    public NoiseDetector(double threshold) {
        t = threshold;
    }

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

        boolean[] decisions = new boolean[epoch.length];

        for (int c = 0; c < epoch.length; c++) {
            decisions[c] = detectArtefact(epoch[c]);
            if (c==1) {Log.w("variance", "" + variance(epoch[c]));}
        }

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
        NoiseDetector noiseDetector = new NoiseDetector(6000.0);

        // Detect noise!
        boolean[] decisions = noiseDetector.detectArtefact(x);
        System.out.println(Arrays.toString(decisions));

    }

}