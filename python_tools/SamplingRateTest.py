import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import argparse
import sys

# Calculates sampling rate and plots 4 channel specgram of EEG data.csv passed in as in command line arg

eegData = pd.read_csv(sys.argv[1])
time = (eegData['Timestamp (ms)'][eegData.shape[0] - 1] - eegData['Timestamp (ms)'][0]) / 1000
samples = eegData.shape[0] - 1
samplingRate = samples/time
print('estimated sampling rate: ',  samplingRate)
plt.figure()



plt.subplot(2,2,1)
plt.specgram(eegData['Electrode 1'], Fs=samplingRate, interpolation='bilinear', noverlap=198)
plt.ylim(0,65)

plt.subplot(2,2,2)
plt.specgram(eegData['Electrode 2'], Fs=samplingRate, interpolation='bilinear', noverlap=198)
plt.ylim(0,65)

plt.subplot(2,2,3)
plt.specgram(eegData['Electrode 3'], Fs=samplingRate, interpolation='bilinear', noverlap=198)
plt.ylim(0,65)

plt.subplot(2,2,4)
plt.specgram(eegData['Electrode 4'], Fs=samplingRate, interpolation='bilinear', noverlap=198)
plt.ylim(0,65)

plt.show()
