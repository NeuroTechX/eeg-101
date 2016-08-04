"""
Utilities for plotting various figures and animations in EEG101.

"""

# Author: Hubert Banville <hubert@neurotechx.com>
#
# License: TBD

import numpy as np
import matplotlib.pylab as plt
import collections
from scipy import signal


def dot_plot(x, labels, step=1, figsize=(12,8)):
    """
    Make a 1D dot plot.
    
    Inputs
     x      : 1D array containing the points to plot
     labels : 1D array containing the label for each point in x
     step   : vertical space between two points
     
    """
    
    # Get the histogram for each class
    classes = np.unique(labels)
    hist = [np.histogram(x[labels==c], density=True) for c in classes]
    
    # Prepare the figure
    fig, ax = plt.subplots(figsize=figsize)
    for hi, h in enumerate(hist):
        bin_centers = (h[1][1:] + h[1][0:-1])/2. # Get bin centers
        
        # Format the data so that each bin has as many points as the histogram bar for that bin
        x1 = []
        y1 = []
        for i, j in zip(np.round(h[0]).astype(int), bin_centers):
            y = range(0, i, step)
            y1 += y
            x1 += [j]*len(y)
            
        # Plot
        ax.plot(x1, (-1)**hi*np.array(y1), 'o', markersize=10, label=classes[hi])
        ax.legend(scatterpoints=1)
        ax.set_xlabel('Alpha power')
        ax.set_ylabel('Number of points')
                
    ax.set_yticklabels([])
    ax.set_yticks([])
    ax.legend()
    plt.tight_layout()
    
    
def psd_with_bands_plot(f, psd, figsize=(12,8)):
    """
    Plot a static PSD.
    
    INPUTS
     f       : 1D array containing frequencies of the PSD
     psd     : 1D array containing the power at each frequency in f
     figsize : figure size
     
    """
    
    bands = collections.OrderedDict()
    bands[r'$\delta$'] = (0,4)
    bands[r'$\theta$'] = (4,8)
    bands[r'$\alpha$'] = (8,13)
    bands[r'$\beta$'] = (13, 30)
    bands[r'$\gamma$'] = (30, 120)
    
    fig, ax = plt.subplots(figsize=figsize)
    ax.plot(f, psd)
    ax.set_xlabel('Frequency (Hz)')
    ax.set_ylabel('Power (dB)')
    ylim = ax.get_ylim()
        
    for i, [bkey, bfreq] in enumerate(bands.iteritems()):
        ind = (f>=bfreq[0]) & (f<=bfreq[1])
        f1 = f[ind]
        y1 = psd[ind]
        ax.fill_between(f1, y1, ylim[0], facecolor=[(0.7, i/5., 0.7)], alpha=0.5)
        ax.text(np.mean(f1), (ylim[0] + ylim[1])/1.22, bkey, fontsize=16, verticalalignment='top', horizontalalignment='center')
        
    ax.set_xlim([min(f), max(f)])
    
    
def sinewave(A, f, phi, t):
    """
    Return a sine wave with specified parameters at the given time points.
    
    INPUTS
     A   : Amplitude
     f   : Frequency (Hz)
     phi : Phase (rad)
     t   : time (in s)
    """
    
    return A*np.sin(2*np.pi*f*t + phi)


def animate_signals(nb_signals, incre, fs=256, refresh_rate=30., anim_dur=10., figsize=(12,8)):
    """
    Draw and update a figure in real-time representing the summation of many 
    sine waves, to explain the concept of Fourier decomposition.
    
    INPUTS
     nb_signals   : number of signals to sum together
     incre        : increment, in Hz, between each of the signals
     fs           : sampling frequency
     refresh_rate : refresh rate of the animation
     anim_dur     : approximate duration of the animation, in seconds
    """
    
    # Initialize values that remain constant throughout the animation
    A = 1
    t = np.linspace(0, 2, fs)
    offsets = np.arange(nb_signals+1).reshape((nb_signals+1,1))*(A*(nb_signals+1))
    freqs = np.arange(nb_signals)*incre
        
    # Initialize the figure
    fig, ax = plt.subplots(figsize=figsize)
    ax.hold(True)
    plt.xlabel('Time')
    ax.yaxis.set_ticks(offsets)
    ax.set_yticklabels([str(f)+' Hz' for f in freqs] + ['Sum'])
    ax.xaxis.set_ticks([]) 
    
    # Initialize the Line2D elements for each signal
    sines = np.array([sinewave(A, f, 0, t) for f in freqs])
    sines = np.vstack((sines, np.sum(sines, axis=0))) + offsets
    points = [ax.plot(t, x)[0] for x in sines]

    # Animation refresh loop
    for i in np.arange(anim_dur*refresh_rate):     
        
        # Update time
        t = np.linspace(0, 2, fs) + i*fs/refresh_rate
        
        # Update signals
        sines = np.array([sinewave(A, f, 0, t) for f in freqs])
        sines = np.vstack((sines, np.sum(sines, axis=0))) + offsets
    
        # Update figure
        for p, x in zip(points, sines):
            p.set_ydata(x)
        
        # Wait before starting another cycle
        plt.pause(1./refresh_rate)
        
    
if __name__ == '__main__':
    
    # 1) DISTRIBUTION OF TRAINING DATA
    # Generate fake data
    nb_points = 10*10
    relax_data = np.random.normal(0.01, 0.01, size=(nb_points,))
    focus_data = np.random.normal(0.03, 0.01, size=(nb_points,))
    
    dot_plot(x=np.concatenate((relax_data, focus_data)), 
             labels=np.concatenate((np.zeros((nb_points,)), np.ones((nb_points,)))),
             step=4)
    
    # 2) PSD PLOT
    # Generate fake data
    f = np.arange(0, 110, 1) # one-second windows = 1-Hz bins
    psd = 10*np.log10(1./f)
    
    psd_with_bands_plot(f, psd)
    
    # 3) FOURIER DECOMPOSITION ANIMATION
    animate_signals(4, 2)