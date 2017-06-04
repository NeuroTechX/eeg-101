package com.eeg_project.components.managers;

import android.util.Log;
import android.view.View;

import com.eeg_project.components.graphs.PSDGraph;
import com.facebook.infer.annotation.Assertions;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import javax.annotation.Nullable;


// Manages PSDGraph class for import into React Native
public class PSDGraphManager extends SimpleViewManager<PSDGraph> {
    private final static String REACT_CLASS = "PSD_GRAPH";
    PSDGraph psdGraph;

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    // Creates new PSDGraph views, accepting context as an argument. Context links the PSDGraph
    // view to MainActivity
    @Override
    public PSDGraph createViewInstance(ThemedReactContext context) {
        psdGraph = new PSDGraph(context);
        return psdGraph;
    }

    // Called when view is detached from view hierarchy
    // Necessary to clean up graph here with react-router
    @Override
    public void onDropViewInstance(PSDGraph graph) {
        graph.stopThreads();
        graph.removeAllViews();
    }

    // Bridge function for channelOfInterestProp. Calls setChannelOfInterest in PSDGraph
    @ReactProp(name = "channelOfInterest")
    public void setChannelOfInterest(PSDGraph graph, @Nullable int channel) {
        graph.setChannelOfInterest(channel);
    }

    // Bridge function for isRecording Prop. Calls setIsRecording in PSDGraph
    @ReactProp(name = "isRecording")
    public void setIsRecording(PSDGraph graph, @Nullable boolean isRecording) {
        if(isRecording) {
            graph.startRecording();
        } else {
            graph.stopRecording();
        }
    }

    // Bridge function for receiving 'start threads' and 'stop threads' commands from the
    // dispatchViewManagerCommand() method in JS. Currently, only used in stopping threads when
    // switching between graphs in the SandboxGraph component    @Override
    public void receiveCommand(
            PSDGraph view,
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
}

