package com.eeg_project.components.signal;

import org.apache.commons.lang3.ArrayUtils;

import java.util.Arrays; // For printing arrays when debugging

public class BandPowerExtractor {
    // This class allows to extract mean band powers from a PSD
    // array.
    //
    // More band definitions (sigma, gamma, etc.) can be added
    // by defining them in the constructor.

    private double[] f;
    private int nbBands = 4;
    private int[][] bandInd = new int[nbBands][];

    public BandPowerExtractor(double[] freqList) {

        f = freqList;

        // Define band power indices
        bandInd[0] = find(f, 0.1, 4); // delta
        bandInd[1] = find(f, 4, 8);   // theta
        bandInd[2] = find(f, 8, 13);  // alpha
        bandInd[3] = find(f, 13, 30); // beta

    }

    public double[] extract(double[] psd) {
        // Extract mean power in each band

        double[] bandMean = new double[nbBands];

        for (int b = 0; b < nbBands; b++) { // Iterate over bands
            for (int i = 0; i < bandInd[b].length; i++) { // Iterate over band indices
                bandMean[b] += psd[bandInd[b][i]];
            }
            bandMean[b] /= bandInd[b].length;
        }

        return bandMean;

    }

    public double[][] extract2D(double[][] psd) {
        // Extract mean power in each band for each channel in `psd`.
        // `psd` must be [nbCh,nbBins]
        // Results are returned in 2D [nbCh][nbBands]

        double[][] bandMeans = new double[psd.length][nbBands];

        for (int c = 0; c < psd.length; c++) {
            bandMeans[c] = extract(psd[c]);
        }

        return bandMeans;
    }

    public double[] extract1D(double[][] psd) {
        // Extract mean power in each band for each channel in `psd`.
        // `psd` must be [nbCh,nbBins]
        // Results are returned in 1D for Classifier [nbCh * nbBands]

        double[] bandMeans = new double[0];

        for (int i = 0; i < psd.length; i++) {
            bandMeans = ArrayUtils.addAll(bandMeans, extract(psd[i]));
        }

        return bandMeans;
    }

    public int getNbBands() {
        return nbBands;
    }

    private int[] find(double[] x, double x1, double x2) {
        // Return indices where x1 <= x <= x2

        int[] ind = new int[x.length];
        int nbInd = 0; // points to last saved index in `ind`

        for (int i = 0; i < x.length; i++) {
            if (x[i] >= x1 && x[i] <= x2) {
                ind[nbInd++] = i;
            }
        }

        // Remove useless trailing zeros
        int[] indFinal = new int[nbInd];
        for (int i = 0; i < nbInd; i++) {
            indFinal[i] = ind[i];
        }

        return indFinal;

    }

    public static void main(String[] args) {

        // Create frequency bins array
        int nbBins = 129;
        double df = 220.0/256.0;
        double[] f = new double[nbBins];
        for (int i = 0; i < nbBins; i++) {
            f[i] = i*df;
        }
        System.out.println(Arrays.toString(f));

        // Initialize band power extractor
        BandPowerExtractor bpExtractor = new BandPowerExtractor(f);
        System.out.println(Arrays.deepToString(bpExtractor.bandInd));

        // Extract band powers from fake PSD
        double[] fakePSD = f;
        double[] bandMeans = bpExtractor.extract(fakePSD);
        System.out.println(Arrays.toString(bandMeans));

    }
}