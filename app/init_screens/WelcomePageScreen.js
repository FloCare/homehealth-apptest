import React, {Component} from 'react';
import {Button} from 'react-native-elements';
import firebase from 'react-native-firebase';
import {StyleSheet, Text, View, Image} from 'react-native';
import {screenNames, PrimaryFontFamily, PrimaryColor} from '../utils/constants';
import {Images} from '../Images';

export class WelcomePageScreen extends Component {

  componentDidMount() {
    firebase.analytics().setCurrentScreen(screenNames.welcome, screenNames.welcome);
  }

  onButtonPress() {
    this.props.navigator.resetTo({
      screen: screenNames.setPassCodeScreen,
      backButtonHidden: true,
    });
	}

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={{flex: 1, justifyContent: 'center', marginTop: 10, marginBottom: 10}}>
          <View>
            <Text style={styles.headerText}>Be more efficient and organized</Text>
          </View>
          <View>
            <Image
              style={styles.stretch}
              source={Images.welcomeScreen}
            />
          </View>
          <View style={styles.instructionStyle}>
            <Image
              style={styles.sectionStretch}
              source={Images.planDay}
            />
            <Text style={styles.bulletPointsStyle}>Plan your day better by having information at your tips</Text>
          </View>
          <View style={styles.instructionStyle}>
            <Image
              style={styles.sectionStretch}
              source={Images.viewMap}
            />
            <Text style={styles.bulletPointsStyle}>View your visits on a map, follow a shorter route and save time</Text>
          </View>
          <View style={styles.instructionStyle}>
            <Image
              style={styles.sectionStretch}
              source={Images.secureData}
            />
            <Text style={styles.bulletPointsStyle}>Be secure with auto lock and data encryption</Text>
          </View>
        </View>
      <Button
          containerViewStyle={{marginLeft: 0, marginRight: 0}}
          buttonStyle={styles.buttonStyle}
          textStyle={{
            fontFamily: PrimaryFontFamily,
            fontSize: 16
          }}
          title='Explore' onPress={this.onButtonPress.bind(this)}
      >
        Explore
      </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
    marginBottom: 30,
    marginTop: 10,
    marginLeft: 100,
    marginRight: 100,
    flexDirection: 'row',
  },
  bulletPointsStyle: {
    fontSize: 16,
    textAlign: 'left',
    marginLeft: 20,
    marginBottom: 10,
    marginTop: 10,
    marginRight: 50,
    flexDirection: 'row',
  },
  stretch: {
    marginLeft: 30,
    width: 310,
    height: 233,
    marginBottom: 20,
  },
  sectionStretch: {
    marginLeft: 20,
    width: 16,
    height: 24
  },
  instructionStyle: {
    marginRight: 10,
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  buttonStyle: {
    backgroundColor: PrimaryColor,
    marginLeft: 0,
    marginRight: 0,
    height: 50
  }
});
