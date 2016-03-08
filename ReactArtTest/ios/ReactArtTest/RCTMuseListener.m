#import "RCTMuseListener.h"
#import "RCTMuseListenerManager.h"

const int MUSE_FREQUENCY = 220;
const float SEND_INTERVAL = 0.25;
const int POINTS_PER_SEND = SEND_INTERVAL * MUSE_FREQUENCY;

@implementation RCTMuseListener {
  BOOL lastBlink;
  BOOL sawOneBlink;
  NSMutableArray<NSNumber*> *signalDataA1;
  NSMutableArray<NSNumber*> *signalDataFP1;
  NSMutableArray<NSNumber*> *signalDataFP2;
  NSMutableArray<NSNumber*> *signalDataA2;
  NSLock *signalDataLock;
}

- (instancetype)initWithDelegate:(RCTMuseListenerManager *)delegate eventDispatcher:(RCTEventDispatcher *)eventDispatcher {
  if ((self = [super init])) {
    _delegate = delegate;
    _eventDispatcher = eventDispatcher;
    signalDataA1 = [[NSMutableArray alloc] init];
    signalDataFP1 = [[NSMutableArray alloc] init];
    signalDataFP2 = [[NSMutableArray alloc] init];
    signalDataA2 = [[NSMutableArray alloc] init];
    signalDataLock = [[NSLock alloc] init];
  }
  return self;
}

- (void)receiveMuseDataPacket:(IXNMuseDataPacket *)packet {
  switch (packet.packetType) {
    case IXNMuseDataPacketTypeEeg:
      [self processAndSendMuseData:packet.values];
      break;
    default:
      NSLog(@"OTHER");
      break;
  }
}

- (void)receiveMuseArtifactPacket:(IXNMuseArtifactPacket *)packet {
  /*if (!packet.headbandOn)
    return;
  if (sawOneBlink) {
    sawOneBlink = YES;
    lastBlink = !packet.blink;
  }
  if (lastBlink != packet.blink) {
    if (packet.blink)
      NSLog(@"blink");
    lastBlink = packet.blink;
  }*/
}

- (void)receiveMuseConnectionPacket:(IXNMuseConnectionPacket *)packet {
  NSString *state;
  switch (packet.currentConnectionState) {
    case IXNConnectionStateDisconnected:
      state = @"disconnected";
      break;
    case IXNConnectionStateConnected:
      state = @"connected";
      break;
    case IXNConnectionStateConnecting:
      state = @"connecting";
      break;
    case IXNConnectionStateNeedsUpdate:
      state = @"needs update";
      break;
    case IXNConnectionStateUnknown:
      state = @"unknown";
      break;
    default:
      NSAssert(NO, @"impossible connection state received");
  }
  [self.eventDispatcher sendDeviceEventWithName:@"museStatus" body:state];
  if (packet.currentConnectionState == IXNConnectionStateDisconnected) {
    [self.delegate performSelector:@selector(reconnectToMuse)
                        withObject:nil
                        afterDelay:0];
  }
}

- (void) processAndSendMuseData:(NSArray<NSNumber *> *)newData {
  if ([signalDataLock tryLock]) {
    [signalDataA1 addObject:newData[0]];
    [signalDataFP1 addObject:newData[1]];
    [signalDataFP2 addObject:newData[2]];
    [signalDataA2 addObject:newData[3]];
    
    if ([signalDataA1 count] >= POINTS_PER_SEND ||
        [signalDataFP1 count] >= POINTS_PER_SEND ||
        [signalDataFP2 count] >= POINTS_PER_SEND ||
        [signalDataA2 count] >= POINTS_PER_SEND) {
      NSNumber *avgA1 = [signalDataA1 valueForKeyPath:@"@avg.self"];
      NSNumber *avgFP1 = [signalDataFP1 valueForKeyPath:@"@avg.self"];
      NSNumber *avgFP2 = [signalDataFP2 valueForKeyPath:@"@avg.self"];
      NSNumber *avgA2 = [signalDataA2 valueForKeyPath:@"@avg.self"];
      
      NSDictionary *averageData = @{
                                    @"A1": avgA1,
                                    @"FP1": avgFP1,
                                    @"FP2": avgFP2,
                                    @"A2": avgA2
                                    };
      
      [self.eventDispatcher sendDeviceEventWithName:@"museRead" body:averageData];
      
      [signalDataA1 removeAllObjects];
      [signalDataFP1 removeAllObjects];
      [signalDataFP2 removeAllObjects];
      [signalDataA2 removeAllObjects];

    }
    
    [signalDataLock unlock];
  }
}

@end
