
import React, {Component} from 'react';
// import RNSecureKeyStore from 'react-native-secure-key-store';
import OtpInputs from 'react-native-otp-inputs';
// import UserInactivity from 'react-native-user-inactivity';
import {StyleSheet, Text, View, ScrollView, Image} from 'react-native';
import {Patient, Episode, Visit, Place, Address, VisitOrder} from '../utils/data/schema';
import {screenNames} from '../utils/constants';
import {parsePhoneNumber} from '../utils/lib';

const Realm = require('realm');


export class AccessCodeScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      floDB: null,
      storage: null,
      timeWentInactive: null,
    };
    this.secureKey = this.secureKey.bind(this);
    this.savePatientObject = this.savePatientObject.bind(this);
    // this.onInactivity = this.onInactivity.bind(this);
}

savePatientObject(value) {
try {
  const patientId = Math.random().toString();
  const episodeId = Math.random().toString();
  const addressId = Math.random().toString();
    this.floDB.write(() => {
        // Add the patient
        const patient = this.floDB.create(Patient.schema.name, {
            patientID: patientId,
            name: value.name ? value.name.toString() : '',
            primaryContact: value.primaryContact ? parsePhoneNumber(value.primaryContact.toString()) : '',
            emergencyContact: value.emergencyContact ? parsePhoneNumber(value.emergencyContact.toString()) : '',
            notes: value.notes ? value.notes.toString() : '',
            timestamp: 0,                                   // Todo: Add a timestmap
        });

        // Add the corresponding address
        const address = patient.address = {
            addressID: addressId,
            streetAddress: value.streetAddress ? value.streetAddress.toString() : '',
            zipCode: value.zip ? value.zip.toString() : '',
            city: value.city ? value.city.toString() : '',
            state: value.state ? value.state.toString() : ''
        };

        // Add a latLong if present
        if (value.lat && value.long) {
            address.coordinates = {
                latitude: value.lat,
                longitude: value.long
            };
            // const latLongID = Math.random().toString();
            // address.latLong = {
            //     latLongID,
            //     lat: value.lat,
            //     long: value.long
            // };
        }

        // Add an Episode
        patient.episodes.push({
            episodeID: episodeId,
            diagnosis: []                                   // Todo: Add diagnosis
        });
      });
  } catch (err) {
    console.log('Error on Patient and Episode creation: ', err);
    // Todo: Raise an error to the screen
    return;
  }
}

//Secure the entered passcode in the keystore
secureKey(passcode) {
  if (passcode.length === 4) {
    console.log('Hello');
    // RNSecureKeyStore.set('passCode', passcode).then((res) => {
    //   console.log(res);
    // }, (err) => {
    //   console.log(err);
    // });

    // RNSecureKeyStore.get('patientData')
    // .then((res) => {
    //   //Save the patient/visit/episode objects to Realm
    //   this.savePatientObject(JSON.parse(res));
    // }, (err) => {
    //   console.log(err);
    // });

    const key = new Int8Array(64);
    for (let i = 0; i < key.length; i++) {
      key[i] = 1;
      }

      // RNSecureKeyStore.set('encryptionKey', key.toString).then((res) => {
      //   console.log(res);
      // }, (err) => {
      //   console.log(err);
      // });

  this.floDB = new Realm({
    schema: [
        Visit,
        Patient,
        Address,
        Episode,
        Place,
        VisitOrder
    ],
    deleteRealmIfMigrationNeeded: true,
    encryptionKey: key,
    schemaVersion: 0
  });

    this.props.navigator.push({
    screen: screenNames.signupScreen,
    navigatorStyle: {
        tabBarHidden: true
    }
  });
  }
}
    
  render() {
    // TODO replicate in multiple screens or find a better way of doing at the overall APP level
    return (
      <ScrollView >
        {/* <UserInactivity
        timeForInactivity={10000000}
        checkInterval={1000}
        onInactivity={this.onInactivity}
        /> */}
        <View>
          <Text style={styles.topSectionStyle}>
                We are glad that you are back
          </Text>
        </View>  
        
        <View>
          <Text style={styles.middleSectionStyle}>
          Looks like you have added patients its time to secure the app. By enabling secure access 
          you will only be able to open the app with the 4-digit security code.
          </Text>
        </View>
        <View>
          <Text style={styles.middleSectionStyle}>          
          Note: Please keep the passcode handy.
          </Text>
        </View>
        <View>
        <Image
          style={styles.stretch}
          source={require('../../resources/verificationcodeImg.png')}
        />  
        </View>
        <View >
          <OtpInputs handleChange={code => this.secureKey(code)} numberOfInputs={4} />
        </View>
      </ScrollView> 
    );
  }
}

const styles = StyleSheet.create({
  topSectionStyle: {  
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    marginBottom: 20,
    marginTop: 10,
  },
  middleSectionStyle: {  
    fontSize: 12,
    textAlign: 'center',
    margin: 10,
    marginBottom: 20,
    marginTop: 10,
  },
  stretch: {
    alignSelf: 'center',
    width: 200,
    height: 200,
    marginBottom: 20,
  }
});

export default this.floDB;
