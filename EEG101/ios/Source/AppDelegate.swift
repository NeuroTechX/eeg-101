
import UIKit
import React

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?
    
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
        let jsCodeLocation = RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index.ios", fallbackResource: nil)
        let rootView = RCTRootView(bundleURL: jsCodeLocation, moduleName: "EEG101", initialProperties: nil, launchOptions: launchOptions)
        rootView?.backgroundColor = UIColor(red: 1, green: 1, blue: 1, alpha: 1)
        
        window = UIWindow(frame: UIScreen.main.bounds)
        let rootViewController = UIViewController()
        rootViewController.view = rootView
        window?.rootViewController = rootViewController
        window?.makeKeyAndVisible()
        
        return true
    }
    
    func applicationDidBecomeActive(_ application: UIApplication) {
        MuseConnectionManagerImpl.sharedInstance.reconnect()
    }
    
    func applicationWillResignActive(_ application: UIApplication) {
        MuseConnectionManagerImpl.sharedInstance.disconnect()
    }
}
