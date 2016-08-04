package com.example.dano.androidplot;

import android.app.Activity;
import android.graphics.Color;
import android.os.Bundle;

import com.androidplot.Plot;
import com.androidplot.ui.Size;
import com.androidplot.ui.SizeLayoutType;
import com.androidplot.ui.XLayoutStyle;
import com.androidplot.ui.YLayoutStyle;
import com.androidplot.xy.BoundaryMode;
import com.androidplot.xy.LineAndPointFormatter;
import com.androidplot.xy.SimpleXYSeries;
import com.androidplot.xy.XYPlot;

import java.util.Observable;
import java.util.Observer;

/**
 * A simple dynamic line plot that displays a certain time period of time series data scrolling to
 * the right
 */
public class HistoryPlotActivity extends Activity {

    private XYPlot historyPlot;
    private static final int PLOT_LENGTH = 300;
    private MyPlotUpdater plotUpdater;
    HistoryDataSource data;
    private SimpleXYSeries historySeries;
    private Thread myThread;

    // Set up MyPlotUpdater observer class that will redraw plot
    private class MyPlotUpdater implements Observer {
        Plot plot;

        public MyPlotUpdater(Plot plot) {
            this.plot = plot;
        }

        @Override
        public void update(Observable o, Object arg) {
            plot.redraw();
        }
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {

        // android boilerplate stuff
        super.onCreate(savedInstanceState);
        setContentView(R.layout.historyplot);

        // setup the History plot:
        historyPlot = (XYPlot) findViewById(R.id.historyplot);

        // set up PlotUpdater
        plotUpdater = new MyPlotUpdater(historyPlot);

        // get datasets (Y will be historySeries, x will be implicitly generated):
        data = new HistoryDataSource();
        historySeries = new SimpleXYSeries("Sample");
        historySeries.useImplicitXVals();

        // Set X and Y domain
        historyPlot.setRangeBoundaries(0, 100, BoundaryMode.FIXED);
        historyPlot.setDomainBoundaries(0, PLOT_LENGTH, BoundaryMode.FIXED);


        // add series to plot
        historyPlot.addSeries(historySeries,
                new LineAndPointFormatter(Color.rgb(0,0, 0), null, null, null));

        // hook up series to data source
        data.addObserver(plotUpdater);
        
        // Format plot layout
        //Remove margins, padding and border
        historyPlot.setPlotMargins(0, 0, 0, 0);
        historyPlot.setPlotPadding(0, 0, 0, 0);
        historyPlot.setBorderPaint(null);
        
        // Make plot background white (including removing grid lines)
        historyPlot.getBackgroundPaint().setColor(Color.WHITE);
        historyPlot.getGraphWidget().setBackgroundPaint(null);
        historyPlot.getGraphWidget().getGridBackgroundPaint().setColor(Color.TRANSPARENT);
        historyPlot.getGraphWidget().getDomainGridLinePaint().setColor(Color.TRANSPARENT);
        historyPlot.getGraphWidget().getDomainOriginLinePaint().setColor(Color.TRANSPARENT);
        historyPlot.getGraphWidget().getRangeGridLinePaint().setColor(Color.TRANSPARENT);
        historyPlot.getGraphWidget().getRangeOriginLinePaint().setColor(Color.TRANSPARENT);


        // Remove axis labels and values
        // Domain = X; Range = Y
        historyPlot.setDomainLabelWidget(null);
        historyPlot.setRangeLabelWidget(null);
        historyPlot.getGraphWidget().getRangeTickLabelPaint().setColor(Color.TRANSPARENT);
        historyPlot.getGraphWidget().getRangeOriginTickLabelPaint().setColor(Color.TRANSPARENT);
        historyPlot.getGraphWidget().getDomainTickLabelPaint().setColor(Color.TRANSPARENT);
        historyPlot.getGraphWidget().getDomainOriginTickLabelPaint().setColor(Color.TRANSPARENT);


        // Remove extraneous elements
        historyPlot.setTitleWidget(null);
        historyPlot.getLayoutManager().remove(historyPlot.getLegendWidget());

        // Set size of plot
        historyPlot.getGraphWidget().setSize(new Size(0, SizeLayoutType.FILL, 0, SizeLayoutType.FILL));

        // Set position of plot (should be tweaked in order to center chart position)
        historyPlot.getGraphWidget().position(0, XLayoutStyle.ABSOLUTE_FROM_LEFT,
                0, YLayoutStyle.ABSOLUTE_FROM_TOP);

    }

    @Override
    public void onResume() {
        // kick off the data generating thread:
        myThread = new Thread(data);
        myThread.start();
        super.onResume();
    }

    @Override
    public void onPause() {
        data.stopThread();
        super.onPause();
    }

    public class HistoryDataSource implements Runnable {


        private MyObservable notifier;
        private boolean keepRunning = true;

        // encapsulates management of the observers watching this datasource for update events:
        class MyObservable extends Observable {
            @Override
            public void notifyObservers() {
                setChanged();
                super.notifyObservers();
            }
        }

        // these brackets need to be here but I don't understand why
        {
            // construct notifier that will be used to trigger update of MyPlotUpdater
            notifier = new MyObservable();
        }

        @Override
        public void run() {
            try {
                keepRunning = true;
                while (keepRunning) {

                    Thread.sleep(10);

                    if (historySeries.size() > PLOT_LENGTH) {
                        historySeries.removeFirst();
                    }

                    historySeries.addLast(null, Math.random() * 10 + 50);
                    notifier.notifyObservers();
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        public void stopThread() {
            keepRunning = false;
        }


        public void addObserver(Observer observer) {
            notifier.addObserver(observer);
        }
    }

}


