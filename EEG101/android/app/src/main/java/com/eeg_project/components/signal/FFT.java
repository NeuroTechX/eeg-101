import org.jtransforms.fft.DoubleFFT_1D;
import java.lang.Math; // For log10
// import java.lang.arraycopy; 
import java.util.Arrays; // For printing arrays when debugging

public class FFT {
// This class uses the DoubleFFT_1D object from JTransforms to 
// compute the DFT of an array of fixed size.
//
// Args:
// 	inputLength (int) : length of the input signal (number of samples)
//  fftLength (int) : FFT length; if different than inputLength, the input 
//		will be zero-padded (larger) or truncated (smaller)
//  samplingFrequency (double) : sampling frequency of the input signal, in Hz.
//		used to define frequency bins
//
// The use of an encapsulated class (rather than using JTransforms
// directly in the Android graph code) is meant to simplify 
// interpretation of the code and allow an eventual custom
// FFT implementation.

	private int l;
	private int n;
	private int nbFftPoints;
	private boolean even;
	private boolean zeroPad = false;

	private double[] real;
	private double[] imag;
	private double[] logpower;
	private double[] Y;
	private double[] f;
	private double[] hammingWin;

	private double fs;
	private DoubleFFT_1D fft_1D;


	public FFT(int inputLength, int fftLength, double samplingFrequency) {

		// Parameters
		l = inputLength;
		n = fftLength;
		fs = samplingFrequency;

		// Find out if zero-padding or truncating is necessary
		if (n > l) { // zero-padding
			zeroPad = true;
		}

		// Compute the number of points in the FFT
		if (n % 2 == 0) {
			nbFftPoints = n/2;
			even = true;
		} else {
			nbFftPoints = (int)(n/2) + 1;
			even = false; 
		}

		// Initialize arrays to hold internal values
		Y = new double[n];
		real = new double[nbFftPoints];
		imag = new double[nbFftPoints];
		logpower = new double[nbFftPoints];

		// Initialize FFT transform
		fft_1D = new DoubleFFT_1D(n);

		// Define frequency bins
		f = new double[nbFftPoints];
		for (int i = 0; i < nbFftPoints; i++) {
			f[i] = fs*i/n;
		}

		// Initialize Hamming window
		hammingWin = hamming(l);

	}

	public double[] computeLogPSD(double[] x) {
		// Compute log10(PSD) of x
		// TODO: Improve efficiency by merging for loops

		if (x.length != l) {
			throw new IllegalArgumentException("Input has " + x.length + " elements instead of " + l + ".");
		}

		if (zeroPad) {
			Y = new double[n]; // Re-initialize to have zeros at the end
		}

		// Compute mean of the window
		double winMean = 0;
		for (int i = 0; i < l; i++) {
			winMean += x[i];
		}
		winMean /= l;

		// De-mean and apply Hamming window
		for (int i = 0; i < Math.min(l,n); i++) {
			Y[i] = hammingWin[i]*(x[i] - winMean);
		}

		// Compute DFT
		fft_1D.realForward(Y);

		// Get real and imaginary parts
		for (int i = 0; i < nbFftPoints-1; i++) {
			real[i] = Y[2*i];
			imag[i] = Y[2*i + 1];
		}
		imag[0] = 0;

		// Get first and/or last points depending on length of FFT (Specific to JTransforms library)
		if (even) {
			real[nbFftPoints-1] = Y[1];
		} else {
			imag[nbFftPoints-1] = Y[1];
			real[nbFftPoints-1] = Y[n-1];
		}

		// Compute log-power
		for (int i = 0; i < nbFftPoints; i++) {
			logpower[i] = Math.log10(real[i]*real[i] + imag[i]*imag[i]); // log squared complex magnitude
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