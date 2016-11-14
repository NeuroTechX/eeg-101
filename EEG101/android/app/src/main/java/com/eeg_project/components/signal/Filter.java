package com.eeg_project.components.signal;

import java.util.Arrays; // For printing arrays when debugging

public class Filter {

    private int filterType;
    private double fs;
    private double[] coeffB;
    private double[] coeffA;
    private int nB;
    private int nA;

    // TODO: Make filters on the fly

    public Filter(double samplingFrequency, int inputFilterType) {

        filterType = inputFilterType;

        if (filterType == 0) { // Alpha bandpass
            // coeffB = {};
            // coeffA = {};
        } else if (filterType == 1) { // 2-36 Hz bandpass
            // These coefficients were generated with scipy's `signal.butter` function for fs=220
            coeffB = new double[]{0.0078257670268340635832959861772906151600182056427001953125000000, 0.0000000000000000000000000000000000000000000000000000000000000000, -0.0391288351341703144470329789328388869762420654296875000000000000, 0.0000000000000000000000000000000000000000000000000000000000000000, 0.0782576702683406288940659578656777739524841308593750000000000000, 0.0000000000000000000000000000000000000000000000000000000000000000, -0.0782576702683406288940659578656777739524841308593750000000000000, 0.0000000000000000000000000000000000000000000000000000000000000000, 0.0391288351341703144470329789328388869762420654296875000000000000, 0.0000000000000000000000000000000000000000000000000000000000000000, -0.0078257670268340635832959861772906151600182056427001953125000000};
            coeffA = new double[]{1.0000000000000000000000000000000000000000000000000000000000000000, -6.6668777100381477751511738460976630449295043945312500000000000000, 20.102068981754037224618514301255345344543457031250000000000000000, -36.3714748273075940687704132869839668273925781250000000000000000000, 44.0208829591519616997175035066902637481689453125000000000000000000, -37.3825112968389277057212893851101398468017578125000000000000000000, 22.5663716670588918589146487647667527198791503906250000000000000000, -9.5478386288525811664840148296207189559936523437500000000000000000, 2.7081430610461021402102232968900352716445922851562500000000000000, -0.4653152296484516781127638296311488375067710876464843750000000000, 0.0365512213384927495130050090210716007277369499206542968750000000};
        } else {
            System.out.println("Filter type not recognized!");
        }

        nB = coeffB.length;
        nA = coeffA.length;

    }

    public double[] transform(double[][] x, double[][] y) {

        int nbCh = x[0].length;
        double[] filtSum = new double[nbCh];

        // Filter channel by channel, and sample by sample
        for (int c = 0; c < x[0].length; c++) {
            filtSum[c] = coeffB[0]*x[nB-1][c];
            for (int i = 1; i < nB; i++) {
                filtSum[c] += coeffB[i]*x[nB-i-1][c] - coeffA[i]*y[nA-i-1][c];
            }
            filtSum[c] /= coeffA[0];
        }

        return filtSum;

    }

    public int getNB() {
        return nB;
    }

    public int getNA() {
        return nA;
    }

    public static void main (String[] args) {

        // Initialize filter
        Filter bandpassFilt = new Filter(220., 1);
        System.out.println(Arrays.toString(bandpassFilt.coeffB));

        // Initialize array to filter
        int nbCh = 4;
        double[][] x = new double[bandpassFilt.nB][nbCh];
        for(int c = 0; c < nbCh; c++) {
            for(int i = 0; i < bandpassFilt.nB-5; i++) {
                x[i][c] = 20.0;
            }
        }
        double[][] y = new double[bandpassFilt.nA-1][nbCh];

        // Filter array and print results
        double[] filtResult = bandpassFilt.transform(x, y);
        System.out.println(Arrays.toString(filtResult));

    }
}