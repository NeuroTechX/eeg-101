package com.eeg_project.components;

import android.content.Context;
import android.os.Environment;
import android.util.Log;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;

/**
 * Created by dano on 14/03/17.
 */

public class EEGFileWriter {

    // ---------------------------------------------------------------------------
    // Variables

    private Context context;

    // File writing stuff
    StringBuilder builder;
    int fileNum = 1;
    public FileWriter fileWriter;

    // ---------------------------------------------------------------------------
    // Constructor

    public EEGFileWriter(Context context, String title) {
        this.context = context;
        initFile(title);
    }

    // ---------------------------------------------------------------------------
    // Internal methods

    public void initFile(String title) {
        String[] header = {title + "\n", "Electrode 1,", "Electrode 2,", "Electrode 3,",
                "Electrode 4\n"};
        builder = new StringBuilder();
        builder.append(header);
    }

    public void addDataToFile(double[] data) {
        // Loops through every PSD bin
        for (int j = 0; j < data.length; j++) {
            builder.append(Double.toString(data[j]));
            if (j < data.length - 1) {
                builder.append(",");
            }
        }
        builder.append("\n");
    }

    public void writeFile(String title) {
        FileOutputStream outputStream ;
        try {
            final File dir = context.getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS);
            final File file = new File(dir,
                    "MuseRecording"+fileNum+"" +
                            ".csv");
            Log.w("Listener", "Creating new file " + file);
            fileWriter = new java.io.FileWriter(file);

            if (!dir.exists()) {
                dir.mkdir();
            }

            BufferedWriter bufferedWriter = new BufferedWriter(fileWriter);
            bufferedWriter.write(builder.toString());
            Log.w("Listener", "wrote file to " + file.getAbsolutePath());
            bufferedWriter.close();
            fileNum ++;
        } catch (IOException e) {}
        initFile(title);
    }

    public boolean isRecording() {
        if (builder.length() > 1) {
            return true;
        }
        return false;
    }
}
