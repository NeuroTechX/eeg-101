
import CoreBluetooth
import React

protocol BluetoothManager {
    weak var delegate: CBCentralManagerDelegate? { get set }
    var state: CBManagerState { get }
}

extension CBCentralManager: BluetoothManager {}

protocol MuseManager {
    
    var museListener: IXNMuseListener! { get set }
    
    func getMuses() -> [IXNMuse]
    
    func startListening()
    func stopListening()
}

extension IXNMuseManagerIos: MuseManager {}

@objc(Connector)
final class MuseConnectorModule: NSObject {
    
    private var bluetoothManager: BluetoothManager
    private var isBluetoothEnabled: Bool
    
    private var museManager: MuseManager
    private let connectionManager: MuseConnectionManager
    private let eventEmitter: EventEmitter
    
    convenience override init() {
        self.init(museManager: IXNMuseManagerIos.sharedManager(),
                  connectionManager: MuseConnectionManagerImpl.sharedInstance,
                  eventEmitter: EventEmitterImpl.sharedInstance,
                  bluetoothManager: CBCentralManager())
    }
    
    init(museManager: MuseManager,
         connectionManager: MuseConnectionManager,
         eventEmitter: EventEmitter,
         bluetoothManager: BluetoothManager)
    {
        self.isBluetoothEnabled = false
        self.museManager = museManager
        self.connectionManager = connectionManager
        self.eventEmitter = eventEmitter
        self.bluetoothManager = bluetoothManager
        super.init()
        self.bluetoothManager.delegate = self
    }
    
    @objc
    func getMuses(resolver resolve: RCTPromiseResolveBlock,
                  rejecter reject: RCTPromiseRejectBlock)
    {
        guard isBluetoothEnabled else {
            reject("BLUETOOTH_DISABLED", "BLUETOOTH_DISABLED", nil)
            return
        }
        
        refreshMuseList()
        
        let availableMuses = getAvailableMuseParamList()
        if availableMuses.count > 0 {
            resolve(availableMuses)
        } else {
            reject("NO_MUSES", "NO_MUSES", nil)
        }
    }
    
    @objc func refreshMuseList() {
        museManager.stopListening()
        museManager.museListener = self
        museManager.startListening()
    }
    
    @objc func connectToMuse(index: Int) {
        connectionManager.connectTo(muse: museManager.getMuses()[index],
                                    connectionListener: self)
    }
    
    fileprivate func getAvailableMuseParamList() -> [[String : String]] {
        return museManager.getMuses().map { getMuseParams(muse: $0) }
    }
    
    fileprivate func getMuseParams(muse: IXNMuse) -> [String : String] {
        return [
            "name" : muse.getName(),
            "model" : muse.isLowEnergy() ? "2016" : "2014"
        ]
    }
}


// MARK: - CBCentralManagerDelegate
extension MuseConnectorModule: CBCentralManagerDelegate {
    func centralManagerDidUpdateState(_ central: CBCentralManager) {
        isBluetoothEnabled = self.bluetoothManager.state == .poweredOn
    }
}


// MARK: - IXNMuseConnectionListener
extension MuseConnectorModule: IXNMuseConnectionListener {
    
    func receive(_ packet: IXNMuseConnectionPacket, muse: IXNMuse?) {
        
        switch packet.currentConnectionState {
        case .connecting:
            sendConnectionEvent(connectionStatus: "CONNECTING")
            
        case .connected:
            sendConnectionEvent(connectionStatus: "CONNECTED",
                                moreParams: getMuseParams(muse: muse!))
            
        case .disconnected:
            sendConnectionEvent(connectionStatus: "DISCONNECTED")
            
        default:
            break;
        }
    }
    
    private func sendConnectionEvent(connectionStatus: String, moreParams: [String : String]? = nil) {
       
        var bodyParams = moreParams ?? [:]
        bodyParams["connectionStatus"] = connectionStatus
        
        eventEmitter.sendEvent(.connectionChanged, body: bodyParams)
    }
}

// MARK: - IXNMuseListener
extension MuseConnectorModule: IXNMuseListener {
    func museListChanged() {
        eventEmitter.sendEvent(.museListChanged,
                               body: getAvailableMuseParamList())
    }
}
