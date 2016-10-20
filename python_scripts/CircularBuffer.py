class CircBuffer:
    """
    Circular buffer for multi-channel 1D or 2D signals (could 
    be increased to arbitrary number of dimensions easily).

    The indexing syntax of numpy lets us extract data from all 
    trailing dimensions (e.g. x[0,2] = x[0,2,:]). This makes it 
    easy to add dimensions.

    INPUTS
     n : length of buffer (number of samples)
     m : number of channels

    """

    def __init__(self, n, m, p=[]):
        self.n = int(n)
        self.m = int(m)

        if p:
            self.p = int(p)
            self.buffer = np.zeros((self.n, self.m, self.p))
            self.noise = np.zeros((self.n, self.m, self.p))
        else:
            self.buffer = np.zeros((self.n, self.m))
            self.noise = np.zeros((self.n, self.m))

        self.ind = 0
        self.pts = 0

    def update(self, x):
        # Shift the buffer and add the new data at the beginning
        # shape of incoming data in the row dimension (number of samples)
        nw = x.shape[0]
        # Determines index at which new values should be put into array
        ind = np.arange(self.ind, self.ind + nw, dtype=np.int16) % self.n
        # Adds new data at new index location
        self.buffer[ind, :] = x
        # Sets self.ind = to the index at which new locations were put. Seeperately defined here to allow new data to be
        # an array rather than just one row
        self.ind = (ind[-1] + 1) % self.n
        # pts updates everytime data is updated to keep track of how many points have been added since some event (usually data procesing)
        self.pts += nw

    def extract(self, nw): #nw = how many points you want to take out of your buffer
        # ind = the last 'nw' points from the array
        ind = np.arange(self.ind - nw, self.ind, dtype=np.int16) % self.n
        return self.buffer[ind, :]

    # Bonus function for artifact detection
    # Keeps another boolean (or zeros and 1s) array of the same size as circular buffer.
    # Marks 0 whne data is good and 1 when noise is present 
    # Easiest way to do this would probably be to compute variance of signal over 1s epochs
    # If it's more than a certain threshold, mark as noise
    def mark_noise(self, nw, noise):
        ind = np.arange(self.ind - nw, self.ind, dtype=np.int16) % self.n
        self.noise[ind,:] = noise