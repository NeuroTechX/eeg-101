package com.eeg_project.components.connector;

import android.app.Activity;
import android.support.annotation.Nullable;
import android.util.Log;

import com.choosemuse.libmuse.ConnectionState;
import com.choosemuse.libmuse.Muse;
import com.choosemuse.libmuse.MuseConnectionListener;
import com.choosemuse.libmuse.MuseConnectionPacket;
import com.choosemuse.libmuse.MuseListener;
import com.choosemuse.libmuse.MuseManagerAndroid;
import com.eeg_project.MainApplication;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.IllegalViewOperationException;

import java.lang.ref.WeakReference;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * React Native Module that allows LibMuse functions related to searching for and connecting to Muse
 * devices to be called from JS
 */

public class ConnectorModule extends ReactContextBaseJavaModule {

    // ----------------------------------------------------------
    // Variables
    private final String TAG = "Connector";
    private MuseManagerAndroid manager;
    private ConnectionListener connectionListener;

    //Initializes the MainApplication content so that the connectedMuse object stored within the global application state and be accessed by any part of the app
    MainApplication appState;
    List<Muse> availableMuses;
    Promise connectionPromise;
    Boolean unfulfilledPromise;

    // ---------------------------------------------------------
    // Constructor
    public ConnectorModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    // ---------------------------------------------------------
    // React Native Module methods
    // Required by ReactContextBaseJavaModule
    @Override
    public String getName() {
        return "Connector";
    }

    // Returns a map of the constants that are defined in Java to JS. Unused for now
    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        //constants.put(String, Object);
        return constants;
    }

    private void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    // ------------------------------------------------------------
    // Bridged methods




    @ReactMethod
    public void connectDevice(Promise promise) {
        connectionPromise = promise;
        unfulfilledPromise = true;
        try {
            sendEvent(getReactApplicationContext(), "CONNECT ATTEMPT", Arguments.createMap());
            Log.w(TAG, "Attempting to connect to " + availableMuses.get(0));
            // set global Muse to first muse in availableMuses list
            appState.connectedMuse = availableMuses.get(0);

            // Unregister all prior listeners and register our data listener to
            // receive the MuseDataPacketTypes we are interested in.  If you do
            // not register a listener for a particular data type, you will not
            // receive data packets of that type.

            appState.connectedMuse.unregisterAllListeners();
            appState.connectedMuse.registerConnectionListener(connectionListener);

            // Initiate a connection to the headband and stream the data asynchronously.
            // runAsynchronously() bridges to a C++ function that is implemented on the Muse
            appState.connectedMuse.runAsynchronously();
        } catch (IllegalArgumentException | NullPointerException | IndexOutOfBoundsException e) {
            connectionPromise.reject(e);
            return;
        }
    }

    @ReactMethod
    public void stopConnector() {
        // It is important to call stopListening when the Activity is paused
        // to avoid a resource leak from the LibMuse library.
        manager.stopListening();

        // Unregister listeners from connectMuse
        if (appState.connectedMuse != null) {
            appState.connectedMuse.unregisterAllListeners();
        }
    }

    //--------------------------------------------------------------
    // Internal methods

    private void startConnector() {
        // We need to set the context on MuseManagerAndroid before we can do anything.
        // This must come before other LibMuse API calls as it also loads the library.
        manager = MuseManagerAndroid.getInstance();
        manager.setContext(this.getReactApplicationContext());
        availableMuses = null;
        appState = ((MainApplication)this.getCurrentActivity().getApplication());
        WeakReference<Activity> weakActivity =
                new WeakReference<Activity> (this.getCurrentActivity());

        // Register a listener to receive connection state changes.
        connectionListener = new ConnectionListener(weakActivity);

        // Register a listener to receive notifications of what Muse headbands
        // we can connect to.
        manager.setMuseListener(new MuseL(weakActivity));
        manager.startListening();
    }

    // calls getMuses, resolves false ifEmpty, and returns readableArray if muses detected
    @ReactMethod
    public void getDevices(Promise promise) {
        if (manager == null) {
            startConnector();
        }
        // Create WriteableArray that can be passed to JS
        // Change from ReadableMap to ReadableArray containing ReadableMaps
        WritableArray availableMuseArray = Arguments.createArray();
        availableMuses = manager.getMuses();
        Log.w(TAG, "getMuses() result: " + availableMuses);
        if (availableMuses.isEmpty()) { promise.resolve(false); }
        else {
            try {
                sendEvent(getReactApplicationContext(), "MUSES FOUND", Arguments.createMap());
                // Add the name of each available Muse to an array that will be passed to JS
                for (Muse muse : availableMuses) {
                    Log.w(TAG, "Found " + muse.getName());
                    availableMuseArray.pushString(muse.getName());
                }
                promise.resolve(availableMuseArray);
            } catch (IllegalViewOperationException e) {
                promise.reject(e);
            }
        }
    }

    //--------------------------------------
    // Listeners

    // Detects available headbands and listens for changes to the list of Muses
    class MuseL extends MuseListener {
        final WeakReference<Activity> activityRef;

        MuseL(final WeakReference<Activity> activityRef) {
            this.activityRef = activityRef;
        }

        @Override
        public void museListChanged() {
            Log.w(TAG, "" + manager.getMuses());
        }
    }

    // Notified whenever connection state of its registered Muse changes
    class ConnectionListener extends MuseConnectionListener  {
        final WeakReference<Activity> activityRef;

        ConnectionListener(final WeakReference<Activity> activityRef) {
            this.activityRef = activityRef;
        }

        @Override
        public void receiveMuseConnectionPacket(final MuseConnectionPacket p, final Muse muse) {

            final ConnectionState current = p.getCurrentConnectionState();

            // Code to resolve connectionPromise either true or false from connectDevice()
            // We only want this code to run if connectDevice() has just been triggered and the
            // promise is still pending
                if (current == ConnectionState.CONNECTED) {
                    sendEvent(getReactApplicationContext(), "CONNECTED", Arguments.createMap());
                    if (unfulfilledPromise){
                        connectionPromise.resolve(true);
                        manager.stopListening();
                        unfulfilledPromise = false;
                    }
                }

                // If listener detects disconnected state while their is not unfulfilled promise,
                // an event should be dispatched to JS to return user to connection screen
                if (current == ConnectionState.DISCONNECTED) {
                    sendEvent(getReactApplicationContext(), "DISCONNECTED", Arguments.createMap());
                    if (unfulfilledPromise){
                        connectionPromise.resolve(false);
                        manager.stopListening();
                        unfulfilledPromise = false;
                    }
                }

        }
    }
}




