package com.example.dano.androidplot;

import android.app.Activity;
import android.graphics.Color;
import android.graphics.DashPathEffect;
import android.graphics.Paint;
import android.os.Bundle;
import com.androidplot.Plot;
import com.androidplot.ui.Size;
import com.androidplot.ui.SizeLayoutType;
import com.androidplot.ui.XLayoutStyle;
import com.androidplot.ui.YLayoutStyle;
import com.androidplot.util.PixelUtils;
import com.androidplot.xy.XYSeries;
import com.androidplot.ui.SizeMetric;

import com.androidplot.xy.*;
import java.text.DecimalFormat;
import java.util.Observable;
import java.util.Observer;

public class DynamicPSDActivity extends Activity {

    // redraws a plot whenever an update is received
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
    private XYPlot dynamicPlot;
    private MyPlotUpdater plotUpdater;
    PSDDatasource data;
    private Thread myThread;


    @Override
    public void onCreate(Bundle savedInstanceState) {

        // android boilerplate stuff
        super.onCreate(savedInstanceState);
        setContentView(R.layout.dynamicpsdplot_example);

        // get handles to our View defined in layout.xml:
        dynamicPlot = (XYPlot) findViewById(R.id.dynamicPSDPlot);

        plotUpdater = new MyPlotUpdater(dynamicPlot);

        //Format plot layout:
        //Remove margins, padding and border
        dynamicPlot.setPlotMargins(0, 0, 0, 0);
        dynamicPlot.setPlotPadding(0, 0, 0, 0);
        dynamicPlot.setBorderPaint(null);

        // Make plot background white (including removing grid lines)
        dynamicPlot.getBackgroundPaint().setColor(Color.TRANSPARENT);
        dynamicPlot.getGraphWidget().setBackgroundPaint(null);
        dynamicPlot.getGraphWidget().getGridBackgroundPaint().setColor(Color.TRANSPARENT);
        dynamicPlot.getGraphWidget().getDomainGridLinePaint().setColor(Color.TRANSPARENT);
        dynamicPlot.getGraphWidget().getDomainOriginLinePaint().setColor(Color.TRANSPARENT);
        dynamicPlot.getGraphWidget().getRangeGridLinePaint().setColor(Color.TRANSPARENT);
        dynamicPlot.getGraphWidget().getRangeOriginLinePaint().setColor(Color.TRANSPARENT);


        // Remove axis labels and values
        // Domain = X; Range = Y
        dynamicPlot.setDomainLabelWidget(null);
        dynamicPlot.setRangeLabelWidget(null);
        dynamicPlot.getGraphWidget().getRangeTickLabelPaint().setColor(Color.TRANSPARENT);
        dynamicPlot.getGraphWidget().getRangeOriginTickLabelPaint().setColor(Color.TRANSPARENT);
        dynamicPlot.getGraphWidget().getDomainTickLabelPaint().setColor(Color.TRANSPARENT);
        dynamicPlot.getGraphWidget().getDomainOriginTickLabelPaint().setColor(Color.TRANSPARENT);


        // Remove extraneous elements
        dynamicPlot.setTitleWidget(null);
        dynamicPlot.getLayoutManager().remove(dynamicPlot.getLegendWidget());

        // Set size of plot
        dynamicPlot.getGraphWidget().setSize(new Size(0, SizeLayoutType.FILL, 0, SizeLayoutType.FILL));

        // Set position of plot (should be tweaked in order to center chart position)
        dynamicPlot.getGraphWidget().position(0, XLayoutStyle.ABSOLUTE_FROM_LEFT,
                0, YLayoutStyle.ABSOLUTE_FROM_TOP);





        // getInstance and position datasets:
        data = new PSDDatasource();
        DynamicSeries psd = new DynamicSeries(data, 0, "PSD");


        // Create formatter, which defines look and feel of the line and points
        LineAndPointFormatter formatter = new LineAndPointFormatter(
                Color.rgb(0, 0, 0), null, null, null);
        formatter.getLinePaint().setStrokeJoin(Paint.Join.ROUND);
        formatter.getLinePaint().setStrokeWidth(10);

        // Configure interpolation of the line in order to make it smooth
        formatter.setInterpolationParams(
                new CatmullRomInterpolator.Params(20, CatmullRomInterpolator.Type.Centripetal));

        // Add the Data series 'psd' with formatting by 'formatter' to plot
        dynamicPlot.addSeries(psd,formatter);

        // hook up the plotUpdater to the data model:
        data.addObserver(plotUpdater);

        // thin out domain tick labels so they dont overlap each other:
        // Domain = X
        dynamicPlot.setDomainStepMode(XYStepMode.INCREMENT_BY_VAL);
        dynamicPlot.setDomainStepValue(10);

        // Range = y
        dynamicPlot.setRangeStepMode(XYStepMode.INCREMENT_BY_VAL);
        dynamicPlot.setRangeStepValue(10);

        dynamicPlot.setRangeValueFormat(new DecimalFormat("###.#"));

        // uncomment this line to freeze the range boundaries:
        dynamicPlot.setRangeBoundaries(0, 100, BoundaryMode.FIXED);



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

    class PSDDatasource implements Runnable {

        // encapsulates management of the observers watching this datasource for update events:
        class MyObservable extends Observable {
            @Override
            public void notifyObservers() {
                setChanged();
                super.notifyObservers();
            }
        }



        private int step = 0;
        private int SAMPLE_SIZE = 5;

        private MyObservable notifier;
        private boolean keepRunning = false;

        Number[] f = {0, 4, 8, 13, 20, 30, 40, 70};
        Number[] psd;

        {
            notifier = new MyObservable();
        }

        public void stopThread() {
            keepRunning = false;
        }

        //@Override
        public void run() {
            try {
                keepRunning = true;

                while (keepRunning) {

                    Thread.sleep(10); // decrease or remove to speed up the refresh rate.
                    step++;

                    // Update values in psd
                    psd = new Number[]{70 + Math.random() * 10, 73 + Math.random() * 10, 80
                            + Math.random() * 10, 50 + Math.random() * 10, 35 + Math.random() * 10,
                            30 + Math.random() * 10, 20 + Math.random() * 10, 15 + Math.random() * 10};

                    notifier.notifyObservers();
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        public int getItemCount(int series) {
            return SAMPLE_SIZE;
        }

        public Number getX(int series, int index) {
            if (index >= SAMPLE_SIZE) {
                throw new IllegalArgumentException();
            }
            return f[index];
        }

        public Number getY(int series, int index) {
            if (index >= SAMPLE_SIZE) {
                throw new IllegalArgumentException();
            }
            return psd[index];

        }

        public void addObserver(Observer observer) {
            notifier.addObserver(observer);
        }

        public void removeObserver(Observer observer) {
            notifier.deleteObserver(observer);
        }

    }

    class DynamicSeries implements XYSeries {
        private PSDDatasource datasource;
        private int seriesIndex;
        private String title;

        public DynamicSeries(PSDDatasource datasource, int seriesIndex, String title) {
            this.datasource = datasource;
            this.seriesIndex = seriesIndex;
            this.title = title;
        }

        @Override
        public String getTitle() {
            return title;
        }

        @Override
        public int size() {
            return datasource.getItemCount(seriesIndex);
        }

        @Override
        public Number getX(int index) {
            return datasource.getX(seriesIndex, index);
        }

        @Override
        public Number getY(int index) {
            return datasource.getY(seriesIndex, index);
        }
    }
}