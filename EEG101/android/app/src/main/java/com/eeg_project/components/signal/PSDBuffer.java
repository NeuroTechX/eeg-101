package com.eeg_project.components.signal;

// This class implements a PSD-specific single channel buffer with methods
// such as noise marking in a joined buffer, and mean across epochs
public class PSDBuffer {

    // ------------------------------------------------------------------------
    // Variables

    private int bufferlength;
    private int nbBins;
    private int pts;
    private int index;
    private double[][] buffer;
    private boolean[] noiseBuffer;

    // ------------------------------------------------------------------------
    // Constructor

    public PSDBuffer(int bl, int nb) {
        this.bufferlength = bl;
        this.nbBins = nb;
        this.index = 0;
        this.pts = 0;
        this.buffer = new double[bl][nb];
        this.noiseBuffer = new boolean[bl];
    }

    // ------------------------------------------------------------------------
    // Methods

    // Updates the 2D buffer array with the 1D newData array at the current index. When index reaches the maximum bufferLength it returns to 0.
    public void update(double[] newData) {

            // loop through bins
            for(int j = 0; j < nbBins; j++) {
                buffer[index][j] = newData[j];
            }

        index = (index + 1) % this.bufferlength;
        pts++;
    }

    public double[] mean() {
        // Compute the mean of the buffer across epochs (1st dimension of `buffer`).

        double[] bufferMean = new double[nbBins];
        double nbPointsSummed = 0;

        for (int i = 0; i <  this.bufferlength; i++) {
                nbPointsSummed++;
                for (int n = 0; n <  this.nbBins; n++) {
                    bufferMean[n] += buffer[i][n];
                }
            }

        for (int n = 0; n <  nbBins; n++) {
            bufferMean[n] /= nbPointsSummed;
        }

        return bufferMean;
    }

    public void clear() {
        this.buffer = new double[this.bufferlength][this.nbBins];
        this.index = 0;
        this.pts = 0;
        this.noiseBuffer = new boolean[this.bufferlength];
    }
}