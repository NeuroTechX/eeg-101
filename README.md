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
- Teaches the very basics of EEG, including where signals come from, how EEG devices work, and how to process EEG data
- Streams data from the Muse with LibMuse Java API
- Built with React Native for Android
- Completely free, open-source, and available for use/adaption in any project

Find [EEG 101](https://play.google.com/store/apps/details?id=com.eeg_project&hl=en) on the Android Play Store!

## Video Walkthrough

https://www.youtube.com/watch?v=GunGP1yrqM8&feature=youtu.be

## Currently In Development
- Offline mode
- iOS version
- Advanced lesson content ([Riemannian Potato](http://alexandre.barachant.org/papers/conferences/potato/))

## How it works

<p align="center">
    <img alt="screens" src="/images/ScreenBanner.png/">
</p>

Our goal with EEG 101 was to create a flexible base for EEG and BCI mobile development that novice programmers could build on top of, and could be adapted to work on multiple platforms with different EEG devices. To satisfy those concerns, we've built the app in React Native, which allows for fast, straight-forward front-end development and the promise of an easy port to iOS in the future (hopefully).  

EEG 101 is split right down the middle between Java and React. If you're interested in how we communicate with the Muse, process EEG data, and plot the results in real time, check out the graph and signal classes in the android source folders. Our implementations are all (for the most part) typical Android components written in Java.

If you'd like to use EEG 101 as a base for your own React Native app, take a look at how we've written the tutorial in the src folder. Connecting to a Muse and plotting real-time EEG data is as simple as using one of the React components we have already defined.

## Setup

1. Install and setup [React Native](https://facebook.github.io/react-native/docs/getting-started.html). This may involve also installing the [JDK](https://www3.ntu.edu.sg/home/ehchua/programming/howto/JDK_Howto.html), [Node](https://nodejs.org/en/download/package-manager/), [Watchman](https://medium.com/@vonchristian/how-to-setup-watchman-on-ubuntu-16-04-53196cc0227c), and the [Gradle Daemon](https://docs.gradle.org/2.9/userguide/gradle_daemon.html) as well
2. Install [yarn](https://github.com/yarnpkg/yarn)
3. Clone this repo `git clone https://github.com/NeuroTechX/eeg-101.git`
4. run `yarn install` in the EEG101 folder
5. Connect an Android device with USB debug mode enabled. There can be issues running this app on a virtual device and we recommend real hardware.
6. Run `react-native start` to start React packager
7. In new terminal, run `adb reverse tcp:8081 tcp:8081` to ensure debug server is connected to your device and then `react-native run-android` to install EEG 101

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
