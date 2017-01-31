package com.eeg_project.components.managers;

import android.view.View;

import com.eeg_project.components.graphs.PSDGraph;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import javax.annotation.Nullable;

/**
 * Created by dano on 26/11/16.
 */

public class PSDGraphManager extends SimpleViewManager<PSDGraph> {
    private final static String REACT_CLASS = "PSD_GRAPH";
    String graphType = "psd";
    PSDGraph psdGraph;

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    // Creates new EEGGraph views, accepting context as an argument. Context links the EEGGraph view to MainActivity
    @Override
    public PSDGraph createViewInstance(ThemedReactContext context) {
        psdGraph = new PSDGraph(context);
        return psdGraph;
    }

    // Bridge function for visibility prop. View.VISIBILITY is a native property of Android views
    @ReactProp(name = "visibility")
    public void setVisibility(PSDGraph graph, @Nullable boolean isVisible) {
        if (isVisible){
            graph.setVisibility(View.VISIBLE);
        }
        else {
            graph.setVisibility(View.INVISIBLE);
        }
    }

    // Bridge function for channelOfInterestProp. Calls setChannelOfInterest in EEGGraph
    @ReactProp(name = "channelOfInterest")
    public void setChannelOfInterest(PSDGraph graph, @Nullable int channel) {
        graph.setChannelOfInterest(channel);
    }
}

