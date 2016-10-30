# EEG 101

An Interactive EEG tutorial app project to teach EEG and BCI basics.

## Overview

- Built with React Native for Android
- Connects to and streams data from the Muse EEG device
- Takes advantage of the Libmuse Java API
- Presents information about EEG basics (neurobiology -> hardware)

## In Development

- High/Low Pass Filtering
- Artifact Removal
- Feature Extraction
- Brain Waves
- Brain Computer Interfaces
- Machine Learning

## Setup

1. Install and setup React Native from the [Source website](https://facebook.github.io/react-native/docs/getting-started.html). We recommend setting up the [Gradle Daemon](https://docs.gradle.org/2.9/userguide/gradle_daemon.html) as well
2. Import android folder as a new project into Android Studio
3. Run `npm install` to install all necessary node packages
4. Connect Android device with USB debug mode enabled. There can be issues running this app on a virtual device and we recommend real hardware. 
5. run `react-native start` to start React packager
5. In new terminal, `adb reverse tcp:8081 tcp:8081` to ensure debug server is connected to the device and `react-native run-android` to install

## Common setup problems

1. Gradle build error: Attribute "title" has already been defined

- Solution: Changed buildToolsVersion declaration to 24.0.2 in app.gradle [http://stackoverflow.com/questions/39184283/attribute-title-has-already-been-define-when-have-android-plot-dependencies-1]

## Packages used in this project
All libraries are noted in the dependencies section of package.json and will automatically be imported by running "npm install" in the main folder

**lodash**
Provides a host of convenience functions for JS, including isEmpty()

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
