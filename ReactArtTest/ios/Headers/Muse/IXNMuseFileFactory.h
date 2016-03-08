// Copyright 2015 InteraXon, Inc.

#import <Foundation/Foundation.h>
#import "IXNMuseFile.h"
#import "IXNMuseFileReader.h"
#import "IXNMuseFileWriter.h"

/**
 * Provides API for MuseFileWriter creation
 */
@interface IXNMuseFileFactory : NSObject

/**
 * Creates and returns IXNMuseFileWriter object based on provided path.
 * Interaxon MuseFile implementation is used in this case.
 */
+ (id <IXNMuseFileWriter>)museFileWriterWithPathString:(NSString*)filePath;

/**
 * Creates and returns IXNMuseFileReader object based on provided path.
 * Interaxon MuseFile implementation is used in this case.
 */
+ (id <IXNMuseFileReader>)museFileReaderWithPathString:(NSString*)filePath;

/**
 * Returns MuseFile object, which uses Interaxon's implementation
 */
+ (id <IXNMuseFile>)museFileWithPathString:(NSString*)filePath;

@end
