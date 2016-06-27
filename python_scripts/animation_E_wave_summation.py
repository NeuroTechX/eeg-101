# -*- coding: utf-8 -*-

import numpy as np
from scipy import signal

import matplotlib.pylab as plt

# Animation E: Depicting wave summation into a complex signal

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

def animateSignals(nbSignals, incre, fs=256, refreshRate=30., animDur=10.):
    """
    Draw and update a figure in real-time representing the summation of many 
    sine waves, to explain the concept of Fourier decomposition.
    
    INPUTS
     nbSignals    : number of signals to sum together
     incre        : increment, in Hz, between each of the signals
     fs           : sampling frequency
     refreshRate  : refresh rate of the animation
     animDur      : approximate duration of the animation, in seconds
    """
    
    # Initialize values that remain constant throughout the animation
    A = 1
    t = np.linspace(0, 2, fs)
    offsets = np.arange(nbSignals+1).reshape((nbSignals+1,1))*(A*(nbSignals+1))
    freqs = np.arange(nbSignals)*incre
        
    # Initialize the figure
    fig, ax = plt.subplots(1, 1)
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
    for i in np.arange(animDur*refreshRate):     
        
        # Update time
        t = np.linspace(0, 2, fs) + i*fs/refreshRate
        
        # Update signals
        sines = np.array([sinewave(A, f, 0, t) for f in freqs])
        sines = np.vstack((sines, np.sum(sines, axis=0))) + offsets
    
        # Update figure
        for p, x in zip(points, sines):
            p.set_ydata(x)
        
        # Wait before starting another cycle
        plt.pause(1./refreshRate)

if __name__ == '__main__':
        
    animateSignals(4, 2)