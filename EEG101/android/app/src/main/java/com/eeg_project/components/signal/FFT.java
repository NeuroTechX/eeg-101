package com.eeg_project.components.signal;

import android.util.Log;

import org.jtransforms.fft.DoubleFFT_1D;
import java.lang.Math; // For log10
import java.util.Arrays; // For printing arrays when debugging

/*
This class uses the DoubleFFT_1D object from JTransforms to
compute the DFT of an array of fixed size.

Args:
inputLength (int) : length of the input signal (number of samples)
fftLength (int) : FFT length; if different than inputLength, the input
will be zero-padded (larger) or truncated (smaller)
samplingFrequency (double) : sampling frequency of the input signal, in Hz.
used to define frequency bins

The use of an encapsulated class (rather than using JTransforms
directly in the Android graph code) is meant to simplify
interpretation of the code and allow an eventual custom
FFT implementation.
*/
public class FFT {

	// ------------------------------------------------------------------------
	// Variables

	private int inputLength;
	private int fftLength;
	private int nbFFTPoints;
	private boolean even;
	private boolean zeroPad = false;
	private double[] real;
	private double[] imag;
	private double[] logpower;
	private double[] Y;
	private double[] f;
	private double[] hammingWin;
	private double[] complexMagnitude;
	private double samplingFrequency;
	private DoubleFFT_1D fft_1D;

	// ------------------------------------------------------------------------
	// Constructor

	public FFT(int inputLength, int fftLength, double samplingFrequency) {

		// Parameters
		this.inputLength = inputLength;
		this.fftLength = fftLength;
		this.samplingFrequency = samplingFrequency;

		// Find out if zero-padding or truncating is necessary
		if (this.fftLength > this.inputLength) { // zero-padding
			zeroPad = true;
		}

		// Compute the number of points in the FFT
		if (this.fftLength % 2 == 0) {
			nbFFTPoints = this.fftLength /2;
			even = true;
		} else {
			nbFFTPoints = (int)(this.fftLength /2) + 1;
			even = false; 
		}

		// Initialize arrays to hold internal values
		Y = new double[this.fftLength];
		real = new double[nbFFTPoints];
		imag = new double[nbFFTPoints];
		logpower = new double[nbFFTPoints];
		complexMagnitude = new double[nbFFTPoints];


		// Initialize FFT transform
		fft_1D = new DoubleFFT_1D(this.fftLength);

		// Define frequency bins
		f = new double[nbFFTPoints];
		for (int i = 0; i < nbFFTPoints; i++) {
			f[i] = this.samplingFrequency * i / this.fftLength;
		}

		// Initialize Hamming window
		hammingWin = hamming(this.inputLength);
	}

	// ------------------------------------------------------------------------
	// Methods

	public double[] computePSD(double[] x) {
		// Compute PSD of x
		// TODO: Improve efficiency by merging for loops

		if (x.length != inputLength) {
			throw new IllegalArgumentException("Input has " + x.length + " elements instead of " + inputLength + ".");
		}

		if (zeroPad) {
			Y = new double[fftLength]; // Re-initialize to have zeros at the end
		}

		// Compute mean of the window
		double winMean = 0;
		for (int i = 0; i < inputLength; i++) {
			winMean += x[i];
		}
		winMean /= inputLength;

		// De-mean and apply Hamming window
		for (int i = 0; i < Math.min(inputLength, fftLength); i++) {
			Y[i] = hammingWin[i]*(x[i] - winMean);
		}

		// Compute DFT
		fft_1D.realForward(Y);

		// Get real and imaginary parts
		for (int i = 0; i < nbFFTPoints -1; i++) {
			real[i] = Y[2*i];
			imag[i] = Y[2*i + 1];
		}
		imag[0] = 0;

		// Get first and/or last points depending on length of FFT (Specific to JTransforms library)
		if (even) {
			real[nbFFTPoints -1] = Y[1];
		} else {
			imag[nbFFTPoints -1] = Y[1];
			real[nbFFTPoints -1] = Y[fftLength -1];
		}

		// Compute complex number?
		for (int i = 0; i < nbFFTPoints; i++) {
			complexMagnitude[i] = real[i]*real[i] + imag[i]*imag[i]; // log squared
			// complex magnitude
		}
		return complexMagnitude;
	}

	public double[] computeLogPSD(double[] x) {
		// Compute log10(PSD) of x
		// TODO: Improve efficiency by merging for loops

		//Log.w("computingPSD", "received " + Arrays.toString(x));

		if (x.length != inputLength) {
			throw new IllegalArgumentException("Input has " + x.length + " elements instead of " + inputLength + ".");
		}

		if (zeroPad) {
			Y = new double[fftLength]; // Re-initialize to have zeros at the end
		}

		// Compute mean of the window
		double winMean = 0;
		for (int i = 0; i < inputLength; i++) {
			winMean += x[i];
		}
		winMean /= inputLength;

		// De-mean and apply Hamming window
		for (int i = 0; i < Math.min(inputLength, fftLength); i++) {
			Y[i] = hammingWin[i]*(x[i] - winMean);
		}

		// Compute DFT
		fft_1D.realForward(Y);

		// Get real and imaginary parts
		for (int i = 0; i < nbFFTPoints -1; i++) {
			real[i] = Y[2*i];
			imag[i] = Y[2*i + 1];
		}
		imag[0] = 0;

		// Get first and/or last points depending on length of FFT (Specific to JTransforms library)
		if (even) {
			real[nbFFTPoints -1] = Y[1];
		} else {
			imag[nbFFTPoints -1] = Y[1];
			real[nbFFTPoints -1] = Y[fftLength -1];
		}

		// Compute log-power
		for (int i = 0; i < nbFFTPoints; i++) {
			logpower[i] = Math.log10(real[i]*real[i] + imag[i]*imag[i]); // log squared
			// complex magnitude
		}
		return logpower;
	}
 
	private double[] hamming(int L) {
		// Compute Hamming window coefficients.
		//
		// See [http://www.mathworks.com/help/signal/ref/hamming.html]

		double[] w = new double[L];
		for (int n = 0; n < L; n++) {
			w[n] = 0.54 - 0.46*Math.cos(2*Math.PI*n/(L-1));
		}

		return w;
	}

	public double[] getFreqBins() {
		return f;
	}

	// Example main for testing and using this FFT class
	public static void main(String[] args) {

		int inputLength = 16;
		int fftLength = 32;
		double fs = 16.0;

		// Instantiate FFT object
		FFT fft = new FFT(inputLength, fftLength, fs);

		// Create fake time series of size `inputLength`
		double[] values = new double[inputLength];
		for (int i = 0; i < inputLength; i++) {
			values[i] = i;
		}	

		// Compute log PSD
		double[] logpower = fft.computeLogPSD(values);

		// Print values
		System.out.println(Arrays.toString(logpower));
		System.out.println(Arrays.toString(fft.getFreqBins()));

	}

}