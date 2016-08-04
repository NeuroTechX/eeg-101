#import <Foundation/Foundation.h>
#import "RCTBridgeModule.h"
#import "Muse.h"

@class RCTMuseListener;

@interface RCTMuseListenerManager : NSObject <RCTBridgeModule>

@property (strong, nonatomic) IXNMuseManager *manager;
@property (strong, nonatomic) id<IXNMuse> muse;
@property (nonatomic) RCTMuseListener *museListener;
@property (nonatomic) NSTimer *musePickerTimer;

- (void)sayHi;
- (void)reconnectToMuse;

@end
