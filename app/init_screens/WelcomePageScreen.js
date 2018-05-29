import React, {Component} from 'react';
import {Button} from 'react-native-elements';
import firebase from 'react-native-firebase';
import {StyleSheet, Text, View, ScrollView, Image} from 'react-native';
import {PrimaryFontFamily, screenNames} from '../utils/constants';
import {Images} from '../Images';

export class WelcomePageScreen extends Component {

  componentDidMount() {
        firebase.analytics().setCurrentScreen(screenNames.WelcomePageScreen, screenNames.WelcomePageScreen);
  }

  onButtonPress() {
    this.props.navigator.push({
      screen: screenNames.setPassCodeScreen,
      backButtonHidden: true,
    });
	}

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'space-between'}}>
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
          <Text style={styles.bulletPointsStyle}>View your visits on map and map a better routing</Text>
        </View>
        <View style={styles.instructionStyle}>
          <Image
            style={styles.sectionStretch}
            source={Images.secureData}
          />
          <Text style={styles.bulletPointsStyle}>Be secure with auto lock and data encryption</Text>
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
    backgroundColor: '#45ceb1',
    marginLeft: 0,
    marginRight: 0
  }
});
