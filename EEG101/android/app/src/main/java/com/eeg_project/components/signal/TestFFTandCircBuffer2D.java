import java.util.Arrays; // For printing arrays when debugging

public class TestFFTandCircBuffer2D {

	public static double[][] generateFakeSignal(double duration, int nbCh, double fs) {

		int nbSamples =  (int)(duration*fs);
		double dt = 1./fs;

		// Create time vector
		double[] t = new double[nbSamples];
		for (int i = 0; i < nbSamples; i++) {
			t[i] = i*dt;
		}

		double amp0 = 10.0;
		double amp1 = 5.0;
		double amp2 = 1.0;
		double f0 = 1.0;
		double f1 = 20.0;
		double f2 = 60.0;

		// Make signal
		double[][] signal = new double[nbSamples][nbCh];
		for (int c = 0; c < nbCh; c++) {
			for (int i = 0; i < nbSamples; i++) {
				signal[i][c] = amp0*Math.sin(2*Math.PI*f0*t[i]) + 
							   amp1*Math.sin(2*Math.PI*f1*t[i]) + 
							   amp2*Math.sin(2*Math.PI*f2*t[i]);
			}
		}

		return signal;
	}

	public static void main(String[] args) {

		// 1. Create fake signal
		int nbCh = 4;
		double fs = 220.;
		double[][] fakeSignal = generateFakeSignal(30, nbCh, fs);

		// 2. Initialize raw signal buffer
		int rawBufferLength = 220;
		CircBuffer rawBuffer = new CircBuffer(rawBufferLength,nbCh);

		// 3. Initialize FFT transform
		int windowLength = (int)fs;
		int fftLength = 128; // Should be 256
		FFT fft = new FFT(windowLength, fftLength, fs);
		double[] f = fft.getFreqBins();

		// 4. Initialize FFT 2D buffer
 		int fftBufferLength = 20;
        int nbBins = f.length;
    	CircBuffer2D psdBuffer = new CircBuffer2D(fftBufferLength,nbCh,nbBins);

		// 5. Emulate data coming in at 10 Hz
		double[][] x;
		int step = (int)fs/10;

		double[][] logpower = new double[nbCh][nbBins];
		double[][] smoothLogPower = new double[nbCh][nbBins];

		for (int i = 0; i < fakeSignal.length; i++) {

			// Write new raw sample in buffer
			rawBuffer.update(fakeSignal[i]);

			// Process data if `step` samples have passed
			if (rawBuffer.getPts() > step) {
				rawBuffer.resetPts();

				// Extract latest raw samples
				x = rawBuffer.extractTransposed(windowLength);

				// Compute log-PSD
				for (int c = 0; c < nbCh; c++) {
					logpower[c] = fft.computeLogPSD(x[c]);
				}

				// Write new log-PSD in buffer
				psdBuffer.update(logpower);

				// Compute average PSD over buffer
				smoothLogPower = psdBuffer.mean();

				System.out.println(Arrays.toString(logpower[0]));

				// Plot PSD!
				// AndroidSuperPlot(smoothLogPower);
			}

		}


	}
} 