package com.eeg_project.components.csv;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Environment;
import android.os.SystemClock;
import android.util.Log;
import android.widget.Toast;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Arrays;

/**
 * Writes EEG data (either raw/filtered EEG or computed FFT) into a csv. Presents a toast when
 * recording is started and starts sharing intent for sending data to email when recording is
 * completed
 */

public class EEGFileWriter {

    // ---------------------------------------------------------------------------
    // Variables

    private Context context;
    StringBuilder builder;
    int fileNum = 1;
    public FileWriter fileWriter;
    private static boolean isRecording;

    // ---------------------------------------------------------------------------
    // Constructor

    public EEGFileWriter(Context context, String title) {
        this.context = context;
        isRecording = false;
    }

    // ---------------------------------------------------------------------------
    // Internal methods

    public void initFile(String title) {
        builder = new StringBuilder();
        builder.append("Timestamp (ms),");
        makeToast(title);
        isRecording = true;
        if(title.contains("Power")) {
            for(int i=1; i<129; i++) {
                builder.append(i + " hz,");
            }
            builder.append("\n");
        } else if(title.contains("Classifier")) {
            builder.append("Label,");
            for(int i=1; i<=16; i++) {
                builder.append(" Feature " + i + ",");
            }
            builder.append("\n");
        }
        else {
            for(int i=1; i<5; i++) {
                builder.append("Electrode " + i + ",");
            }
            builder.append("\n");
        }
    }

    public void addDataToFile(double[] data) {
        // Append timestamp
        Long tsLong = System.currentTimeMillis();
        builder.append(tsLong.toString() +",");
        for (int j = 0; j < data.length; j++) {
            builder.append(Double.toString(data[j]));
            if (j < data.length - 1) {
                builder.append(",");
            }
        }
        builder.append("\n");
    }

    public void addLineToFile(String line){
        builder.append(line);
        builder.append("\n");
    }

    public void writeFile(String title) {
        try {
            final File dir = context.getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS);
            final File file = new File(dir, title + fileNum + ".csv");
            fileWriter = new java.io.FileWriter(file);
            BufferedWriter bufferedWriter = new BufferedWriter(fileWriter);
            bufferedWriter.write(builder.toString());
            bufferedWriter.close();
            sendData(file);
            fileNum ++;
            isRecording = false;
        } catch (IOException e) {}
    }

    public void makeToast(String title) {
        CharSequence toastText = "Recording data in " + title+fileNum+".csv";
        Toast toast = Toast.makeText(context, toastText, Toast.LENGTH_SHORT);
        toast.show();
    }

    public void sendData(File dataCSV) {
        Intent sendIntent = new Intent();
        sendIntent.setAction(Intent.ACTION_SEND);
        sendIntent.setType("application/csv");
        sendIntent.putExtra(Intent.EXTRA_STREAM, Uri.fromFile(dataCSV));
        context.startActivity(Intent.createChooser(sendIntent, "Export data to..."));
    }

    public boolean isRecording() {
        return isRecording;
    }
}
