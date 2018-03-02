import Foundation

open class CircularBuffer {
    
    let bufferLength: Int
    private let nbCh: Int
    
    private(set) var index: Int
    private(set) var pts: Int
    private var buffer: [[Double]]
    
    init(bufferLength: Int, nChannels: Int) {
        self.bufferLength = bufferLength
        self.nbCh = nChannels
        self.index = 0
        self.pts = 0
        self.buffer = [[Double]]()
        self.buffer.reserveCapacity(bufferLength)
    }
    
    /// Updates the 2D buffer array with the 1D newData array at the current index.
    /// When index reaches the bufferLength it returns to 0.
    func update(with newData: [Double]) {
        if buffer.count < index {
            buffer.append(newData)
        } else {
            buffer[index] = newData
        }
        index = (index + 1) % bufferLength
        pts += 1
    }
    
    /// Extracts an array containing the last nbSamples from the buffer.
    /// If the loop that fills the extracted samples encounters the beginning of the buffer, it will begin to take samples from the end of the buffer
    func extract(sampleCount: Int) -> [[Double]] {
        return (0..<sampleCount).map { i in
            return buffer[(index - sampleCount + i) % bufferLength]
        }
    }
    
    /// Return an array containing the last `nbSamples` collected in
    /// the circular buffer.
    ///
    /// The shape of the returned array is [nbCh, nbSamples].
    ///
    /// This transposed version is useful to avoid additional looping
    /// through the returned array when computing FFT (the looping is
    /// instead done here.)
    func extractTransposed(sampleCount: Int) -> [[Double]] {
        return (0..<nbCh).map { c in
            return (0..<sampleCount).map { i in
                return buffer[(index - sampleCount + i) % bufferLength][c]
            }
        }
    }
    
    /// Return an array containing the last `nbSamples` collected in
    /// the circular buffer.
    ///
    /// The shape of the returned array is [nbSamples].
    ///
    /// This transposed version is useful to avoid additional looping
    /// through the returned array when computing FFT (the looping is
    /// instead done here.)
    func extractSingleChannelTransposed(sampleCount: Int, channelofinterest: Int) -> [Double] {
        return (0..<sampleCount).map { i in
            let extractIndex = (index - sampleCount + i) % bufferLength
            return buffer[extractIndex][channelofinterest]
        }
    }
    
    func resetPts() {
        pts = 0
    }
    
    func clear() {
        index = 0
        pts = 0
        buffer = [[Double]]()
        buffer.reserveCapacity(bufferLength)
    }
}
