package com.eeg_project.components.EEGGraph;

import android.util.Log;
import android.view.View;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import javax.annotation.Nullable;

// GraphManager class manages EEGGraph objects.
public class GraphManager extends SimpleViewManager<EEGGraph> {
    private final static String REACT_CLASS = "EEG_GRAPH";
    int counter = 0;
    EEGGraph eegGraph;


    @Override
    // Used to reference this view type from js side
    public String getName() {
        return REACT_CLASS;
    }

    // Creates new EEGGraph views, accepting context as an argument. Context links the EEGGraph view to MainActivity
    @Override
    protected EEGGraph createViewInstance(ThemedReactContext context) {
        eegGraph = new EEGGraph(context);
        return eegGraph;
    }


    // Bridge function for visibility prop. View.VISIBILITY is a native property of Android views
    @ReactProp(name = "visibility")
    public void setVisibility(EEGGraph graph, @Nullable boolean isVisible) {
        if (isVisible){
            graph.setVisibility(View.VISIBLE);
        }
        else {
            graph.setVisibility(View.INVISIBLE);
        }
    }

    // Bridge function for channelOfInterestProp. Calls setChannelOfInterest in EEGGraph
    @ReactProp(name = "channelOfInterest")
    public void setChannelOfInterest(EEGGraph graph, @Nullable int channel) {
        graph.setChannelOfInterest(channel);
    }
    /*
    // Example receiveCommand declation for calling methods from JS to act on view
    public void receiveCommand(GraphManager root, int commandId, @Nullable ReadableArray args) {
        // If the command is related to closing down the graph upon moving to a new scene, clear
        //plot views from EEGgraph
        if (commandId == 1){
            eegGraph.stopThreads();
        }
    }
    */

    // Starts History Plot within EEGGraph views. Likely called everytime view is created or props are updated

    @Override
    protected void onAfterUpdateTransaction(EEGGraph view) {
        super.onAfterUpdateTransaction(view);
    }

}
