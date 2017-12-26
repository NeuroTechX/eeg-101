
import Quick
import Nimble

@testable import EEG101

fileprivate class MockConnectionListener: IXNMuseConnectionListener {
    
    func receive(_ packet: IXNMuseConnectionPacket, muse: IXNMuse?) {}
}

fileprivate class MockReactNativeEventEmitter: ReactNativeEventEmitter {
    
    private(set) var eventName: String? = nil
    private(set) var eventBody: Any? = nil
    override func sendEvent(withName name: String!, body: Any!) {
        eventName = name
        eventBody = body
    }
    
    override func supportedEvents() -> [String] {
        return ["CONNECTION_CHANGED"]
    }
}

class EventEmitterSpec: QuickSpec {
    
    override func spec() {
        describe("supported events") {
            it("should list all event types we want to send") {
                expect(ReactNativeEventEmitter().supportedEvents())
                    .to(contain(["CONNECTION_CHANGED", "MUSE_LIST_CHANGED"]))
            }
        }
        
        describe("Sending an event through the event emitter") {
            it("sends through the registered event emitter") {
                let mockReactNativeEventEmitter = MockReactNativeEventEmitter()
                EventEmitterImpl.sharedInstance.sendEvent(.connectionChanged, body: ["propKey" : "propValue"])
                
                expect(mockReactNativeEventEmitter.eventName).to(equal(NativeEvent.connectionChanged.rawValue))
                expect(mockReactNativeEventEmitter.eventBody).toNot(beNil())
            }
        }
    }
}
