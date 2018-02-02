
#import <React/RCTBridgeModule.h>

#import "EEG101-Swift.h"

@interface Connector: NSObject <RCTBridgeModule>

@property (nonnull, nonatomic, strong) MuseConnectorModule *module;

@end

@implementation Connector

RCT_EXPORT_MODULE();

- (instancetype)init {
    self = [super init];
    if (self) {
        _module = [[MuseConnectorModule alloc] init];
    }
    return self;
}

RCT_EXPORT_METHOD(start) {
    [self.module start];
}

RCT_REMAP_METHOD(getMuses,
                 getMusesWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
    [self.module getMusesWithResolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(refreshMuseList) {
    [self.module refreshMuseList];
}

RCT_EXPORT_METHOD(connectToMuseWithIndex:(int)index) {
    [self.module connectToMuseWithIndex:index];
}

@end
