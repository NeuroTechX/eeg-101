// Copyright 2015 InteraXon, Inc.

#import <ExternalAccessory/ExternalAccessory.h>
#import <Foundation/Foundation.h>

/**
 * Provides access to all IXNMuse devices paired to this device.
 */
@interface IXNMuseManager : NSObject

/**
 * This is the set of all Muses currently connected to this device.
 *
 * This set contains one object implementing IXNMuse for each physical Muse
 * headband connected. This is different from the set of paired headbands, the
 * latter of which is inaccessible at the app level. If you need to discover
 * new Muses to pair with, it is recommended to either use
 * showMusePickerWithCompletion: or, if searching for a Muse that doesn't start
 * with the string "Muse" for some reason, to directly call
 * EAAccessoryManager showBluetoothAccessoryPickerWithNameFilter:completion:.
 */
@property (nonatomic, readonly) NSSet* connectedMuses;

/**
 * Returns the shared IXNMuseManager.
 */
+ (IXNMuseManager *)sharedManager;

/**
 * Returns the key path for KVO on connectedMuses.
 */
- (NSString *)connectedMusesKeyPath;

/**
 * Displays an alert that allows the user to pair the device with a Muse.
 *
 * This just calls showBluetoothAccessoryPickerWithNameFilter:completion: with
 * a filter that passes devices starting with "Muse".
 *
 * N.B. completion is not the place to connect to the Muse the picker found; it
 * may be called prior to the Muse being added to connectedMuses. Instead, sign
 * up for notifications with onConnectNotifyTarget:selector:object:.
 */
- (void)showMusePickerWithCompletion:
    (EABluetoothAccessoryPickerCompletion)completion;

@end
