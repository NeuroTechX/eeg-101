package com.eeg_project.components.managers;

import android.util.Log;
import android.view.View;

import com.eeg_project.components.graphs.FilterGraph;
import com.eeg_project.components.graphs.PSDGraph;
import com.facebook.infer.annotation.Assertions;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import javax.annotation.Nullable;

// Manages FilterGraph class for import into React Native
public class FilterGraphManager extends SimpleViewManager<FilterGraph> {
    private final static String REACT_CLASS = "FILTER_GRAPH";
    FilterGraph bufferGraph;

    @Override
    // Used to reference this view type from js side
    public String getName() {
        return REACT_CLASS;
    }

    // Creates new EEGGraph views, accepting context as an argument. Context links the EEGGraph view to MainActivity
    @Override
    protected FilterGraph createViewInstance(ThemedReactContext context) {
        bufferGraph = new FilterGraph(context);
        return bufferGraph;
    }

    // Called when view is detached from view hierarchy
    // Necessary to clean up graph here with react-router
    @Override
    public void onDropViewInstance(FilterGraph graph) {
        Log.w("FilterGraphManager", "onDropViewInstance called");
        graph.stopDataListener();
        graph.removeAllViews();
    }

    // Bridge function for visibility prop. View.VISIBILITY is a native property of Android views
    @ReactProp(name = "visibility")
    public void setVisibility(FilterGraph graph, @Nullable boolean isVisible) {
        if (isVisible){
            graph.setVisibility(View.VISIBLE);
        } else {
            Log.w("FilterGraphManager", "setting visibility to false");

            graph.setVisibility(View.INVISIBLE);
        }
    }

    // Bridge function for channelOfInterest Prop. Calls setChannelOfInterest in FilterGraph
    @ReactProp(name = "channelOfInterest")
    public void setChannelOfInterest(FilterGraph graph, @Nullable int channel) {
        graph.setChannelOfInterest(channel);
    }

    // Bridge function for filterType Prop. Calls setFilterType in FilterGraph
    @ReactProp(name = "filterType")
    public void setFilterType(FilterGraph graph, @Nullable String filterType) {
        Log.w("filterType", filterType);
        graph.setFilterType(filterType);
    }

    // Bridge function for isRecording Prop. Calls setIsRecording in PSDGraph
    @ReactProp(name = "isRecording")
    public void setIsRecording(FilterGraph graph, @Nullable boolean isRecording) {
        if(isRecording) {
            graph.startRecording();
        } else {
            graph.stopRecording();
        }
    }

    // Bridge function for receiving 'start threads' and 'stop threads' commands from the
    // dispatchViewManagerCommand() method in JS. Currently, only used in stopping threads when
    // switching between graphs in the SandboxGraph component
    @Override
    public void receiveCommand(
            FilterGraph view,
            int commandID,
            @Nullable ReadableArray args) {
        Assertions.assertNotNull(view);
        Assertions.assertNotNull(args);
        switch (commandID) {
            case 0: {
                view.stopDataListener();
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
