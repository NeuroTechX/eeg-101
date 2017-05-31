import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import argparse
import sys

# Calculates sampling rate and plots 4 channel specgram of EEG data.csv passed in as in command line arg

eegData = pd.read_csv(sys.argv[1])
#eegData = pd.read_csv('Filtered_EEG3.csv')
time = (eegData['Timestamp (ms)'][eegData.shape[0] - 1] - eegData['Timestamp (ms)'][0]) / 1000
samples = eegData.shape[0] - 1
samplingRate = samples/time
print('estimated sampling rate: ',  samplingRate)


plt.figure()
plt.subplot(2,2,1)
plt.psd(eegData['Electrode 1'], Fs=samplingRate)
plt.xlim(0,65)
plt.ylim(-60,20)

plt.subplot(2,2,2)
plt.psd(eegData['Electrode 2'], Fs=samplingRate)
plt.xlim(0,65)
plt.ylim(-60,20)
plt.ylabel('')

plt.subplot(2,2,3)
plt.psd(eegData['Electrode 3'], Fs=samplingRate)
plt.xlim(0,65)
plt.ylim(-60,20)
plt.ylabel('')

plt.subplot(2,2,4)
plt.psd(eegData['Electrode 4'], Fs=samplingRate)
plt.xlim(0,65)
plt.ylim(-60,20)
plt.ylabel('')
plt.show()
