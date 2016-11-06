# Contributing

Contributions are always welcome, no matter how small.

## Where to start

If you're new to Git and want to learn how to fork this repo, make your own additions, and include those additions in the master version of this project, check out this [great tutorial](http://blog.davidecoppola.com/2016/11/howto-contribute-to-open-source-project-on-github/).


## Community 

This project is maintained by the [NeuroTechX](www.neurotechx.com) community. Join our Slack to check out our #interactive-tutorial channel, where discussions about EEG101 take place.

## What needs to be done

### Data

The app's next incarnation will feature several key signal processing algorithms implemented in Java for Android. We need help doing this!

We are hoping to implement versions of the following algorithms for use in EEG 101 and other open source EEG projects:
- High and low pass Butterworth filter ([Butterworth Filter in Mines JAVA Toolkit](http://dhale.github.io/jtk/api/edu/mines/jtk/dsp/ButterworthFilter.html)) 
- Fast Fourier Transform ([MATLAB Implementation from Douglas Jones at University of Illinois](https://courses.engr.illinois.edu/ece410/documents/fft.pdf))
- Artifact removal (Simple threshold detection of high amplitude spikes)

Note: the CircularBufferGraph class provides a dynamically updating EEG plot with a circular buffer stored as eegBuffer. Algorithms should be implemented in seperate Java classes such that calls can be made in the historyDataSource runnable (ie. FastFourierTransform.fft(...)).

### Science

Know something about EEG that you think should be included? Think we got some of our facts wrong? Let us know!

