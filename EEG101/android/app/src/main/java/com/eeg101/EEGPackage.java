package com.eeg101;


import com.eeg101.components.EEGGraph.GraphManager;
import com.eeg101.components.connector.ConnectorModule;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class EEGPackage implements ReactPackage {
	@Override
	// Register Native Modules to JS
	public List<NativeModule> createNativeModules(ReactApplicationContext reactApplicationContext) {
		return Arrays.<NativeModule>asList(
				new ConnectorModule(reactApplicationContext)
		);
	}

	@Override
	public List<Class<? extends JavaScriptModule>> createJSModules() {
		return Collections.emptyList();
	}

	@Override
	// Registers Java ViewManagers to JS
	public List<ViewManager> createViewManagers(ReactApplicationContext reactApplicationContext) {
		return Arrays.<ViewManager>asList(
				new GraphManager()
		);
	}
}
