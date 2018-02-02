
enum NativeEvent: String {
    case museListChanged = "MUSE_LIST_CHANGED"
    case connectionChanged = "CONNECTION_CHANGED"
    case predictResultEvent = "PREDICT_RESULT"
    
    static let allValues: [NativeEvent] = [
        .museListChanged,
        .connectionChanged,
        .predictResultEvent,
    ]
}
