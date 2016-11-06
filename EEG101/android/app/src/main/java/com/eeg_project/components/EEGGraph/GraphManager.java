package com.eeg_project.components.EEGGraph;

import android.content.res.Resources;
import android.util.Log;
import android.view.View;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import javax.annotation.Nullable;


// GraphManager class manages EEGGraph objects.
public class GraphManager extends SimpleViewManager<EEGGraph> {
    private final static String REACT_CLASS = "EEG_GRAPH";
    int counter = 0;
    String graphType = "raw";
    EEGGraph eegGraph;


    @Override
    // Used to reference this view type from js side
    public String getName() {
        return REACT_CLASS;
    }

    // Creates new EEGGraph views, accepting context as an argument. Context links the EEGGraph view to MainActivity
    @Override
    public EEGGraph createViewInstance(ThemedReactContext context) {
        eegGraph = new EEGGraph(context);
        return eegGraph;
    }

    // Bridge function for graphTypeProp.
    // Does nothing now, but will eventually call setGraphType function in EEGGraph, determining which type of plot is added to the layout
    @ReactProp(name = "graphType")
    public void setGraphType(EEGGraph graph, @Nullable String type) {
            graphType = type;
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

    // Callback that will be triggered after all properties are updated in current update transaction
    //* (all @ReactProp handlers for properties updated in current transaction have been called)
    @Override
    protected void onAfterUpdateTransaction(EEGGraph view) {
        super.onAfterUpdateTransaction(view);
    }

}
