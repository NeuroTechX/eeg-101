// Copyright 2015 InteraXon, Inc.

#import <Foundation/Foundation.h>

/**
 * Provides information about SDK release,
 * like SDK version and SDK release index number.
 */
@interface IXNLibMuseVersion : NSObject

/**
 * SDK release index number. It's a digit representation of SDK version.
 * It is guaranteed that it can be only increased with each new release.
 */
+ (int)sdkInt;

/** SDK release version as a string. */
+ (NSString*)sdkVersion;

@end
