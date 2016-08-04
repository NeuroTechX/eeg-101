#import <Foundation/Foundation.h>
#import "Muse.h"
#import "RCTEventDispatcher.h"

@class RCTMuseListenerManager;

@interface RCTMuseListener : NSObject <IXNMuseConnectionListener, IXNMuseDataListener>

@property (nonatomic) RCTMuseListenerManager* delegate;
@property (nonatomic) RCTEventDispatcher* eventDispatcher;

- (instancetype)initWithDelegate:(RCTMuseListenerManager *)delegate eventDispatcher:(RCTEventDispatcher *) eventDispatcher;
- (void)receiveMuseDataPacket:(IXNMuseDataPacket *)packet;
- (void)receiveMuseArtifactPacket:(IXNMuseArtifactPacket *)packet;
- (void)receiveMuseConnectionPacket:(IXNMuseConnectionPacket *)packet;

@end
