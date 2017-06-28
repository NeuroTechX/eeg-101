package com.eeg_project;

import android.app.Application;
import android.util.Log;

import com.choosemuse.libmuse.Muse;
import com.facebook.react.BuildConfig;
import com.facebook.react.ReactApplication;
import com.cubicphuse.RCTTorch.RCTTorchPackage;
import com.airbnb.android.react.lottie.LottiePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
// Prevents react-native-svg issue #135
import com.horcrux.svg.SvgPackage;

import java.util.Arrays;
import java.util.List;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;

public class MainApplication extends Application implements ReactApplication {

  // Global singleton Muse
  public static Muse connectedMuse;

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      // Have to hard code this as true because of Gradle issue. May be able to be resolved with upgrade to Android Plugin 3.0
      return true;
    }

    // All packages for native libraries must be added to the array returned by this method
    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new RCTTorchPackage(),
          new LottiePackage(),
          new SvgPackage(),
          new EEGPackage(),
		  new RNI18nPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
      return mReactNativeHost;
  }

  }


