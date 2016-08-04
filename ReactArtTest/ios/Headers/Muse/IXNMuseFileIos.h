// Copyright 2015 InteraXon, Inc.

#import <Foundation/Foundation.h>
#import "IXNMuseFile.h"

/**
 * iOS-specifc implementaiton of file API.
 * This implementation keeps file opened until close() method will be
 * explicitly called. If you need different implementation for you situation
 * or you want to write to 'network' instead of 'file', use IXNMuseFile
 * interface and provide your own implementation.
 */

@interface IXNMuseFileIos : NSObject <
                IXNMuseFile
>

- (instancetype)initWithFilePath:(NSString *)filePath;

@end
