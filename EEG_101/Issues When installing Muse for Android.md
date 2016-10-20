# Issues When installing Muse for Android

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

8. Gradle build error: "title" has already been defined

Solution: Changed buildToolsVersion declaration in app.gradle [http://stackoverflow.com/questions/39184283/attribute-title-has-already-been-define-when-have-android-plot-dependencies-1]

# Technical questions and learnings:
 
## How do I implement a Service?
Once startService() is called, that new service will continue to run in the background indefinitely even if the starting component is destroyed. A service bound by bindService() will be able to interact with other components. However, a bound service runs only as long as another application is bound to it. onStartCommand() allows components to start a service. onBind() allows binding.

Normally services are started with an intent. However, this is the only mode of communication between the activity and the service unless binding is used.

Services are either stopped with stopSelf() or by an activity calling stopService().

Bound Services are normally created by bindService() and are used when you want the Service to interact with other activitries and components or for activities to communicate between each other. onBind() must return IBinder that defines interface for communication with the Service.

The manifest entry for each type of component element—<activity>, <service>, <receiver>, and <provider>—supports an android:process attribute that can specify a process in which that component should run.

## What are threads and handlers?
Threads are best thought of as mini-processes running within a main process, enabling parallel execution pathways within apps.

When an app is started, a single main thread is created by default. This main thread normally performs all updates to the UI. New threads created to handle intensive tasks must never update the UI directly.

A handler allows code executing in a thread to interact with the UI. It receives messages from the other thread and updates the user interface accordingly.

The pattern for creating a new thread typically goes:
'''
Runnable runnable = new Runnable() {
	        public void run() { 
	        	// Do things
	        }
      };

Thread mythread = new Thread(runnable);
mythread.start();
'''
The pattern for adding a handler typically goes:
'''
Handler handler = new Handler() {
		  @Override
		  public void handleMessage(Message msg) {
			  // Do UI things
		     }
		 };

Runnable runnable = new Runnable() {
	        public void run() { 
	        	// Do things
	        	handler.sendEmptyMessage(0); // Add a send message function to runnable
	        }
      };

'''

## What is the difference between a thread and a process?
A process is an executing instance of an application. When you start an app you start a process. A thread is a path of execution within that process, like a "mini process". A process can contain multiple threads. A thread can do anything a process can do. But since a process can consist of multiple threads, a thread could be considered a more ‘lightweight’ than a process. Thus, the essential difference between a thread and a process is the work that each one is used to accomplish. Threads are used for small tasks, whereas processes are used for more ‘heavyweight’ tasks – basically the execution of applications.

Another difference between a thread and a process is that threads within the same process share the same address space, whereas different processes do not. This allows threads to read from and write to the same data structures and variables, and also facilitates communication between threads. Communication between processes – also known as IPC, or inter-process communication – is quite difficult and resource-intensive.


## What are Async tasks?
Async tasks are specifically for performing short background operations which need to update. In one sense, they combine the operations of a thread and a handler together, making it easy to implement.

AsynTasks must be subclassed however. They take <TypeOfVarArgParams , ProgressValue , ResultValue> and implement doInBackground() and onPostExecute(). doInBackground() contins the intructions to be performed in a background thread. this will run automatically. onPostExecute() synchronizes itself again with the UI thread once the thread is done executing.


## Combining Services and Handlers
If the service should communicate back to an activity it can receive a Messenger object via the Intent data. If this Mesenger is bound to a handler in the activity, the service can send Message objects to the activity. Messengers are parcelable, which means they can be passed to other pcrocesses and can be used to send messages to the Handler in the activity.

If a runnable is started somewhere else, it can activate handlers by sendMessage. Runnables can also be started by handlers themselves (within the thread that the handler's running in) by using handler.post(runnable)


## Outstanding Q's

Can a Service be an observable?
Will a service that sends data back to main activity in the way we want have to be bound and thus destroyed when switching between streams?
Will bound services be a problem?