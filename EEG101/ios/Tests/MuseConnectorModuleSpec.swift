
import Quick
import Nimble
import CoreBluetooth

@testable import EEG101

class MockMuseManager: MuseManager {
    
    var museListener: IXNMuseListener!
    
    var availableMuses = [IXNMuse]()
    func getMuses() -> [IXNMuse] {
        return availableMuses
    }
    
    private(set) var isListening = false
    func startListening() {
        isListening = true
    }
    
    func stopListening() {
        isListening = false
    }
}

class MockMuseConnectionManager: MuseConnectionManager {
    
    private(set) var isConnected = false
    private(set) var connectedMuse: IXNMuse?
    private(set) var connectionListener: IXNMuseConnectionListener?
    
    func connectTo(muse: IXNMuse, connectionListener: IXNMuseConnectionListener) {
        self.connectedMuse = muse
        self.connectionListener = connectionListener
        isConnected = true
    }
    
    func disconnect() {
        isConnected = false
    }
    
    func reconnect() {
        isConnected = true
    }
}

class MockBluetoothManager: BluetoothManager {
    var delegate: CBCentralManagerDelegate?
    var state = CBManagerState.unknown
}

class MuseConnectionModuleSpec: QuickSpec {
    
    override func spec() {
        describe("Connector Module") {
            var connectorModule: MuseConnectorModule!
            var museManager: MockMuseManager!
            var connectionManager: MockMuseConnectionManager!
            var eventEmitter: MockEventEmitter!
            var bluetoothManager: MockBluetoothManager!
            
            beforeEach {
                museManager = MockMuseManager()
                connectionManager = MockMuseConnectionManager()
                eventEmitter = MockEventEmitter()
                bluetoothManager = MockBluetoothManager()
                
                connectorModule = MuseConnectorModule(museManager: museManager,
                                                      connectionManager: connectionManager,
                                                      eventEmitter: eventEmitter,
                                                      bluetoothManager: bluetoothManager)
            }
            
            context("bluetooth is off") {
                beforeEach {
                    bluetoothManager.state = .poweredOff
                    connectorModule.centralManagerDidUpdateState(CBCentralManager())
                }
                
                describe("getMuses") {
                    it("rejects the promise with an error") {
                        connectorModule.getMuses(resolver: { value in
                            fail("should reject the promise")
                        }, rejecter: { (code, message, error) in
                            expect(code).to(equal("BLUETOOTH_DISABLED"))
                            expect(message).to(equal("BLUETOOTH_DISABLED"))
                        })
                    }
                }
            }
            
            context("bluetooth is on") {
                beforeEach {
                    bluetoothManager.state = .poweredOn
                    connectorModule.centralManagerDidUpdateState(CBCentralManager())
                }
                
                context("a muse device is already available") {
                    beforeEach {
                        let muse = MockMuse(name: "aMuseing")
                        museManager.availableMuses = [muse]
                    }
                    
                    describe("getMuses") {
                        var resolvedValue: Any!
                        
                        beforeEach {
                            connectorModule.getMuses(resolver: { value in
                                resolvedValue = value
                            }, rejecter: { (code, message, error) in
                                fail("should not have rejected the promise")
                            })
                        }
                        
                        it("will return the muse device available") {
                            let availableMuses = resolvedValue as! [[String : String]]
                            expect(availableMuses.count).to(equal(1))
                            expect(availableMuses[0]["name"]).to(equal("aMuseing"))
                        }
                        
                        it("listens for muse devices to connect") {
                            expect(museManager.isListening).to(beTrue())
                            expect(museManager.museListener).to(beIdenticalTo(connectorModule))
                        }
                    }
                }
                
                context("a muse device is not yet available") {
                    describe("getMuses") {
                        var rejectCode: String!
                        var rejectMessage: String!
                        
                        beforeEach {
                            connectorModule.getMuses(resolver: { value in
                                fail("should reject the promise")
                            }, rejecter: { (code, message, error) in
                                rejectCode = code
                                rejectMessage = message
                            })
                        }
                        
                            it("will return the muse device available") {
                                expect(rejectCode).to(equal("NO_MUSES"))
                                expect(rejectMessage).to(equal("NO_MUSES"))
                            }

                        it("listens for muse devices to connect") {
                            expect(museManager.isListening).to(beTrue())
                            expect(museManager.museListener).to(beIdenticalTo(connectorModule))
                        }
                    }
                }
                
                describe("refreshMuseList") {
                    beforeEach {
                        connectorModule.refreshMuseList()
                    }
                    
                    it("listens for muse devices to connect") {
                        expect(museManager.isListening).to(beTrue())
                        expect(museManager.museListener).to(beIdenticalTo(connectorModule))
                    }
                }
                
                describe("when a muse device is connecting") {
                    beforeEach {
                        let packet = IXNMuseConnectionPacket(previousConnectionState: .unknown,
                                                             currentConnectionState: .connecting)
                        let muse = MockMuse()
                        museManager.availableMuses = [muse]
                        connectorModule.receive(packet, muse: muse)
                    }
                    
                    it("sends muse list changed event") {
                        let recievedEvent = eventEmitter.sentEvents[0]
                        expect(recievedEvent.0).to(equal(NativeEvent.connectionChanged))
                        
                        let props = recievedEvent.1 as! [String : String]
                        expect(props["connectionStatus"]).to(equal("CONNECTING"))
                    }
                }
                
                describe("when a muse device connects") {
                    beforeEach {
                        let packet = IXNMuseConnectionPacket(previousConnectionState: .connecting,
                                                             currentConnectionState: .connected)
                        
                        let muse = MockMuse(name: "aMuseing")
                        museManager.availableMuses = [muse]
                        connectorModule.receive(packet, muse: muse)
                    }
                    
                    it("sends muse list changed event") {
                        let recievedEvent = eventEmitter.sentEvents[0]
                        expect(recievedEvent.0).to(equal(NativeEvent.connectionChanged))
                        
                        let props = recievedEvent.1 as! [String : String]
                        expect(props["connectionStatus"]).to(equal("CONNECTED"))
                    }
                }
                
                describe("when a muse device disconnects") {
                    beforeEach {
                        let packet = IXNMuseConnectionPacket(previousConnectionState: .connected,
                                                             currentConnectionState: .disconnected)
                        
                        let muse = MockMuse()
                        museManager.availableMuses = [muse]
                        connectorModule.receive(packet, muse: muse)
                    }
                    
                    it("sends muse list changed event") {
                        let recievedEvent = eventEmitter.sentEvents[0]
                        expect(recievedEvent.0).to(equal(NativeEvent.connectionChanged))
                        
                        let props = recievedEvent.1 as! [String : String]
                        expect(props["connectionStatus"]).to(equal("DISCONNECTED"))
                    }
                }
            }
        }
    }
}
