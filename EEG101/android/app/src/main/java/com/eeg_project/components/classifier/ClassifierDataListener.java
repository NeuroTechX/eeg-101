package com.eeg_project.components.classifier;

import com.choosemuse.libmuse.Eeg;
import com.choosemuse.libmuse.Muse;
import com.choosemuse.libmuse.MuseArtifactPacket;
import com.choosemuse.libmuse.MuseDataListener;
import com.choosemuse.libmuse.MuseDataPacket;
import com.eeg_project.MainApplication;
import com.eeg_project.components.signal.CircularBuffer;
import com.eeg_project.components.signal.Filter;

/**
 * Simple Muse Listener that processes data with a bandstop filter at 60hz (if Muse 2016)
 * Fills up a circularBuffer with fully sampled EEG data
 * Data is shared with parent class (i.e. ClassifierModule) through bound reference to CircularBuffer passed in constructor
 */

public class ClassifierDataListener extends MuseDataListener {

    // ------------------------------------------
    // Variables
    double[] newData;
    boolean filterOn;
    public Filter bandstopFilter;
    public double[][] bandstopFiltState;
    CircularBuffer eegBuffer;

    // grab reference to global Muse
    MainApplication appState;

    // if connected Muse is a 2016 BLE version, init a bandstop filter to remove 60hz noise
    ClassifierDataListener(CircularBuffer buffer) {
        if (appState.connectedMuse.isLowEnergy()) {
            filterOn = true;
            bandstopFilter = new Filter(256, "bandstop", 5, 55, 65);
            bandstopFiltState = new double[4][bandstopFilter.getNB()];
        }
        this.eegBuffer = buffer;
        newData = new double[4];
    }

    // Updates eegBuffer with new data from all 4 channels. Bandstop filter for 2016 Muse
    @Override
    public void receiveMuseDataPacket(final MuseDataPacket p, final Muse muse) {
        getEegChannelValues(newData, p);

        if (filterOn) {
            bandstopFiltState = bandstopFilter.transform(newData, bandstopFiltState);
            newData = bandstopFilter.extractFilteredSamples(bandstopFiltState);
        }

        eegBuffer.update(newData);
    }

    // Updates newData array based on incoming EEG channel values
    private void getEegChannelValues(double[] newData, MuseDataPacket p) {
        newData[0] = p.getEegChannelValue(Eeg.EEG1);
        newData[1] = p.getEegChannelValue(Eeg.EEG2);
        newData[2] = p.getEegChannelValue(Eeg.EEG3);
        newData[3] = p.getEegChannelValue(Eeg.EEG4);
    }

    @Override
    public void receiveMuseArtifactPacket(final MuseArtifactPacket p, final Muse muse) {
        // Does nothing for now
    }
}

