import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import Header from '../components/common/Header';

export class ThankYouScreen extends Component {

  render() {
    return (
        <View style={styles.thankYouTextStyle}>
            <Header titleText='Thank You !! We will reach out shortly.' />
        </View>
    );   
  }
}

const styles = StyleSheet.create({
  thankYouTextStyle: {  
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    marginBottom: 20,
    marginTop: 200,
  }
});

