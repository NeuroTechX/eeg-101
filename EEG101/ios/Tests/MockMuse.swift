
@testable import EEG101

class MockMuse: IXNMuse {
    
    private(set) var hasUnregisteredAllListeners = false
    override func unregisterAllListeners() {
        registeredConnectionListener = nil
        hasUnregisteredAllListeners = true
    }
    
    private(set) var hasDisconnected = false
    override func disconnect() {
        hasDisconnected = true
        isRunningAsynchronously = false
    }
    
    private(set) var registeredConnectionListener: IXNMuseConnectionListener? = nil
    override func register(_ listener: IXNMuseConnectionListener?) {
        registeredConnectionListener = listener
    }
    
    private(set) var isRunningAsynchronously = false
    override func runAsynchronously() {
        isRunningAsynchronously = true
    }
}
