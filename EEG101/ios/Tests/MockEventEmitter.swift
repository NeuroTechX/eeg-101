
@testable import EEG101

class MockEventEmitter: EventEmitter {
    
    private (set) var sentEvents = [(NativeEvent, Any?)]()
    func sendEvent(_ event: NativeEvent, body: Any?) {
        sentEvents.append((event, body))
    }
}
