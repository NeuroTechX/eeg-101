<p align="center">
  <img alt="banner" src="/images/EEG101graphic.png/" width="600">
</p>
<p align="center" href="">
  An Interactive EEG tutorial that teaches EEG and BCI basics.
</p>
<p align="center">
  <a href="http://neurotechx.herokuapp.com/">
    <img src="http://neurotechx.herokuapp.com/badge.svg">
  </a>
</p>

## Overview
- Teaches the basics of EEG, including where signals come from, how devices work, and how to process data
- Contains a general purpose binary classifier for EEG data
- Streams data from the Muse with the LibMuse Java API
- Built with React Native for Android
- Completely free, open-source, and available for use/adaption in any project

Find [EEG 101](https://play.google.com/store/apps/details?id=com.eeg_project&hl=en) on the Android Play Store!

## Video Walkthrough

https://www.youtube.com/watch?v=fDQZ5zWVjY0&feature=youtu.be

## Lesson Content
- Neurophysiology of EEG
- EEG hardware
- Filtering
- Epoching
- Artefact Removal
- The Fourier Transform
- The Power Spectral Density Curve
- Brain waves
- Brain-Computer Interfaces
- Machine Learning

## Currently In Development
- iOS version
- UI/UX Tweaks
- Advanced lesson content, including event-related potentials

## How it works

<p align="center">
    <img alt="screens" src="/images/ScreenBanner.png/">
</p>

Our goal with EEG 101 was to create a flexible base for EEG and BCI mobile development that novice programmers can build on top of for multiple platforms with different EEG devices. To satisfy those concerns, we've built the app in React Native, which allows for fast, straight-forward front-end development and the potential to port to iOS, Web, or Desktop (Electron) in the future.  

Currently, EEG 101 is split right down the middle between Java and React. If you're interested in how we [connect to the Muse](https://github.com/NeuroTechX/eeg-101/blob/master/EEG101/android/app/src/main/java/com/eeg_project/components/connector/ConnectorModule.java), [process EEG data](https://github.com/NeuroTechX/eeg-101/tree/master/EEG101/android/app/src/main/java/com/eeg_project/components/signal), and [plot the results](https://github.com/NeuroTechX/eeg-101/blob/master/EEG101/android/app/src/main/java/com/eeg_project/components/graphs/EEGGraph.java) in real time, check out the graph and signal classes in the android source folders. Our implementations are all (for the most part) typical Android components written in Java.

If you'd like to use EEG 101 as a base for your own app in React Native, take a look at how we've written the tutorial in the src folder. Connecting to a Muse and plotting real-time EEG data is as simple as using one of the Native components we have already prepared.

## Setup

1. Install and setup [React Native](https://facebook.github.io/react-native/docs/getting-started.html). Note: EEG 101 uses lots of native code, so create-react-native-app and Expo are not an option. Follow the instructions for "Building Apps with Native Code." You may also need to install the [JDK](https://www3.ntu.edu.sg/home/ehchua/programming/howto/JDK_Howto.html), [Node](https://nodejs.org/en/download/package-manager/), [Watchman](https://medium.com/@vonchristian/how-to-setup-watchman-on-ubuntu-16-04-53196cc0227c), and the [Gradle Daemon](https://docs.gradle.org/2.9/userguide/gradle_daemon.html) as well
2. Install [yarn](https://github.com/yarnpkg/yarn)
3. Clone this repo `git clone https://github.com/NeuroTechX/eeg-101.git`
4. Download the LibMuse SDK from [Muse's developer website](http://developer.choosemuse.com/android). We've already taken care of integrating the sdk library into the app, so just make sure you end place libmuse_android.so in `<clonedRepoName>/EEG101/android/app/src/main/jniLib/armeabi-v7a/` and libmuse_android.jar in `<clonedRepoName/EEG101/android/app/libs/`
5. run `yarn install` in the EEG101 folder
6. Connect an Android device with USB debug mode enabled. Because the LibMuse library depends on an ARM architecture, EEG 101 will not build in an emulator
7. Run `react-native start` to start React packager
8. In new terminal, run `adb reverse tcp:8081 tcp:8081` to ensure debug server is connected to your device and then `react-native run-android` to install EEG 101

## Common setup problems

1. Gradle build error: Attribute "title" has already been defined

- Solution: Make sure build tools is using latest version in in app/build.gradle (ie. 25.0.1) [http://stackoverflow.com/questions/39184283/attribute-title-has-already-been-define-when-have-android-plot-dependencies-1]

2. INSTALL_FAILED_UPDATE_INCOMPATIBLE: Package com.eeg_project signatures do not match the previously installed version; ignoring!

- Solution: Uninstall any pre-existing versions of the app on your device

3. Could not connect to development server

- Solution: Make sure that the device is connected, run `adb reverse tcp:8081 tcp:8081`, and restart the React packager (`react-native-start`)

4. Could not get BatchedBridge

- Solution: Run `adb reverse tcp:8081 tcp:8081` again and reload

 5. Error retrieving parent for item: No resource found that matches the given name 'android:TextAppearance.Material.Widget.Button.Borderless.Colored'

 - Solution: Make sure [compileSdkVersion and appcompat match](http://stackoverflow.com/questions/32075498/error-retrieving-parent-for-item-no-resource-found-that-matches-the-given-name) in in app build.gradle
