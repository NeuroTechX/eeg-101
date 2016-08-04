package com.example.dano.androidplot;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

public class MainActivity extends Activity {


    private static final String TAG = MainActivity.class.getName();



    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);


        setContentView(R.layout.activity_main);


        Button startDynamicPSDExButton = (Button)findViewById(R.id.startDynamicPSDExButton);
        startDynamicPSDExButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                startActivity(new Intent(MainActivity.this, DynamicPSDActivity.class));
            }
        });

        Button startHistoryPlotExButton = (Button) findViewById(R.id.startHistoryPlotExButton);
        startHistoryPlotExButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                startActivity(new Intent(MainActivity.this, HistoryPlotActivity.class));
            }
        });
        }
    }
