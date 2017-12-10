package com.eeg_project.components.classifier;

import android.util.Log;

import com.eeg_project.components.signal.CircularBuffer;

import java.util.ArrayList;

/**
 * A circular buffer that can register listeners to be sent epochs of data at a given interval
 */

public class EpochBuffer extends CircularBuffer {

    private int epochInterval;
    private ArrayList<BufferListener> listeners = new ArrayList<BufferListener>();

    // ------------------------------------------------------------------------
    // Constructor

    public EpochBuffer(int bufferLength, int nChannels, int interval) {
        super(bufferLength, nChannels);
        epochInterval = interval;
    }

    public void addListener(BufferListener listener) {
        listeners.add(listener);
    }

    @Override
    public void update(double[] newData) {

        for(int i = 0; i < nbCh; i++) {
            buffer[index][i] = newData[i];
        }
        index = (index + 1) % bufferLength;
        if (index % epochInterval == 0) {
            try {
                for (BufferListener listener : listeners) {
                    listener.getEpoch(extractTransposed(bufferLength));
                }
            } catch (Exception e) {
                Log.w("Buffer", e);
            }
        }
        pts++;
    }

}
