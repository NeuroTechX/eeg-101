package com.eeg_project.components.connector;

import android.os.Handler;
import android.os.HandlerThread;
import android.support.annotation.Nullable;

import com.choosemuse.libmuse.ConnectionState;
import com.choosemuse.libmuse.Muse;
import com.choosemuse.libmuse.MuseConnectionListener;
import com.choosemuse.libmuse.MuseConnectionPacket;
import com.choosemuse.libmuse.MuseListener;
import com.choosemuse.libmuse.MuseManagerAndroid;
import com.eeg_project.MainApplication;
import com.eeg_project.components.signal.NoiseDetector;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.List;

/*
Handles connecting to Muses with LibMuse functions.
Calling getAndConnectToDevice from JS handles entire connection process.

Connection process:
1. Creates a MuseManager and a MuseListener which detects available Muses
2. Creates a HandlerThread which will host searchRunnable and connectRunnable tasks syncronously
3. Checks for available muses (searchRunnable) and returns NO_MUSES promise if none
4. Attempts to connect to Muse (connectRunnable) with a connection listener and runAsynchronous
5. On successful connection, returns CONNECT promise
6. On unsuccessful connection, attempts connecting to next Muse in list availableMuses
7. If no muses can be connected to, repeats steps 3-6 a max of 4 times
*/
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
        connectionPromise = promise;
        isPromiseUnfulfilled = true;

        if (manager == null) {
            startMuseManager();
        }

        // Connection and Muse search attempts are queued to a HandlerThread to handle synchrony
        connectThread = new HandlerThread("connectThread");
        connectThread.start();
        connectHandler = new Handler(connectThread.getLooper());

        // Queue one Muse search attempt
        connectHandler.post(searchRunnable);

        // Start connection attempts
        connectToMuse();
        }

    //--------------------------------------------------------------
    // Internal methods

    // Starts the LibMuse MuseManagerAndroid class and creates a Muse Listener
    public void startMuseManager() {
        // MuseManagerAndroid must be created and given context before any LibMuse calls can be made
        manager = MuseManagerAndroid.getInstance();
        manager.setContext(this.getReactApplicationContext());
        // Listeners are attached to a weak reference to the current activity to avoid memory leaks

        manager.setMuseListener(new MuseL());
        manager.startListening();
    }

    // Stops an ongoing getAndConnectToDevice function if no Muses are found
    public void noMusesDetected() {
        sendEvent(getReactApplicationContext(), "NO_MUSES", Arguments.createMap());
        stopConnector();
        connectionPromise.resolve(false);
    }

    // Posts a connectRunnable to connectHandler
    public void connectToMuse() {
        // Post is delayed to allow previous runAsynchrounously calls to complete
        connectHandler.postDelayed(connectRunnable, 100);
    }

    // Resolves getAndConnectToDevice promise and registers persistent connection listener
    public void museConnected() {
        connectionPromise.resolve(true);
        appState.connectedMuse = muse;
        stopConnector();

        // Connected Muses are stored in the MainApplication context so they can be accessed from anywhere in the app.
        appState = ((MainApplication)this.getCurrentActivity().getApplication());

        // Register connectionListener that will persist to handle disconnects
        // TODO: consider putting this on another thread or in a service
        connectionListener = new ConnectionListener();
        appState.connectedMuse.registerConnectionListener(connectionListener);

        // Create a persistent NoiseDetector class that can be used for SignalQualityIndicator
        NoiseDetector noiseDetector = new NoiseDetector(600, getReactApplicationContext());

        stopConnector();

    }

    // ------------------------------------------------------------------------------
    // Runnables

    // Searches for available Muses and puts app in NO_MUSE state if none are detected
    private final Runnable searchRunnable = new Runnable() {
        @Override
        public void run() {
            try {
                sendEvent(getReactApplicationContext(), "DISCONNECTED", Arguments.createMap());
                Thread.sleep(1500);
                availableMuses = manager.getMuses();

                if (availableMuses.isEmpty() || tryCount >= 4) {
                    noMusesDetected();
                }
            } catch ( InterruptedException e) { }
        }
    };

    // Attempts to connect by registering a connection Listener and calling runAsynchronously()
    private final Runnable connectRunnable = new Runnable() {
        @Override
        public void run() {
            try {
                sendEvent(getReactApplicationContext(), "CONNECT_ATTEMPT", Arguments.createMap());
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

    @ReactMethod
    // Stops all threads, managers, handlers, and listeners created in this module
    // Bridged so that it can be called from JS when user changes scenes
    public void stopConnector() {
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
            if (current == ConnectionState.CONNECTED) {
                sendEvent(getReactApplicationContext(), "CONNECTED", Arguments.createMap());
                if (isPromiseUnfulfilled){
                    museConnected();
                    return;
                }
            }

            // If persistent connectionListener detects disconnected state while there is no
            // unfulfilled promise (not in the midst of connection attempts), an event should be
            // dispatched to JS to prompt a return to the connection scene
            if (current == ConnectionState.DISCONNECTED) {
                sendEvent(getReactApplicationContext(), "DISCONNECTED", Arguments.createMap());

                // If disconnection is detected in midst of connection attempts (failure),
                // unregister all listeners, increment the index and try again with the next Muse.
                // If none of the Muses in availableMuses work, queue another search attempt, start
                // from the beginning and try again
                if (isPromiseUnfulfilled){
                    muse.unregisterAllListeners();
                    museIndex++;
                    tryCount++;
                    if(museIndex < availableMuses.size()) {
                        connectToMuse();
                    } else {
                        museIndex = 0;
                        connectHandler.post(searchRunnable);
                        connectToMuse();
                    }
                }
            }
        }
    }
}




