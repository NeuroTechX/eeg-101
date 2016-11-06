package com.eeg_project.components.connector;

import android.app.Activity;
import android.support.annotation.Nullable;

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

    // Tag used for logging purposes
    private final String TAG = "EEG 101";

    // The Muse manager detects available headbands and listens for changes to the list of Muses
    private MuseManagerAndroid manager;

    // The connection listener will be notified whenever the connection state of its registered
    // Muse changes
    private ConnectionListener connectionListener;

    /** Initializes the MainApplication content so that the connectedMuse object stored within it
     * can be referenced.
     * Because this is a ReactContextBaseJavaModule, getCurrentActivity is called first to be able to
     * call getApplication. We may have to be careful with this however, as the React Native documentation advises against holding
     * references to getCurrentActivity return value as member variables
     */
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
    public void startConnector() {

        // We need to set the context on MuseManagerAndroid before we can do anything.
        // This must come before other LibMuse API calls as it also loads the library.
        manager = MuseManagerAndroid.getInstance();
        manager.setContext(this.getReactApplicationContext());

        // Clear the list of available muses so the user sees an empty list of devices when starting
        availableMuses = null;

        appState = ((MainApplication)this.getCurrentActivity().getApplication());



        // Todo: figure out if weakReference is necessary or desirable. get currentActivity might be good enough
        WeakReference<Activity> weakActivity =
                new WeakReference<Activity> (this.getCurrentActivity());

        // Register a listener to receive connection state changes.
        connectionListener = new ConnectionListener(weakActivity);

        // Register a listener to receive notifications of what Muse headbands
        // we can connect to.
        manager.setMuseListener(new MuseL(weakActivity));

        manager.startListening();
            }

    // Returns
    @ReactMethod
    public void getDevices(Promise promise) {

        if (manager == null) {
            // We need to set the context on MuseManagerAndroid before we can do anything.
            // This must come before other LibMuse API calls as it also loads the library.
            manager = MuseManagerAndroid.getInstance();
            manager.setContext(this.getReactApplicationContext());

            // Clear the list of available muses so the user sees an empty list of devices when starting
            availableMuses = null;

            // Declare global application reference that is used for storing global Muse object
            appState = ((MainApplication)this.getCurrentActivity().getApplication());

            // Todo: figure out if weakReference is necessary or desirable. get currentActivity might be good enough
            WeakReference<Activity> weakActivity =
                    new WeakReference<Activity> (this.getCurrentActivity());

            // Create a new listener that will be registered to receive connection state changes in connectDevice.
            connectionListener = new ConnectionListener(weakActivity);

            // Register a listener to receive notifications of what Muse headbands
            // we can connect to.
            manager.setMuseListener(new MuseL(weakActivity));
            manager.startListening();
        }
        // Create WriteableArray that can be passed to JS
        // Change from ReadableMap to ReadableArray containing ReadableMaps
        WritableArray availableMuseArray = Arguments.createArray();

        availableMuses = manager.getMuses();

        try {
            // Add the name of each available Muse to an array that will be passed to JS
            for (Muse muse : availableMuses) {
                // key = MAC address, value = Muse Name
                availableMuseArray.pushString(muse.getName());
            }
            promise.resolve(availableMuseArray);
        } catch (IllegalViewOperationException e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void connectDevice(Promise promise) {
        connectionPromise = promise;
        unfulfilledPromise = true;

        // If availableMuses list is empty
        if (availableMuses == null || availableMuses.size() == 0)  {

            return;
        }

        // set global Muse to first muse in availableMuses list
        appState.connectedMuse = availableMuses.get(0);

        // Unregister all prior listeners and register our data listener to
        // receive the MuseDataPacketTypes we are interested in.  If you do
        // not register a listener for a particular data type, you will not
        // receive data packets of that type.
        try {
            appState.connectedMuse.unregisterAllListeners();
            appState.connectedMuse.registerConnectionListener(connectionListener);
            manager.stopListening();

            // Initiate a connection to the headband and stream the data asynchronously.
            // runAsynchronously() bridges to a C++ function that is implemented on the Muse
            appState.connectedMuse.runAsynchronously();
        } catch (IllegalArgumentException | NullPointerException e) {

            connectionPromise.reject(e);
//            Toast.makeText(getCurrentActivity(), "No available muses", Toast.LENGTH_SHORT).show();
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

    //--------------------------------------
    // Listeners
    // Each of these classes extend from the appropriate listener and contain a weak reference
    // to the activity.  Each class simply forwards the messages it receives back to the Activity.
    class MuseL extends MuseListener {
        final WeakReference<Activity> activityRef;

        MuseL(final WeakReference<Activity> activityRef) {
            this.activityRef = activityRef;
        }

        @Override
        public void museListChanged() {
        }
    }

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
                        unfulfilledPromise = false;
                    }
                }

                // If listener detects disconnected state while their is not unfulfilled promise,
                // an event should be dispatched to JS to return user to connection screen
                if (current == ConnectionState.DISCONNECTED) {
                    sendEvent(getReactApplicationContext(), "DISCONNECTED", Arguments.createMap());
                    if (unfulfilledPromise){
                        connectionPromise.resolve(false);
                        unfulfilledPromise = false;
                    }
                }

        }
    }
}




