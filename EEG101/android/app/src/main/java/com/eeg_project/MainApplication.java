package com.eeg_project;

import android.app.Application;

import com.choosemuse.libmuse.Muse;
import com.eeg_project.components.emitter.AppNativeEventEmitter;
import com.facebook.react.ReactApplication;
import com.airbnb.android.react.lottie.LottiePackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.cubicphuse.RCTTorch.RCTTorchPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
// Prevents react-native-svg issue #135
import com.horcrux.svg.SvgPackage;

import java.util.Arrays;
import java.util.List;


public class MainApplication extends Application implements ReactApplication {

  // Global singleton Muse
  public static Muse connectedMuse;

  // Global singleton event emitter
  public static AppNativeEventEmitter eventEmitter;

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return com.eeg_project.BuildConfig.DEBUG;
    }

    // All packages for native libraries must be added to the array returned by this method
    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new LottiePackage(),
            new RNI18nPackage(),
          new RCTTorchPackage(),
          new SvgPackage(),
          new EEGPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
      return mReactNativeHost;
  }

  }


