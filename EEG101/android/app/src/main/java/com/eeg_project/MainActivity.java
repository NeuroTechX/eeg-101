package com.eeg_project;

import android.os.Bundle;
import android.view.WindowManager;

import com.facebook.react.ReactActivity;
import com.horcrux.svg.SvgPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.airbnb.android.react.lottie.LottiePackage;

//
public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "EEG_Project";
    }

    // Overriding onCreate to add KEEP_SCREEN_ON flag so that phone doesn't turn off screen
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        this.getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
    }
}
