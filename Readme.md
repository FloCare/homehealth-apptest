
# Summary:
This is part of the Flocare project and is the mobile app side intended to be used by clinicians for their daily use.
 This app interacts with the backend service to fetch new information and update the backend data. This app is also
 responsible for notifying other mobile clients through pubnub wherever required.  

The aim of this app is to help the clinicians manage their day better and have a clear view of their schedule and 
collaborate with other clinicians.

This app was built keeping an offline-first behaviour and security in mind. 

Current app link: https://play.google.com/store/apps/details?id=com.flocare
#### Other services:
1. Backend - #TODO fill github repo here
2. Web Dashboard (js Admin dashboard to interact with this backend service) - #TODO fill github repo here


#### Entity Definition:
The major entities are listed and defined below. For the complete list of entities browse in models.py for the 
different modules (phi/models.py, user_auth/models.py and flocarebase/models.py)

#####Patient:
The patient that the office and clinicians track. Created by admin from the dashboard
 (Refer to `Other services` heading). Can be assigned to clinicians of this home health through the dashboard. Once
 assigned, these patients are synced to the mobile apps of the respective clinicians. The clinicians can now start
 creating visits for this patient.  


##### Care Team:
A patient can be taken care of by multiple clinicians. All these clinicians form the care team for this patient.


##### Clinicians:
The main users of the mobile app. They have a list of patients that they need to take care of and create visits for
 their patients. The clinicians can perform various actions on the app. Some of the major functions are listed below.
 1. Create visits for their assigned patients (or places) and arrange them in an order.
 2. Add time to any visit.
 3. Re-arrange the order of visits of any day
 4. Call physician of a patient, navigate to his address.
 5. For any given patient in a user's care, see the scheduled visits from other clinicians to this patient. 
 6. Write and share notes for any of the user's patients. The careteam of this patient is notified with the new message. 
 7. Mileage is calculated automatically for each visit. The user can update mileage for any visit if required.
 8. Create reports for visits and submit them to the office.
 9. Switch between day view and week view of their schedule.

The clinicians are also notified in case of a visit collision. A visit collision occurs if 2 or more clinicians are 
scheduled to visit a patient on the same day. The clinicians can then collaborate with each other and decide the course
of action.

##### Places:
There is a list of places that can be created through the admin dashboard. These are common to all the clinicians in
 their home health and will be synced to their mobile apps. They could include places like a lab or hospital that their
 clinicians might go to. 

##### Visit:
Clinicians create visits for the patients/place for a particular date that they need to visit the patient on. They can set
 the time of the visit and for patient visits this information is synced to all members of the careteam.
 
A visit may also have mileage information associated with it. This mileage information is sent from the app to the
 backend service).  


##### Physician:
A physician is a doctor/surgeon in the hospitals. Uniquely identified by their NPI id, they are created from the
 admin dashboard. A patient can have a physician assigned to them.

##### Report:
Clinicians may create a report according to the cycle followed in their home-health(15 days - 30 days). This report will
 have the visit information and the mileage information for each of the visit. On submitting this report, the report
 is sent to the backend and is then viewable on the dashboard.  
 

# Architecture

The app is build with react-native and is tested on iOS and Android.
 
Multiple 3rd party libraries were used for some of the components and is integrated with some external services like 
Instabug and codepush for OTA updates.  

Redux is used for state management. Check the reducers used here - `app/redux/Reducers`.

DB - Realm Database(https://realm.io/products/realm-database)

##### Collaboration:
There are multiple channels that the mobile apps are subscribed to (user_channel, notes_channel, patient_channel, ...).
 All the push communication happens through these pubnub channels. The messaging services
 (`app/data_services/MessagingServices`) are responsible for handling the creating and acting on these messages.
  
# Installation and Usage Instructions:

```
npm install
npm run android-dev
```

If you are testing on iOS, run pod install in the pods directory. (Create it if it is not there)

#### Key Changes:
The following keys need to be added for the app to completely work.

|Key    | File Location   | Description |
|-------|----------------  | ------ | 
|pubnub | app/utils/constants.js | Keys for pubnub subscribers and publishers |
|instabug | app/utils/constants.js | key for getting instabug reports |
|apiServerURL | app/utils/constants.js | URL for the backend service |
|CodePushDeploymentKey | ios/FloCare/Info.plist | Code push deployment key for iOS |
|CodePushDeploymentKey | android/app/src/main/res/values/strings.xml | Code push deployment key for Android |
|googleMapsAPIKey | app/utils/MapUtils.js | Google Maps API key for querying maps |


### Flocare MTP

#### Debugging on Local

##### With Dev settings
* Make sure the **.env.dev** file is updated
* Run the following command with device/emulator connected:
```
npm run android-dev
```


##### With Production settings
* Make sure the **.env.prod**  file is updated
* Run the following command with device/emulator connected:
```
npm run android-prod
```

#### Creating a build for Android
* Make sure the **.env.prod**  file is updated
* Clean the **node_modules**:  
```
rm -rf node_modules
```
* Clean the android build directories  
```
rm -rf android/build/;
rm -rf android/app/build/;
```
* Fetch all dependencies:  
```
npm install
```
* Link all dependencies:  
```
react-native link
```
* Create the build:  
```
npm run build-android-prod
```
