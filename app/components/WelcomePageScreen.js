
import React, {Component} from 'react';
import {Button} from 'react-native-elements';
import {StyleSheet, Text, View, ScrollView, Image, AsyncStorage} from 'react-native';
import {screenNames} from '../utils/constants';
import {PrimaryFontFamily} from '../utils/constants';


export class WelcomePageScreen extends Component {

  onButtonPress() {
        this.props.navigator.push({
            screen: screenNames.homeScreen,
            navigatorStyle: {
                tabBarHidden: true
            }
        });
	}
    
  render() {
    return (
      <ScrollView >
        <View>
          <Text style={styles.headerText}>Be more efficient and organized</Text>
        </View>
        <View>
          <Image
            style={styles.stretch}
            source={require('../../resources/welcomeScreenImg.png')}
          />  
        </View>  
        <View style={styles.instructionStyle}>
          <Image
            style={styles.sectionStretch}
            source={require('../../resources/planImg.png')}
          />
          <Text style={styles.bulletPointsStyle}>Plan your day better by having information at your tips</Text>
        </View>
        <View style={styles.instructionStyle}>
          <Image
            style={styles.sectionStretch}
            source={require('../../resources/mapImg.png')}
          />
          <Text style={styles.bulletPointsStyle}>View your visits on map and map a better routing</Text>
        </View>
        <View style={styles.instructionStyle}>
          <Image
            style={styles.sectionStretch}
            source={require('../../resources/secureImg.png')}
          />
          <Text style={styles.bulletPointsStyle}>Be HIPAA compliant with 2 step verification and data encryption</Text>
        </View>
        <Button
            containerViewStyle={{marginLeft: 0, marginRight: 0}}
            buttonStyle={styles.buttonStyle}
            textStyle={{
            fontFamily: PrimaryFontFamily,
            fontSize: 16
            }}
            title='Explore' onPress={this.onButtonPress.bind(this)}>
  				Explore
  			</Button>
      </ScrollView> 
    );
  }
}

const styles = StyleSheet.create({
  headerText: {  
    fontSize: 22,
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
    textAlign: 'center',
    textAlign: 'left',
    marginLeft: 40,
    marginBottom: 30,
    marginTop: 10,
    marginRight: 20,
    flexDirection: 'row',
  },
  stretch: {
    marginLeft: 30,
    width: 310,
    height: 233,
    marginBottom: 20,
  },
  sectionStretch: {
    width: 16,
    height: 24
  },
  instructionStyle: {
    margin: 15,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  buttonStyle: {
    backgroundColor: '#45ceb1',
    marginLeft: 0,
    marginRight: 0
  }
});
