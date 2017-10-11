package com.eeg_project.components.graphs;

import com.androidplot.Plot;

import java.lang.ref.WeakReference;

// Runnable class that redraws plot at a fixed frequency
public class PlotUpdater implements Runnable {
    WeakReference<Plot> plot;
    private boolean keepRunning = true;
    public PlotUpdater(Plot plot) {
        this.plot = new WeakReference<Plot>(plot);
    }

    @Override
    public void run() {
        try {
            keepRunning = true;
            while (keepRunning) {
                // 33ms sleep = 30 fps
                Thread.sleep(33);
                if(plot != null) {
                    plot.get().redraw();
                }
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    public void stopThread() {
        keepRunning = false;
    }
}
