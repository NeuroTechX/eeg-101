package com.eeg_project.components.battery;

import android.util.Log;
import android.os.Handler;
import android.os.HandlerThread;

import com.choosemuse.libmuse.Battery;
import com.choosemuse.libmuse.Muse;
import com.choosemuse.libmuse.MuseArtifactPacket;
import com.choosemuse.libmuse.MuseDataListener;
import com.choosemuse.libmuse.MuseDataPacket;
import com.choosemuse.libmuse.MuseDataPacketType;
import com.eeg_project.MainApplication;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

//Created by Vasyl 19/11/2018

public class BatteryModule extends ReactContextBaseJavaModule {

    public DataListener batteryListener;
    MainApplication appState;

    public BatteryModule(ReactApplicationContext reactContext) {
        super(reactContext);
        appState = ((MainApplication)reactContext.getApplicationContext());
    }     

    @Override
    public String getName() {
        return "Battery";
    }

    private void sendBattery(String eventName, int battery) {
        getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, battery);
    }

    @ReactMethod
    public void setBatteryListener() {
        batteryListener = new DataListener();
        appState.connectedMuse.registerDataListener(batteryListener, MuseDataPacketType.BATTERY);
    }

    public class DataListener extends MuseDataListener {

        double value;
        
        @Override
        public void receiveMuseDataPacket(final MuseDataPacket p, final Muse muse) {
            getBatteryValue(value, p);
        }

        private void getBatteryValue(double value, MuseDataPacket p) {
            value = p.getBatteryValue(Battery.CHARGE_PERCENTAGE_REMAINING);
            int battery = (int) value;
            sendBattery("BATTERY", battery);
        }

        @Override
        public void receiveMuseArtifactPacket(final MuseArtifactPacket p, final Muse muse) {

        }
    }
}
