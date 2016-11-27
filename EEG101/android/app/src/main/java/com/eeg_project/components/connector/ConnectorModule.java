package com.eeg_project.components.connector;

import android.app.Activity;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.Looper;
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
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.lang.ref.WeakReference;
import java.util.HashMap;
import java.util.List;
import java.util.Map;



// React Native module that allows app to connect to Muse devices.
// Calling getAndConnectToDevice from JS handles entire connection process.
public class ConnectorModule extends ReactContextBaseJavaModule {

    // ----------------------------------------------------------
    // Variables
    private final String TAG = "Connector";
    private MuseManagerAndroid manager;
    private ConnectionListener connectionListener;
    private int museIndex = 0;
    private int tryCount = 0;
    private List<Muse> availableMuses;
    private Promise connectionPromise;
    private Boolean isPromiseUnfulfilled;
    private Muse muse;
    public MainApplication appState;
    public Handler connectHandler;
    public HandlerThread connectThread;

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

    // Called to emit events to event listeners in JS
    private void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    // ------------------------------------------------------------
    // Bridged methods

    // Gets a list of devices and attempts to connect to them in sequence. Returns true if connected and false if no devices are detected
    @ReactMethod
    public void getAndConnectToDevice(Promise promise) {
        sendEvent(getReactApplicationContext(), "DISCONNECTED", Arguments.createMap());
        connectionPromise = promise;
        isPromiseUnfulfilled = true;
        availableMuses = null;
        // Connected Muses are stored in the MainApplication context so they can be accessed from anywhere in the app.
        //Initializes the MainApplication content so that the connectedMuse object stored within the global application state and be accessed by any part of the app
        appState = ((MainApplication)this.getCurrentActivity().getApplication());
        if (manager == null) {
            startMuseManager();
        }

        connectThread = new HandlerThread("connectThread");
        connectThread.start();
        connectHandler = new Handler(connectThread.getLooper());
        connectHandler.post(searchRunnable);
        connectToMuse();
        }

    //--------------------------------------------------------------
    // Internal methods

    public void startMuseManager() {
        // MuseManagerAndroid must be created and given context before any LibMuse calls can be made
        manager = MuseManagerAndroid.getInstance();
        manager.setContext(this.getReactApplicationContext());
        // Listeners are attached to a weak reference to the current activity to avoid memory leaks

        manager.setMuseListener(new MuseL());
        manager.startListening();
    }

    public void noMusesDetected() {
        sendEvent(getReactApplicationContext(), "NO_MUSES", Arguments.createMap());
        stopConnector();
        connectionPromise.resolve(false);
    }

    public void connectToMuse() {
        Log.w(TAG, "connectToMuse called");
        connectHandler.post(connectRunnable);
    }

    public void museConnected() {
        Log.w(TAG, "museConnected");
        connectionPromise.resolve(true);
        appState.connectedMuse = muse;
        stopConnector();

        // Register connectionListener that will persist throughout app
        connectionListener = new ConnectionListener();
        appState.connectedMuse.registerConnectionListener(connectionListener);
    }

    // ------------------------------------------------------------------------------
    // Runnables

    // Searches for available Muses and puts app in NO_MUSE state if none are detected
    private final Runnable searchRunnable = new Runnable() {
        @Override
        public void run() {
            try {

                availableMuses = manager.getMuses();
                Log.w(TAG, "Searching for Muses" + availableMuses);
                Thread.sleep(1000);
                if (availableMuses.isEmpty() || tryCount >= 4) {
                    noMusesDetected();
                }
            } catch ( InterruptedException e) { }
        }
    };

    // Handles connection attempts. Allows connection to occur on a seperate thread so it doesn't slow down UI. Starts looping through available Muses, but should only be called once.
    private final Runnable connectRunnable = new Runnable() {
        @Override
        public void run() {
            try {
                sendEvent(getReactApplicationContext(), "CONNECT_ATTEMPT", Arguments.createMap());
                Log.w(TAG, "Attempting to connect to " + availableMuses.get(museIndex).getName());
                muse = availableMuses.get(museIndex);
                connectionListener = new ConnectionListener();

                // Unregister all prior listeners and register our ConnectionListener to the
                // Muse we are interested in. The ConnectionListener will allow us to detect
                // whether the connection attempt is successful
                muse.unregisterAllListeners();
                muse.registerConnectionListener(connectionListener);

                // Initiate a connection to the headband and stream the data asynchronously.
                // runAsynchronously() handles most of the work to connect to the Muse by itself
                muse.runAsynchronously();
            } catch (IllegalArgumentException | NullPointerException | IndexOutOfBoundsException e) {
                connectionPromise.reject(e);
                return;
            }
        }
    };



    // ---------------------------------------------------------
    // Thread management functions

    // Start thread that will  update the data whenever a Muse data packet is received

    @ReactMethod
    // Stops all threads, managers, handlers, and listeners created in this module
    public void stopConnector() {
        Log.w(TAG, "Stopping connector");
        tryCount = 0;
        // It is important to call stopListening when the Activity is paused
        // to avoid a resource leak from the LibMuse library.
        if (manager != null) {
            manager.stopListening();
            manager = null;
        }
        isPromiseUnfulfilled = false;
        if (connectHandler != null) {
            connectHandler.removeCallbacks(connectRunnable);
            connectThread.quit();
        }
        // Unregister listeners from connectMuse
        if (muse != null) {
            muse.unregisterAllListeners();
            muse = null;
        }
    }

    //--------------------------------------
    // Listeners

    // Detects available headbands and listens for changes to the list of Muses
    class MuseL extends MuseListener {

        MuseL() {
        }

        @Override
        public void museListChanged() {
            Log.w(TAG, "New Muse added " + manager.getMuses());
            availableMuses = manager.getMuses();
        }
    }

    // Notified whenever connection state of its registered Muse changes
    class ConnectionListener extends MuseConnectionListener  {

        ConnectionListener() {
        }

        @Override
        public void receiveMuseConnectionPacket(final MuseConnectionPacket p, final Muse muse) {
            final ConnectionState current = p.getCurrentConnectionState();
            // Code to resolve connectionPromise either true or false from connectDevice()
            // We only want this code to run if connectDevice() has just been triggered and the
            // promise is still pending
                if (current == ConnectionState.CONNECTED) {
                    sendEvent(getReactApplicationContext(), "CONNECTED", Arguments.createMap());
                    if (isPromiseUnfulfilled){
                        museConnected();
                        return;
                    }
                }

                // If listener detects disconnected state while their is not unfulfilled promise,
                // an event should be dispatched to JS to return user to connection screen
                if (current == ConnectionState.DISCONNECTED) {
                    sendEvent(getReactApplicationContext(), "DISCONNECTED", Arguments.createMap());
                    if (isPromiseUnfulfilled){
                        muse.unregisterAllListeners();
                        museIndex++;
                        tryCount++;
                        if(museIndex < availableMuses.size()) {
                            Log.w(TAG, "trying next muse in list");
                            connectToMuse();
                        } else {
                            Log.w(TAG, "none of the muses worked, trying again");
                            museIndex = 0;
                            connectHandler.post(searchRunnable);
                            connectToMuse();
                        }
                    }
                }

        }
    }
}




