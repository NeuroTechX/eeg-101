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
    }
    
    /// Updates the 2D buffer array with the 1D newData array at the current index.
    /// When index reaches the bufferLength it returns to 0.
    func update(with newData: [Double]) {
        for i in 0..<nbCh {
            buffer[index][i] = newData[i]
        }
        index = (index + 1) % bufferLength
        pts += 1
    }
    
    /// Extracts an array containing the last nbSamples from the buffer.
    /// If the loop that fills the extracted samples encounters the beginning of the buffer, it will begin to take samples from the end of the buffer
    func extract(sampleCount: Int) -> [[Double]] {
        var extractedArray = [[Double]]()
        
        for i in 0..<sampleCount {
            let extractIndex = (index - sampleCount + i) % bufferLength
            for j in 0..<nbCh {
                extractedArray[i][j] = buffer[extractIndex][j]
            }
        }
        return extractedArray
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
        var extractedArray = [[Double]]()
        for c in 0..<nbCh {
            for i in 0..<sampleCount {
                let extractIndex = (index - sampleCount + i) % bufferLength
                extractedArray[c][i] = buffer[extractIndex][c]
            }
        }
        return extractedArray
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
        var extractedArray = [Double]()
        for i in 0..<sampleCount {
            let extractIndex = (index - sampleCount + i) % bufferLength
            extractedArray[i] = buffer[extractIndex][channelofinterest]
        }
        return extractedArray
    }
    
    func resetPts() {
        pts = 0
    }
    
    func clear() {
        index = 0
        pts = 0
        buffer = [[Double]]()
    }
}
