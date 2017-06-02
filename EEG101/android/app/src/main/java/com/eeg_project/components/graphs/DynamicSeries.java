package com.eeg_project.components.graphs;

import android.graphics.Canvas;

import com.androidplot.Plot;
import com.androidplot.PlotListener;
import com.androidplot.xy.XYSeries;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.NoSuchElementException;
import java.util.concurrent.locks.ReentrantReadWriteLock;


// AndroidPlot class that stores dataSource to be plotted. getX() and getY() are called by XYPlot to to draw graph
// This implementation only stores Y values, with X values implicitily determined by the index of the dataSource in the LinkedList
public class DynamicSeries implements XYSeries, PlotListener {

    // -------------------------------------------------------------
    // Variables

    private String title;
    private volatile LinkedList<Number> yVals = new LinkedList<Number>();
    private ReentrantReadWriteLock lock = new ReentrantReadWriteLock(true);

    // -------------------------------------------------------------
    // Constructor

    public DynamicSeries(String title) {
        this.title = title;
    }

    // --------------------------------------------------------------
    // Data Series Methods

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


    public void addLast(Number y) {
        yVals.addLast(y);
    }

    public void addAll(Double[] y) {
        yVals.addAll(Arrays.asList(y));
    }

    public void removeFirst() {
        yVals.removeFirst();
    }

    public void remove(int nbsamples) {
        for(int i = 0; i<nbsamples; i++){
            yVals.removeFirst();
        }
    }

    public void clear() {
        yVals.clear();
    }

    // ------------------------------------------------------------
    // PlotListener Methods

    @Override
    public void onBeforeDraw(Plot source, Canvas canvas) {
        lock.readLock().lock();
    }

    @Override
    public void onAfterDraw(Plot source, Canvas canvas) {
        lock.readLock().unlock();
    }

}