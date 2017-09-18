package com.eeg_project.components.connector;

import android.bluetooth.BluetoothAdapter;
import android.os.Handler;
import android.os.HandlerThread;
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
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.List;

// Handles connecting to the Muse headband

public class ConnectorModule extends ReactContextBaseJavaModule {

    // ----------------------------------------------------------
    // Variables

    private MuseManagerAndroid manager;
    private ConnectionListener connectionListener;
    private int museIndex = 0;
    private List<Muse> availableMuses;
    private Muse muse;
    private WritableMap bluetoothMap;
    private boolean isBluetoothEnabled;
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

    // Send events with Map params (CONNECTION_CHANGED)
    private void sendEvent(String eventName, @Nullable WritableMap params) {
        getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    // Send events with Array params (MUSE_LIST_CHANGED)
    private void sendEvent(String eventName, @Nullable WritableArray params) {
        getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    // ------------------------------------------------------------
    // Bridged methods (called from React Native)

    @ReactMethod
    public void init() {
        if(checkBluetoothEnabled()) {
            startMuseManager();
            startConnectorThread();
        }
    }

    @ReactMethod
    public void getMuses(Promise promise) {
        if(checkBluetoothEnabled()) {
            if (manager == null) {
                startMuseManager();
                startConnectorThread();
            }

            availableMuses = manager.getMuses();
            if (availableMuses.isEmpty()) {
                promise.reject("NO_MUSES", "NO_MUSES");
                return;
            }

            promise.resolve(getWritableMuseList(availableMuses));
        }
        else {
            promise.reject("BLUETOOTH_DISABLED", "BLUETOOTH_DISABLED");
        }

    }

    @ReactMethod
    public void connectToMuseWithIndex(Integer index) {
        museIndex = index;
        connectToMuse();
    }


    @ReactMethod
    public void refreshMuseList() {
        manager.stopListening();
        manager.startListening();
    }

    @ReactMethod
    public void disconnectDevice() {
        if (appState.connectedMuse != null) {
            appState.connectedMuse.disconnect(true);
            appState.connectedMuse.unregisterAllListeners();
        }
    }

    @ReactMethod
    public void cleanUp() {
        stopManager();
        stopConnectorThread();
    }

    //--------------------------------------------------------------
    // Pure Android Methods
    // I've tried my best to keep the most crucial elements for connecting to a Muse in these functions
    // For more info, check out http://developer.choosemuse.com/hardware-firmware/bluetooth-connectivity/developer-sdk-bluetooth-connectivity-2

    // Starts the LibMuse MuseManagerAndroid class and creates a Muse Listener
    public void startMuseManager() {

        // MuseManagerAndroid must be created and given context before any LibMuse calls can be made
        // In a React Native app, we get context through getReactApplicationContext.
        // However, if this was a pure Android app it would be setContext(this)
        manager = MuseManagerAndroid.getInstance();
        manager.setContext(this.getReactApplicationContext());

        // Register a listener to receive notifications of what Muse headbands
        // we can connect to.
        manager.setMuseListener(new MuseL());
        manager.startListening();

    }


    // Creates a ConnectionListener, HandlerThread, and Handler for connecting to Muses
    // Sending connectionAttempts to a HandlerThread is a good idea because they're fundamentally asynchronous
    public void startConnectorThread() {

        if (connectionListener == null) {
            // Register a listener to receive connection state changes.
            connectionListener = new ConnectionListener();
        }

        // Create the HandlerThread that will handle queueing of connection attempts
        connectThread = new HandlerThread("connectThread");
        connectThread.start();
        connectHandler = new Handler(connectThread.getLooper());
    }


    public void connectToMuse() {
        // Queue one Muse search attempt
        connectHandler.post(connectRunnable);
    }


    public void stopManager() {
        if (manager != null) {
            manager.stopListening();
            manager = null;
        }
    }

    public void stopConnectorThread() {
        if (connectHandler != null) {

            // Removes all runnables and things from the Handler
            connectHandler.removeCallbacksAndMessages(null);
            connectThread.quit();
        }
    }



    // ------------------------------------------------------------------------------
    // Runnables

    // Attempts to connect by registering the connection Listener to the muse specified by museIndex
    // and calling runAsynchronously()
    private final Runnable connectRunnable = new Runnable() {
        @Override
        public void run() {
            try {
                muse = availableMuses.get(museIndex);

                // Unregister all prior listeners and register our ConnectionListener to the
                // Muse we are interested in. The ConnectionListener will allow us to detect
                // whether the connection attempt is successful
                muse.unregisterAllListeners();
                muse.registerConnectionListener(connectionListener);

                // Initiate a connection to the headband and stream the data asynchronously.
                // runAsynchronously() handles most of the work to connect to the Muse by itself
                muse.runAsynchronously();

            } catch (IllegalArgumentException | NullPointerException | IndexOutOfBoundsException e) {
                return;
            }
        }
    };


    //--------------------------------------
    // Listeners

    // Detects available headbands and listens for changes to the list of Muses
    class MuseL extends MuseListener {
        String MUSE_LIST_CHANGED = "MUSE_LIST_CHANGED";

        MuseL() {
        }

        @Override
        public void museListChanged() {
            availableMuses = manager.getMuses();

            // Only need to execute this code if in React Native app to send info about available Muses
            sendEvent(MUSE_LIST_CHANGED, getWritableMuseList(availableMuses));


        }
    }

    // Notified whenever connection state of its registered Muse changes
    class ConnectionListener extends MuseConnectionListener {
        String CONNECTION_CHANGED = "CONNECTION_CHANGED";
        WritableMap museMap;

        ConnectionListener() {
        }

        @Override
        public void receiveMuseConnectionPacket(final MuseConnectionPacket p, final Muse muse) {
            final ConnectionState current = p.getCurrentConnectionState();
            if (current == ConnectionState.CONNECTED) {

                // Set connected muse to a Singleton in appState so it can be accessed from anywhere
                appState.connectedMuse = muse;
                cleanUp();

                // Only need to execute this code if in React Native app to send info about connected Muse
                // Creates a Map with connectionStatus and info about the Muse to send to React Native
                museMap = Arguments.createMap();
                museMap.putString("connectionStatus", "CONNECTED");
                museMap.putString("name", muse.getName());
                if (muse.isLowEnergy()) {
                    museMap.putString("model", "2016");
                } else {
                    museMap.putString("model", "2014");
                }
                sendEvent(CONNECTION_CHANGED, museMap);
                return;
            }

            if (current == ConnectionState.DISCONNECTED) {
                museMap = Arguments.createMap();
                museMap.putString("connectionStatus", "DISCONNECTED");
                sendEvent( CONNECTION_CHANGED, museMap);

            }
            if (current == ConnectionState.CONNECTING) {
                museMap = Arguments.createMap();
                museMap.putString("connectionStatus", "CONNECTING");
                sendEvent(CONNECTION_CHANGED, museMap);
            }
        }
    }

    // -----------------------------------------------------------------------------
    // Helper Methods

    // Convenience function to build a WritableArray of Muses to send to React Native
    public WritableArray getWritableMuseList(List<Muse> muses) {
        WritableArray museArray = Arguments.createArray();
        int index = 0;

        for (Muse muse : muses) {
            WritableMap map = Arguments.createMap();
            map.putString("name", muse.getName());
            if (muse.isLowEnergy()) {
                map.putString("model", "2016");
            } else {
                map.putString("model", "2014");
            }
            museArray.pushMap(map);
            index++;
        }

        return museArray;
    }

    public boolean checkBluetoothEnabled() {
        BluetoothAdapter bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        isBluetoothEnabled = bluetoothAdapter.isEnabled();
        return isBluetoothEnabled;
    }
}





