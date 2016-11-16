package com.eeg_project.components.EEGGraph;

import com.androidplot.xy.XYSeries;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.NoSuchElementException;
import com.androidplot.xy.XYSeries;


// AndroidPlot class that stores data to be plotted. getX() and getY() are called by XYPlot to to draw graph
// This implementation only stores Y values, with X values implicitily determined by the index of the data in the LinkedList
class DynamicSeries implements XYSeries {

    // -------------------------------------------------------------
    // Variables
    private String title;
    private volatile LinkedList<Number> yVals = new LinkedList<Number>();


    // -------------------------------------------------------------
    // Constructor
    public DynamicSeries(String title) {
        this.title = title;
    }

    // --------------------------------------------------------------
    // Methods
    @Override
    public String getTitle() {
        return title;
    }

    @Override
    public int size() {
        return yVals != null ? yVals.size() : 0;
    }

    @Override
    public Number getX(int index) {
        return index;
    }

    @Override
    public Number getY(int index) {
        return yVals.get(index);
    }

    public void addFirst(Number y) {
        yVals.addFirst(y);
    }

    public void addLast(Number y) {
        yVals.addLast(y);
    }

    public void addAll(Number[] y) {
        yVals.addAll(Arrays.asList(y));

    }

    public void removeFirst() {
        if (size() <= 0) {
            throw new NoSuchElementException();
        }
        yVals.removeFirst();
    }

    public void removeLast() {
        if (size() <= 0) {
            throw new NoSuchElementException();
        }
        yVals.removeLast();
    }

    public void clear() {
        yVals.clear();
    }

}
