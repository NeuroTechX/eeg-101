
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(Connector, NSObject)

RCT_EXTERN_METHOD(getMusesWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject )

RCT_EXTERN_METHOD(refreshMuseList)

RCT_EXTERN_METHOD(connectToMuseWithIndex:(int)index)

@end
