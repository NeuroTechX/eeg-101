// Credit to Brennan Stehling (https://gist.github.com/brennanMKE/1ebba84a0fd7c2e8b481e4f8a5349b99)

protocol EventEmitter {
    func sendEvent(_ event: NativeEvent, body: Any?)
}

final class EventEmitterImpl: EventEmitter {
    
    public static var sharedInstance = EventEmitterImpl()
    
    private static var eventEmitter: AppNativeEventEmitter!
    
    private init() {}
    
    func registerEventEmitter(eventEmitter: AppNativeEventEmitter) {
        EventEmitterImpl.eventEmitter = eventEmitter
    }
    
    func sendEvent(_ event: NativeEvent, body: Any?) {
        EventEmitterImpl.eventEmitter.sendEvent(withName: event.rawValue, body: body)
    }
    
    lazy var allEvents: [String] = {
        return NativeEvent.allValues.map { $0.rawValue }
    }()
}
