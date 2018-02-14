import Foundation

protocol BufferListener {
    func getEpoch(buffer: [[Double]])
}

class EpochBuffer: CircularBuffer {
    private let epochInterval: Int
    private var listeners: [BufferListener]
    
    init(bufferLength: Int, nChannels: Int, epochInterval: Int) {
        self.epochInterval = epochInterval
        self.listeners = [BufferListener]()
        
        super.init(bufferLength: bufferLength, nChannels: nChannels)
    }
    
    func addListener(_ listener: BufferListener) {
        listeners.append(listener)
    }
    
    override func update(with newData: [Double]) {
        super.update(with: newData)
        
        let extraction = extractTransposed(sampleCount: bufferLength)
        listeners.forEach {
            $0.getEpoch(buffer: extraction)
        }
    }
}
