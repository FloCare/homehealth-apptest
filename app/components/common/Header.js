import React from 'react';
import { View, Text } from 'react-native';

const Header = (props) => {
    return (
        <View style={styles.viewStyle}>
            <Text style={styles.textStyle}> {props.titleText} </Text>
        </View>    
    );
};

const styles = {
    textStyle: {
        fontSize: 20
    },
    viewStyle: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center'
    }
};

export default Header;
