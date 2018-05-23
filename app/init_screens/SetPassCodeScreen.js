import React, {Component} from 'react';
import RNSecureKeyStore from 'react-native-secure-key-store';
import firebase from 'react-native-firebase';
import CodeInput from 'react-native-confirmation-code-input';
import {StyleSheet, Text, View, Image, Alert} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import StartApp from '../screens/App';
import {Images} from '../Images';
import {screenNames, eventNames, parameterValues } from '../utils/constants';

//const Realm = require('realm');

class SetPassCodeScreen extends Component {

  componentDidMount() {
      firebase.analytics().setCurrentScreen(screenNames.setPassCodeScreen, screenNames.setPassCodeScreen);
  }

  constructor(props) {
    super(props);
    this.state = {
      floDB: null,
      storage: null,
      timeWentInactive: null,
    };
    this.setPasscode = this.setPasscode.bind(this);
    this.setKey = this.setKey.bind(this);
    // this.savePatientObject = this.savePatientObject.bind(this);
  }

// TODO revisit when this screen is moved after a first patient is added. Commenting for now
// savePatientObject(value) {
//   try {
//     const patientId = Math.random().toString();
//     const episodeId = Math.random().toString();
//     const addressId = Math.random().toString();
//       this.floDB.write(() => {
//           // Add the patient
//           const patient = this.floDB.create(Patient.schema.name, {
//               patientID: patientId,
//               name: value.name ? value.name.toString() : '',
//               primaryContact: value.primaryContact ? parsePhoneNumber(value.primaryContact.toString()) : '',
//               emergencyContact: value.emergencyContact ? parsePhoneNumber(value.emergencyContact.toString()) : '',
//               notes: value.notes ? value.notes.toString() : '',
//               timestamp: 0,                                   // Todo: Add a timestmap
//           });

//           // Add the corresponding address
//           const address = patient.address = {
//               addressID: addressId,
//               streetAddress: value.streetAddress ? value.streetAddress.toString() : '',
//               zipCode: value.zip ? value.zip.toString() : '',
//               city: value.city ? value.city.toString() : '',
//               state: value.state ? value.state.toString() : ''
//           };

//           // Add a latLong if present
//           if (value.lat && value.long) {
//               address.coordinates = {
//                   latitude: value.lat,
//                   longitude: value.long
//               };
//               // const latLongID = Math.random().toString();
//               // address.latLong = {
//               //     latLongID,
//               //     lat: value.lat,
//               //     long: value.long
//               // };
//           }

//           // Add an Episode
//           patient.episodes.push({
//               episodeID: episodeId,
//               diagnosis: []                                   // Todo: Add diagnosis
//           });
//         });
//     } catch (err) {
//       console.log('Error on Patient and Episode creation: ', err);
//       // Todo: Raise an error to the screen
//       return;
//     }
// }

setKey() {
  console.log('Trying to set the key ...');
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
  let randomString = '';
  const key = new Int8Array(64);
  for (let i = 0; i < key.length; i++) {
    const rnum = Math.floor(Math.random() * chars.length);
    randomString += chars.substring(rnum, rnum + 1);
  }

  RNSecureKeyStore.set('flokey', randomString)
  .then((res) => {
    console.log(res);
    try {
      StartApp(randomString);
    } catch (err) {
      console.log('Error in starting app:', err);
      Alert.alert('Error', 'Unable to retrieve data');
    }
  }, (err) => {
    console.log(err);
    Alert.alert('Error', 'Unable to start the app');
  });
}

// Secure the entered passcode in the keystore
setPasscode(passcode) {
  if (passcode.length === 4) {
    // Save the passcode to keystore
    RNSecureKeyStore.set('passCode', passcode)
    .then((res) => {
      console.log('Updated the passcode to:', passcode);
      firebase.analytics().logEvent(eventNames.PASSCODE, {
          'status': parameterValues.SUCCESS
      });

      // if key already set, use it
      console.log('Trying to get the key ...');
      RNSecureKeyStore.get('flokey')
        .then((k) => {
          // Connect to realm, Register new screens
          // Navigate to the Tab Based App
          try {
            StartApp(k);
          } catch (e) {
            console.log('Error in starting app:', e);
            Alert.alert('Error', 'Unable to retrieve data');
          }
        }, (err) => {
          console.log('Key not already set', err);
          this.setKey();
        });
    }, (err) => {
      console.log(err);
      firebase.analytics().logEvent(eventNames.PASSCODE, {
          'status': parameterValues.FAILURE
      });
      Alert.alert('Error', 'Unable to update passcode');
      return;
    });

    // this.props.navigator.push({
    //   screen: screenNames.homeScreen,
    //   navigatorStyle: {
    //     tabBarHidden: true
    //   }
    // });

    // TODO Re-visit once this screen is moved to the flow after first patient being added
    // RNSecureKeyStore.get('patientData')
    // .then((res) => {
    //   //Save the patient/visit/episode objects to Realm
    //   this.savePatientObject(JSON.parse(res));
    // }, (err) => {
    //   console.log(err);
    // });

    // Create the encryption key
    // TODO move this function of generating a random string to a common module

    // const randomString = '';
    // const key = new Int8Array(64);
    // for (let i = 0; i < key.length; i++) {
    //   var rnum = Math.floor(Math.random() * chars.length);
    //   randomString += chars.substring(rnum,rnum+1);
    // }

    // RNSecureKeyStore.set('encryptionKey', randomString).then((res) => {
    //   console.log(res);
    // }, (err) => {
    //   console.log(err);
    // });
  }
}
    
  render() {
    // TODO replicate in multiple screens or find a better way of doing at the overall APP level
    return (
      <KeyboardAwareScrollView>
        <View>
          <Text style={styles.topSectionStyle}>
                Please secure the app
          </Text>
        </View>  
        
        {/*<View>
          <Text style={styles.middleSectionStyle}>
          Looks like you have added patients its time to secure the app. By enabling secure access 
          you will only be able to open the app with the 4-digit security code.
          </Text>
        </View>*/}
        <View>
          <Text style={styles.middleSectionStyle}>          
          Note: Please keep the passcode handy.
          </Text>
        </View>
        <View>
        <Image
          style={styles.stretch}
          source={Images.verificationCodeImage}
        />  
        </View>
        <View >
        <CodeInput
          codeLength={4}
          inputPosition='center'
          secureTextEntry
          activeColor='grey'
          inactiveColor='grey'
          autoFocus
          keyboardType='numeric'
          onFulfill={(code) => this.setPasscode(code)}
        />
        </View>
      </KeyboardAwareScrollView> 
    );
  }
}

const styles = StyleSheet.create({
  topSectionStyle: {  
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    marginBottom: 10,
    marginTop: 10,
  },
  middleSectionStyle: {  
    fontSize: 12,
    textAlign: 'center',
    margin: 10,
    marginBottom: 10,
    marginTop: 10,
  },
  stretch: {
    alignSelf: 'center',
    width: 200,
    height: 200,
    marginBottom: 10,
  }
});

export {SetPassCodeScreen};

