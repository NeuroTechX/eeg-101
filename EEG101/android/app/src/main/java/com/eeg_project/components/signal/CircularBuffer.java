package com.eeg_project.components.signal;
import java.util.Arrays; // For printing arrays when debugging

// A pure Java implementation of a circular buffer
public class CircularBuffer {

    // ------------------------------------------------------------------------
    // Variables
    private int bufferLength;
    private int nbCh;
    private int index;
    private int pts;
    private double[][] buffer;

    // ------------------------------------------------------------------------
    // Constructor
    public CircularBuffer(int n, int m) {
        bufferLength = n;
        nbCh = m;
        index = 0;
        pts = 0;
        buffer = new double[bufferLength][nbCh];
    }

    // ------------------------------------------------------------------------
    // Methods
    public void update(double[] newData) {

        if (newData.length == nbCh) {
            buffer[index] = newData;
            index++;
            pts++;
            if (index >= bufferLength) { index = 0;}
        } else {
            System.out.println("All channels must be updated at once.");
        }
    }

    // Extracts an array containing the last nbSamples from the buffer. If the loop that fills the extracted samples encounters the beginning of the buffer, it will begin to take samples from the end of the buffer
    public double[][] extract(int nbSamples) {

        int extractIndex;
        double[][] extractedArray = new double[nbSamples][nbCh];

        for(int i = 0; i < nbSamples; i++) {
            extractIndex = mod(index - nbSamples + i, bufferLength);
            extractedArray[i] = buffer[extractIndex];
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


}