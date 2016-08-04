#import "RCTMuseListenerManager.h"
#import "RCTMuseListener.h"
#import "RCTBridge.h"

const NSString *STATUS_LABEL_DISCONNECTED = @"DISCONNECTED";
const NSString *STATUS_LABEL_CONNECTED = @"CONNECTED";
const NSString *STATUS_LABEL_CONNECTING = @"CONNECTING";
const NSString *STATUS_LABEL_NEEDS_UPDATE = @"NEEDS_UPDATE";
const NSString *STATUS_LABEL_UNKNOWN = @"UNKNOWN";

const NSString *STATUS_DISCONNECTED = @"disconnected";
const NSString *STATUS_CONNECTED = @"connected";
const NSString *STATUS_CONNECTING = @"connecting";
const NSString *STATUS_NEEDS_UPDATE = @"needs update";
const NSString *STATUS_UNKNOWN = @"unknown";

@implementation RCTMuseListenerManager

RCT_EXPORT_MODULE()

@synthesize bridge = _bridge;

RCT_EXPORT_METHOD(connect) {
  @synchronized(self.manager) {
    if (!self.manager) {
      self.manager = [IXNMuseManager sharedManager];
    }
  }
  if (!self.muse) {
    self.musePickerTimer =
      [NSTimer scheduledTimerWithTimeInterval:1
                                       target:self
                                     selector:@selector(showPicker)
                                     userInfo:nil
                                      repeats:NO];
  }
  if (!self.museListener)
    self.museListener = [[RCTMuseListener alloc] initWithDelegate:self
                                                  eventDispatcher:self.bridge.eventDispatcher];
  [self.manager addObserver:self
                 forKeyPath:[self.manager connectedMusesKeyPath]
                    options:(NSKeyValueObservingOptionNew |
                             NSKeyValueObservingOptionInitial)
                    context:nil];
}

RCT_EXPORT_METHOD(showPicker) {
  [self.manager showMusePickerWithCompletion:^(NSError *e) {
    if (e)
      NSLog(@"Error showing Muse picker: %@", e);
  }];
}

- (void)observeValueForKeyPath:(NSString *)keyPath
                      ofObject:(id)object
                        change:(NSDictionary<NSString *,id> *)change
                       context:(void *)context {
  if ([keyPath isEqualToString:[self.manager connectedMusesKeyPath]]) {
    NSSet *connectedMuses = [change objectForKey:NSKeyValueChangeNewKey];
    if (connectedMuses.count) {
      [self startWithMuse:[connectedMuses anyObject]];
    }
  }
}

- (void)startWithMuse:(id<IXNMuse>)muse {
  @synchronized (self.muse) {
    if (self.muse) {
      return;
    }
    self.muse = muse;
  }
  [self.musePickerTimer invalidate];
  self.musePickerTimer = nil;
  [self.muse registerDataListener:self.museListener
                             type:IXNMuseDataPacketTypeArtifacts];
  [self.muse registerDataListener:self.museListener
                             type:IXNMuseDataPacketTypeEeg];
  [self.muse registerConnectionListener:self.museListener];
  [self.muse runAsynchronously];
}

- (void)sayHi {
  UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Muse says hi"
                                                  message:@"Muse is now connected"
                                                 delegate:nil
                                        cancelButtonTitle:@"OK"
                                        otherButtonTitles:nil];
  [alert show];
}

- (void)reconnectToMuse {
  [self.muse runAsynchronously];
}

- (NSDictionary *)constantsToExport
{
  return @{ STATUS_LABEL_DISCONNECTED: STATUS_DISCONNECTED,
            STATUS_LABEL_CONNECTED: STATUS_CONNECTED,
            STATUS_LABEL_CONNECTING: STATUS_CONNECTING,
            STATUS_LABEL_NEEDS_UPDATE: STATUS_NEEDS_UPDATE,
            STATUS_LABEL_UNKNOWN: STATUS_UNKNOWN };
}

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

@end
