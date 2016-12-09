
<p align="center">
    <img alt="babel" src="/EEG101graphic.png/" width="600">
</p>

# EEG 101

An Interactive EEG tutorial app project to teach EEG and BCI basics.

## Overview

- Built with React Native for Android
- Streams data from the Muse EEG device
- Works with Libmuse Java API
- Presents information about EEG basics (neurobiology -> hardware)

## In Development

- Bandpass filtering
- Dynamic artifact removal
- Feature extraction (Fast FFT)
- Machine learning

## Setup

1. Install and setup React Native from the [Source website](https://facebook.github.io/react-native/docs/getting-started.html). We recommend setting up the [Gradle Daemon](https://docs.gradle.org/2.9/userguide/gradle_daemon.html) as well
2. Import android folder as a new project into Android Studio
3. Run `npm install` to install all necessary node packages (or take a look at [yarn](https://github.com/yarnpkg/yarn) if you want to avoid some headaches)
4. Connect an Android device with USB debug mode enabled. There can be issues running this app on a virtual device and we recommend real hardware. 
5. run `react-native start` to start React packager
5. In new terminal, `adb reverse tcp:8081 tcp:8081` to ensure debug server is connected to the device and `react-native run-android` to install

## Common setup problems

1. Gradle build error: Attribute "title" has already been defined

- Solution: Make sure build tools is using latest version in in app/build.gradle (ie. 25.0.1) [http://stackoverflow.com/questions/39184283/attribute-title-has-already-been-define-when-have-android-plot-dependencies-1]

2. INSTALL_FAILED_UPDATE_INCOMPATIBLE: Package com.eeg_project signatures do not match the previously installed version; ignoring!

- Solution: Uninstall any pre-existing versions of the app on your device

3. Could not connect to development server

- Solution: Make sure that the device is connected, run `adb reverse tcp:8081 tcp:8081`, and restart the React packager (`react-native-start`)

4. Could not get BatchedBridge

- Solution: Run `adb reverse tcp:8081 tcp:8081` again and reload

## JS Packages used in this project
All libraries are noted in the dependencies section of package.json and will automatically be imported by running "npm install" in the main folder

**react**
Standard React library.

**react-native**
Standard React Native Library.

**react-native-router-flux**
Routing package that allows all scenes to be defined in a central location and for transitions to be called anywhere in the app.

**react-redux**
Library containing necessary redux functions such as connect and store

**redux**
Basic redux library

**redux-thunk**
Provides middleware for Redux that improves handling of asynchronous events

## Android packages used in this project
These are especially important for analysing and plotting data

**LibMuse**
Handles all of the connecting to and reading data from the Muse device

**AndroidPlot**
Takes care of plotting incoming EEG data