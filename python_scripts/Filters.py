import numpy as np
import scipy.signal as signal

class Filter:
    def __init__(self, fs, filter_type):

        self.filter_type = filter_type # Of two types. Alpha and Bandpass
        self.fs = fs # sample frequency: 220hz
        
        if self.filter_type == 'alpha':
            # butter = butterworth filter function
            # An optimal (in one way -- smoothness) for designing a filter. Simple and popular.
            # signal.butter is from scipy. Is there an equivalent in Java? Could be developed in Python and copied
            # and pasted into Java. The values of these arrays is really only dependent on sampling frequency and thus
            # likely to be the same for all uses of the app
            # Returns two arrays of floats. Could b
            self.b, self.a = signal.butter(5# order of filter. More coefficients = better filtration at cost of speed
                , np.array([8.,12.])# boundaries of filter (8-12hz for Alpha
                /(self.fs/2.) # /2 because this function needs normalized frequency
                , 'bandpass')
        elif self.filter_type == 'bandpass':
            self.b, self.a = signal.butter(5, np.array([2., 36.] # bandpass filter has different freq cutoffs
                )/(self.fs/2.), 'bandpass')
        else:
            print('Filter type ''%s'' not supported.'%self.filter_type)
            return

        self.nb = len(self.b)
        self.na = len(self.a)

    def plot_freq_response(self):
        # Visualize frequency response
        w, h = signal.freqz(self.b, self.a)
        fig = plt.figure()
        plt.title(self.filter_type+' filter frequency response')
        plt.plot(w, 20 * np.log10(abs(h)), 'b')
        plt.ylabel('Amplitude [dB]')
        plt.xlabel('Frequency [rad/sample]')

    # This is where filtering happens
    # x = raw data, y = filtered data (starts empty with zeros, but builds up over time)
    def transform(self, x, y):
        # Difference equation. Filter in time domain
        # Compares raw and filtered data and produces a difference array
        # b = coefficient array for raw data
        # a = coefficient array for filtered data
        # (b*x - a*y)/a[0]
        """
        y[n] = (b[0]*x[n] + b[1]*x[n-1] + ... + b[M]*x[n-M]
                      - a[1]*y[n-1] - ... - a[N]*y[n-N])/a[0]
        """
        return ((np.dot(self.b, x) - np.dot(self.a[1:], y))/self.a[0]).reshape((1,-1))