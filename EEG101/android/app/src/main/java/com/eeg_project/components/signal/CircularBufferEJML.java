package com.eeg_project.components.signal;

import android.util.Log;

import com.google.common.collect.Range;

import org.ejml.data.DenseMatrix64F;
import org.ejml.simple.SimpleMatrix;
import java.util.Arrays;

import org.ejml.data.DenseMatrix64F;
import org.ejml.ops.CommonOps;
import java.util.Arrays; // For printing arrays when debugging


public class CircularBufferEJML {

    // ----------------------------------------------------------------------
    // Variables

    private int bufferLength;
    private int nbCh;
    private int index;
    private int pts;
    private DenseMatrix64F buffer;
    private double[][] newData2D;
    private int[] colsIndices;

    // ----------------------------------------------------------------------
    // Constructor

    public CircularBufferEJML(int n, int m) {
        bufferLength = n;
        nbCh = m;
        index = 0;
        pts = 0;
        buffer = new DenseMatrix64F(bufferLength,nbCh);
        newData2D = new double[1][nbCh]; // used for updating with EJML

        colsIndices = new int[nbCh];
        for(int i = 0; i < nbCh; i++) {
            colsIndices[i] = i; // used for extracting rows with EJML
        }
    }

    // ----------------------------------------------------------------------
    // Methods

    // Adds newData array to current index in circular buffer. When buffer is full, index is reset
    public void update(double[] newData) {

        if (newData.length == nbCh) {
            newData2D[0] = newData;
            CommonOps.insert(new DenseMatrix64F(newData2D),buffer,index,0);

            index++;
            pts++;
            if (index >= bufferLength) { index = 0;}

        } else {
            System.out.println("All channels must be updated at once.");
        }
    }

    // Adds SimpleMatrix data to buffer at current index location. When buffer is full, index is reset
    /*
    public void update(SimpleMatrix newData) {
        try {
            buffer.insertIntoThis(index, 0, newData);
        } catch (IllegalArgumentException e) { Log.w("EEG101", "newData out of bounds of buffer"); }
        index = index + newData.numRows();
        pts = pts + newData.numRows();
        if (index >= buffer.numRows) { index = 0;}
    }
*/
    public DenseMatrix64F extract(int nbSamples) {

        // Get indices to extract
        int[] indicesToExtract = new int[nbSamples];
        for(int i = 0; i < nbSamples; i++) {
            indicesToExtract[i] = mod(index - nbSamples + i, bufferLength);
        }

        // Extract from matrix
        DenseMatrix64F extractedArray = new DenseMatrix64F(nbSamples,nbCh);
        CommonOps.extract(buffer,indicesToExtract,nbSamples,colsIndices,nbCh,extractedArray);

        return extractedArray;
    }

    public void resetPts() {
        pts = 0;
    }

    public void print() {
        buffer.print();
    }

    private int mod(int a, int b) {
        // Modulo operation that always return a positive number
        int c = a % b;
        return (c < 0) ? c + b : c;
    }


}
