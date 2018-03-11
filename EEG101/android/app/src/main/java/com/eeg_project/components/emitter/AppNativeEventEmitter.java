package com.eeg_project.components.emitter;

import android.support.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

// Handles emitting events to JS

public class AppNativeEventEmitter extends ReactContextBaseJavaModule {

    // ----------------------------------------------------------
    // Variables

    // ---------------------------------------------------------
    // Constructor

    public AppNativeEventEmitter(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    // ---------------------------------------------------------
    // React Native Module methods

    // Required by ReactContextBaseJavaModule
    @Override
    public String getName() {
        return "AppNativeEventEmitter";
    }

    // ---------------------------------------------------------
    // Public sendEvent Methods

    // Send events with int params (PREDICT_RESULT)
    public void sendEvent(String eventName, int result) {
        getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, result);
    }

    // Send events with Map params (CONNECTION_CHANGED, NOISE)
    public void sendEvent(String eventName, @Nullable WritableMap params) {
        getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    // Send events with Array params (MUSE_LIST_CHANGED)
    public void sendEvent(String eventName, @Nullable WritableArray params) {
        getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
}