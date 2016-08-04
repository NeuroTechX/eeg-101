#import <ExternalAccessory/ExternalAccessory.h>
#import "IXNMuse.h"

@interface EAAccessory (IXNAccessoryMuse)

/**
 * True iff this device looks like a Muse headset.
 *
 * In particular, the device supports communication over the
 * "com.interaxon.muse" protocol.
 */
@property (readonly, nonatomic) BOOL isMuse;

/**
 * A key unique to this accessory.
 */
@property (readonly, nonatomic) NSString *dictionaryKey;

@end
