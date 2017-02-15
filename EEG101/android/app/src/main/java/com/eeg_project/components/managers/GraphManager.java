package com.eeg_project.components.managers;

import android.util.Log;
import android.view.View;

import com.eeg_project.components.graphs.EEGGraph;
import com.facebook.infer.annotation.Assertions;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

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
    @ReactProp(name = "visibility", defaultBoolean = false)
    public void setVisibility(EEGGraph graph, @Nullable boolean isVisible) {
        if (isVisible) {
            graph.setVisibility(View.VISIBLE);
        } else {
            graph.setVisibility(View.INVISIBLE);
        }
    }

    // Bridge function for channelOfInterestProp. Calls setChannelOfInterest in EEGGraph
    @ReactProp(name = "channelOfInterest")
    public void setChannelOfInterest(EEGGraph graph, @Nullable int channel) {
        graph.setChannelOfInterest(channel);
    }
    
    // Bridge function for receiving 'start threads' and 'stop threads' commands from the
    // dispatchViewManagerCommand() method in JS. Currently, only used in stopping threads when
    // switching between graphs in the SandboxGraph component    @Override
    public void receiveCommand(
            EEGGraph view,
            int commandID,
            @Nullable ReadableArray args) {
        Assertions.assertNotNull(view);
        Assertions.assertNotNull(args);
        switch (commandID) {
            case 0: {
                view.stopThreads();
                return;
            }
            default:
                throw new IllegalArgumentException(String.format(
                        "Unsupported command %d received by %s.",
                        commandID,
                        getClass().getSimpleName()));
        }
    }


    // Callback that will be triggered after all properties are updated in current update transaction
    //* (all @ReactProp handlers for properties updated in current transaction have been called)
    @Override
    protected void onAfterUpdateTransaction(EEGGraph view) {
        super.onAfterUpdateTransaction(view);
    }

}
