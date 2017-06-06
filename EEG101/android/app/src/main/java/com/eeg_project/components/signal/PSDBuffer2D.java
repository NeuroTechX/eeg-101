package com.eeg_project.components.signal;
import java.util.Arrays; // For printing arrays when debugging

public class PSDBuffer2D extends CircBuffer2D {
    // This class extends CircBuffer2D to expose PSD-specific methods
    // such as noise marking in a joined buffer, and mean across epochs

    private boolean[][] noiseBuffer;

    public PSDBuffer2D(int n, int m, int l) {
        super(n,m,l);
        noiseBuffer = new boolean[bufferLength][nbCh];

    }

    public void update(double[][] newData, boolean[] noise) {
        noiseBuffer[index] = noise; // update noise detection
        super.update(newData);

    }

    public void update(double[][] newData) {
        this.update(newData, new boolean[nbCh]);

    }

    public double[][] mean() {
        // Compute the mean of the buffer across epochs (1st dimension of `buffer`).

        double[][] bufferMean = new double[nbCh][nbBins];
        double[] nbPointsSummed = new double[nbCh];

        for (int i = 0; i <  bufferLength; i++) {
            for (int c = 0; c <  nbCh; c++) {
                nbPointsSummed[c]++;
                for (int n = 0; n <  nbBins; n++) {
                    bufferMean[c][n] += buffer[i][c][n];
                }
            }
        }

        for (int c = 0; c <  nbCh; c++) {
            for (int n = 0; n <  nbBins; n++) {
                bufferMean[c][n] /= nbPointsSummed[c];
            }
        }

        return bufferMean;

    }

    public static void main(String[] args ) {

        // Create test buffer
        int testBufferLength = 5;
        int testNbCh = 4;
        int testNbBins = 3;
        PSDBuffer2D testBuffer = new PSDBuffer2D(testBufferLength,testNbCh,testNbBins);

        // Update buffer a few times with fake data
        double[][] fakeSamples = new double[][]{{0,1,2}, {3,4,5}, {6,7,8}, {9,10,11}};
        int nbUpdates = 3;
        for(int i = 0; i < nbUpdates; i++){
            testBuffer.update(fakeSamples);
        }

        // Update with specific noise detection
        testBuffer.update(fakeSamples, new boolean[]{true,false,true,false});
        System.out.println(Arrays.deepToString(testBuffer.noiseBuffer));

        // Print buffer
        testBuffer.print();

        // Extract latest samples from buffer
        double[][][] testExtractedArray = testBuffer.extract(4);
        System.out.println(Arrays.deepToString(testExtractedArray));

        // Reset number of collected points
        testBuffer.resetPts();

        // Print mean of buffer
        double[][] bufferMean = testBuffer.mean();
        System.out.println(Arrays.deepToString(bufferMean));

        System.out.println(fakeSamples[0]);
    }

}