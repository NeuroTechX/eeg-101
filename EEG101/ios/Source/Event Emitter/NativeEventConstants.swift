
enum NativeEvent: String {
    case museListChanged = "MUSE_LIST_CHANGED"
    case connectionChanged = "CONNECTION_CHANGED"
    
    static let allValues: [NativeEvent] = [
        .museListChanged,
        .connectionChanged,
    ]
}
