Issues When installing Muse for Android

1. How do I install a .run file?

Solution: chmod +x *.run file; ./*.run. Found answer on StackOverflow

2. 'Sdk' location not found when opening example project

Solution: Added Android Studio Plug-ins that were turned off. Set Sdk location for default project

3. Nothing happens during Open Project

4. Cannot create directory */.idea

Solution: Started android Studio w/ admin privileges. This lost all previous settings, as if I was a new user

5. Libmuse android folder appears to have write permissions removed and unsettable

Solution: sudo chmod 777 -R /path to folder

6. INSTALL-FAILED_NO_MATCHING_ABIS when running LibMuseExample

7. No implementation found for com.choosemuse.libmuse.LogManager.instance()

Solution: JNI library was not being loaded (it provides native LogManager instance() fn) because jnilibs folder, included in example, was not in project folder

Technical questions:

1. What is a Handler?
A handler sends and processes Message and Runnable objects associated with a thread's MessageQueue. Handlers are bound to the thread that created it. Allows you to schedule sending out messages at some point in the future or enqueue an action to be performed on a different thread. With Muse, handler is used to send out data at 60fps, the speed at which the UI updates, rather than at 220hz, the speed at which data is received from the device.

2. How do I send data between activities?
One option seems to send a Parcelable object. However, I'm not sure whether this passes the WHOLE object, including dynamic streaming data, or just primitive types contained in the object. Furthermore, I run into problems using this technique because the object I am trying to make parcelable is from another library, not modifiable, and is handled by a manager object that is also unmodifiable and only works with the original, non-parcelable, class.

