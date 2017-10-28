package com.eeg_project.components.signal;

import biz.source_code.dsp.filter.FilterPassType;
import biz.source_code.dsp.filter.FilterCharacteristicsType;
import biz.source_code.dsp.filter.IirFilterCoefficients;
import biz.source_code.dsp.filter.IirFilterDesignFisher;

// import java.util.Arrays; // For printing arrays when debugging

// Implements Butterworth filter coefficient generation and filter with DSP library
public class Filter {

    // ------------------------------------------------------------------------
    // Variables

    private static FilterPassType filterPassType;
    private static FilterCharacteristicsType filterCharacteristicsType;
    private static IirFilterCoefficients coeffs;
    private final int filterOrder;
    private final double samplingFrequency;
    private double[] b;
    private double[] a;
    private int nB;
    private int nA;

    // ------------------------------------------------------------------------
    // Constructor

    public Filter(double samplingFrequency, String filterType, int filterOrder, double fc1, double
            fc2) {
        // samplingRate = sampling frequency of EEG (220hz or 256hz for Muse)
        // filterType = lowpass, highpass, bandstop, or bandpass
        // filterOrder = filter order corresponding to degree of approximating polynomial. Higher order might increase ripples
        // fc1 = primary cut-off frequency for lowpass/highpass. Low cut-off for bandstop or bandpass
        // fc2 = high cut-off frequency for bandstop/bandpass. Ignored for low/high pass

        filterCharacteristicsType = FilterCharacteristicsType.butterworth;

        if (filterType.contains("lowpass")) {
            filterPassType = FilterPassType.lowpass;

        } else if (filterType.contains("highpass")) {
            filterPassType = FilterPassType.highpass;

        } else if (filterType.contains("bandstop")) {
            filterPassType = FilterPassType.bandstop;
        
        } else if (filterType.contains("bandpass")) {
            filterPassType = FilterPassType.bandpass;

        } else {
            throw new RuntimeException("Filter type not recognized.");
        }

        this.filterOrder = filterOrder;
        this.samplingFrequency = samplingFrequency;

        coeffs = IirFilterDesignFisher.design(filterPassType, filterCharacteristicsType, filterOrder, 0., fc1/samplingFrequency, fc2/samplingFrequency);

        b = coeffs.b;
        a = coeffs.a;

        nB = b.length;
        nA = a.length;
    }

    // ---------------------------------------------------------------------
    // Methods

    public double[] transform(double x, double[] z) {
        // This function implements the Discrete Form II Transposed of
        // a linear filter.
        //
        // Args:
        //  x: the current sample to be filtered
        //  z: the internal state of the filter
        //
        // Returns:
        //  the updated internal state of the filter, with the new
        //  filtered value in the last position. This is a hack
        //  that allows to pass both the internal state and the
        //  output of the filter at once.
        z[z.length - 1] = 0;
        double y = b[0]*x + z[0];
        for (int i = 1; i < nB; i++) {
            z[i-1] = b[i]*x + z[i] - a[i]*y;
         }

        z[z.length - 1] = y;
        return z;

    }

    public double[][] transform(double[] x, double[][] z) {
        // This function implements the Discrete Form II Transposed of
        // a linear filter for multichannel signals
        //
        // Args:
        //  x: the current channel samples to be filtered
        //  z: the internal state of the filter for each channels [nbCh,nbPoints]
        //
        // Returns:
        //  the updated internal states of the filter, with the new
        //  filtered values in the last position. [nbCh,nbPoints]
        //  This is a hack that allows to pass both the internal state and the
        //  output of the filter at once.

        // double[] zNew = new double[z[0].length];

        for (int i = 0; i < 4; i++) {       // Careful!
            z[i] = transform(x[i],z[i]);
        }

        return z;
        
    }

    public static double[] extractFilteredSamples(double[][] z) {
        // Utility function to extract the filtered samples from the returned array
        // of transform()
        int len = z.length;
        double[] filtSignal = new double[len];     // TODO can this instantiation be avoided?
        for (int i = 0; i < len; i++) {
            filtSignal[i] = z[i][z[0].length - 1];
        }
        return filtSignal;
    }

    public static double extractFilteredSamples(double[] z) {
        // Utility function to extract last value from array
        return z[z.length - 1];
    }

    public int getNB() {
        return nB;
    }

    public int getNA() {
        return nA;
    }

    public void updateFilter(int fc1, int fc2){
        coeffs = IirFilterDesignFisher.design(filterPassType, filterCharacteristicsType, filterOrder, 0., fc1/samplingFrequency, fc2/samplingFrequency);

        b = coeffs.b;
        a = coeffs.a;

        nB = b.length;
        nA = a.length;
    }

}