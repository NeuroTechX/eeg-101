package com.eeg_project.components.managers;

import android.view.View;

import com.eeg_project.components.graphs.FilterGraph;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import javax.annotation.Nullable;

// GraphManager class manages EEGGraph objects.
public class FilterGraphManager extends SimpleViewManager<FilterGraph> {
    private final static String REACT_CLASS = "CIRC_BUFFER_GRAPH";
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


    // Bridge function for visibility prop. View.VISIBILITY is a native property of Android views
    @ReactProp(name = "visibility")
    public void setVisibility(FilterGraph graph, @Nullable boolean isVisible) {
        if (isVisible){
            graph.setVisibility(View.VISIBLE);
        }
        else {
            graph.setVisibility(View.INVISIBLE);
        }
    }

    // Bridge function for channelOfInterestProp. Calls setChannelOfInterest in EEGGraph
    @ReactProp(name = "channelOfInterest")
    public void setChannelOfInterest(FilterGraph graph, @Nullable int channel) {
        graph.setChannelOfInterest(channel);
    }

}
