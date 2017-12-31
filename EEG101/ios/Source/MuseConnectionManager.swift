
protocol MuseConnectionManager {
    
    func connectTo(muse: IXNMuse, connectionListener: IXNMuseConnectionListener)
    func disconnect()
    func reconnect()
}

final class MuseConnectionManagerImpl: MuseConnectionManager {
    
    private var connectedMuse: IXNMuse?
    private var connectionListener: IXNMuseConnectionListener?
    
    static let sharedInstance = MuseConnectionManagerImpl()
    
    func connectTo(muse: IXNMuse, connectionListener: IXNMuseConnectionListener) {
        if let connectedMuse = connectedMuse {
            connectedMuse.unregisterAllListeners()
            connectedMuse.disconnect()
        }
        
        self.connectedMuse = muse
        self.connectionListener = connectionListener
        
        muse.unregisterAllListeners()
        muse.register(connectionListener)
        muse.runAsynchronously()
    }
    
    func reconnect() {
        connectedMuse?.runAsynchronously()
    }
    
    func disconnect() {
        connectedMuse?.disconnect()
    }
}
