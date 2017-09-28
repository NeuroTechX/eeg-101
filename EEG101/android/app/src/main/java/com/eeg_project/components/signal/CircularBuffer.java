package com.eeg_project.components.signal;

import java.util.Arrays; // For printing arrays when debugging

// A pure Java implementation of a circular buffer
public class CircularBuffer {

    // ------------------------------------------------------------------------
    // Variables

    protected int bufferLength;
    protected int nbCh;
    protected int index;
    protected int pts;
    protected double[][] buffer;

    // ------------------------------------------------------------------------
    // Constructor

    public CircularBuffer(int bufferLength, int nChannels) {
        this.bufferLength = bufferLength;
        this.nbCh = nChannels;
        index = 0;
        pts = 0;
        buffer = new double[bufferLength][nbCh];
    }

    // ------------------------------------------------------------------------
    // Methods

    // Updates the 2D buffer array with the 1D newData array at the current index.
    // When index reaches the bufferLength it returns to 0.
    public void update(double[] newData) {
        for(int i = 0; i < nbCh; i++) {
            buffer[index][i] = newData[i];
        }
        index = (index + 1) % bufferLength;
        pts++;
    }

    // Extracts an array containing the last nbSamples from the buffer. If the loop that fills the extracted samples encounters the beginning of the buffer, it will begin to take samples from the end of the buffer
    public double[][] extract(int nbSamples) {
        int extractIndex;
        double[][] extractedArray = new double[nbSamples][nbCh];

        for(int i = 0; i < nbSamples; i++) {
            extractIndex = mod(index - nbSamples + i, bufferLength);
            for(int j = 0; j < nbCh; j++) {
                extractedArray[i][j] = buffer[extractIndex][j];
            }
        }

        return extractedArray;
    }

    public double[][] extractTransposed(int nbSamples) {
        // Return an array containing the last `nbSamples` collected in
        // the circular buffer.
        //
        // The shape of the returned array is [nbCh, nbSamples].
        //
        // This transposed version is useful to avoid additional looping
        // through the returned array when computing FFT (the looping is
        // instead done here.)
        //
        // TODO: find more efficient way to do that (use EJML?)

        int extractIndex;
        double[][] extractedArray = new double[nbCh][nbSamples];

        for (int c = 0; c < nbCh; c++) {
            for(int i = 0; i < nbSamples; i++) {
                extractIndex = mod(index - nbSamples + i, bufferLength);
                extractedArray[c][i] = buffer[extractIndex][c];
            }
        }

        return extractedArray;
    }

    public double[] extractSingleChannelTransposed(int nbSamples, int channelofinterest) {
        // Return an array containing the last `nbSamples` collected in
        // the circular buffer.
        //
        // The shape of the returned array is [nbSamples].
        //
        // This transposed version is useful to avoid additional looping
        // through the returned array when computing FFT (the looping is
        // instead done here.)

        int extractIndex;
        double[] extractedArray = new double[nbSamples];

        for(int i = 0; i < nbSamples; i++) {
            extractIndex = mod(index - nbSamples + i, bufferLength);
            extractedArray[i] = buffer[extractIndex][channelofinterest];
        }

        return extractedArray;
    }

    public Double[] extractSingleChannelTransposedAsDouble(int nbSamples, int channelofinterest) {
        // Return an array containing the last `nbSamples` collected in
        // the circular buffer.
        //
        // The shape of the returned array is [nbSamples].
        //
        // This transposed version is useful to avoid additional looping
        // through the returned array when computing FFT (the looping is
        // instead done here.)

        int extractIndex;
        Double[] extractedArray = new Double[nbSamples];

        for(int i = 0; i < nbSamples; i++) {
            extractIndex = mod(index - nbSamples + i, bufferLength);
            extractedArray[i] = buffer[extractIndex][channelofinterest];
        }

        return extractedArray;
    }

    public int getPts() { return pts; }

    public void resetPts() {
        pts = 0;
    }

    public void print() {
        System.out.println(Arrays.deepToString(buffer));
    }

    public int getIndex() { return index; }

    private int mod(int a, int b) {
        // Modulo operation that always return a positive number
        int c = a % b;
        return (c < 0) ? c + b : c;
    }

    public void clear() {
        this.buffer = new double[this.bufferLength][this.nbCh];
        this.index = 0;
        this.pts = 0;
    }

}
