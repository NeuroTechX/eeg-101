
import Quick
import Nimble

@testable import EEG101

fileprivate class MockConnectionListener: IXNMuseConnectionListener {
    
    func receive(_ packet: IXNMuseConnectionPacket, muse: IXNMuse?) {}
}

class MuseConnectionManagerSpec: QuickSpec {
    
    override func spec() {
        describe("connecting to a muse") {
            var subject: MockMuse!
            var manager: MuseConnectionManager!
            var listener: MockConnectionListener!
            
            beforeEach {
                subject = MockMuse()
                listener = MockConnectionListener()
                manager = MuseConnectionManagerImpl()
                
                manager.connectTo(muse: subject, connectionListener: listener)
            }
            
            it("registers the connection listener") {
                expect(subject.registeredConnectionListener).to(beIdenticalTo(listener))
            }
            
            it("runs asynchronously") {
                expect(subject.isRunningAsynchronously).to(beTrue())
            }
            
            describe("disconnecting from the muse") {
                beforeEach {
                    manager.disconnect()
                }
                
                it("disconnects") {
                    expect(subject.hasDisconnected).to(beTrue())
                    expect(subject.isRunningAsynchronously).to(beFalse())
                }
                
                it("reconnects to the muse") {
                    manager.reconnect()
                    expect(subject.isRunningAsynchronously).to(beTrue())
                }
            }
            
            describe("connecting to another muse") {
                var newSubject: MockMuse!
                var newListener: MockConnectionListener!
                
                beforeEach {
                    newSubject = MockMuse()
                    newListener = MockConnectionListener()
                    
                    manager.connectTo(muse: newSubject, connectionListener: newListener)
                }

                it("unregisters any listeners from the previously connected muse") {
                    expect(subject.hasUnregisteredAllListeners).to(beTrue())
                    expect(subject.registeredConnectionListener).to(beNil())
                }

                it("will disconnect a previously connected muse") {
                    expect(subject.hasDisconnected).to(beTrue())
                }
                
                it("registers the new connection listener") {
                    expect(newSubject.registeredConnectionListener).to(beIdenticalTo(newListener))
                }
                
                it("runs the new muse asynchronously") {
                    expect(newSubject.isRunningAsynchronously).to(beTrue())
                }
            }
        }
    }
}
