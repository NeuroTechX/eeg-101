// Credit to Brennan Stehling (https://gist.github.com/brennanMKE/1ebba84a0fd7c2e8b481e4f8a5349b99)

import React

@objc(AppNativeEventEmitter)
final class AppNativeEventEmitter: RCTEventEmitter {
    
    override init() {
        super.init()
        EventEmitterImpl.sharedInstance.registerEventEmitter(eventEmitter: self)
    }
    
    @objc override func supportedEvents() -> [String] {
        return EventEmitterImpl.sharedInstance.allEvents
    }
}
