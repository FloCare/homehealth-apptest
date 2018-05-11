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
