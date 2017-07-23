package com.eeg_project.components.signal;
import java.util.Arrays; // For printing arrays when debugging

// This class implements a circular (or ring) buffer to hold
// the most recent values of a 2D time series efficiently.
public class CircBuffer2D {

    // -----------------------------------------------------------------------
    // Variables

    protected int bufferLength;
    protected int nbCh;
    protected int nbBins;
    protected int index;
    protected int pts;
    protected double[][][] buffer;

    // -----------------------------------------------------------------------
    // Constructor

    public CircBuffer2D(int n, int m, int l) {

        bufferLength = n;
        nbCh = m;
        nbBins = l;
        index = 0;
        pts = 0;
        buffer = new double[bufferLength][nbCh][nbBins];
    }

    // -----------------------------------------------------------------------
    // Methods

    // Updates the 3D buffer array with the 2D newData array at the current index. When index reaches the maximum samplingRate it returns to 0.
    public void update(double[][] newData) {

        // loop through channels
        for(int i = 0; i < nbCh; i++) {
            // loop through bins
            for(int j = 0; j < nbBins; j++) {
                buffer[index][i][j] = newData[i][j];
            }
        }
        index = (index + 1) % bufferLength;
        pts++;
    }

    public double[][][] extract(int nbSamples) {

        int extractIndex;
        double[][][] extractedArray = new double[nbSamples][nbCh][nbBins];

        for(int i = 0; i < nbSamples; i++) {
            extractIndex = mod(index - nbSamples + i, bufferLength);
            extractedArray[i] = buffer[extractIndex];
        }

        return extractedArray;
    }

    public int getPts() {
        return pts;
    }

    public void resetPts() {
        pts = 0;
    }

    public void print() {
        System.out.println(Arrays.deepToString(buffer));
    }

    private int mod(int a, int b) {
        // Modulo operation that always return a positive number
        int c = a % b;
        return (c < 0) ? c + b : c;
    }

    // Main with example code for testing and using this class
    public static void main(String[] args ) {

        // Create test buffer
        int testBufferLength = 5;
        int testNbCh = 4;
        int testNbBins = 3;
        CircBuffer2D testBuffer = new CircBuffer2D(testBufferLength,testNbCh,testNbBins);

        // Update buffer a few times with fake data
        double[][] fakeSamples = new double[][]{{0,1,2}, {3,4,5}, {6,7,8}, {9,10,11}};
        int nbUpdates = 3;
        for(int i = 0; i < nbUpdates; i++){
            testBuffer.update(fakeSamples);
        }

        // Print buffer
        testBuffer.print();

        // Extract latest samples from buffer
        double[][][] testExtractedArray = testBuffer.extract(4);
        System.out.println(Arrays.deepToString(testExtractedArray));

        // Reset number of collected points
        testBuffer.resetPts();

    }

}