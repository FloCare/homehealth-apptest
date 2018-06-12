import React from 'react';
import {View, TextInput, Text} from 'react-native';

const Input = ({ label, value, onChangeText, placeholder, secureTextEntry }) => {
    return (
        <View style={styles.containerStyle}> 
            <Text> {label} </Text>
            <TextInput 
                secureTextEntry={secureTextEntry}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                style={{ height: 40, width: 300}} 
            />
        </View>
        );
};

const styles = {
    containerStyle: {
        padding: 5,
        backgroundColor: '#fff',
        justifyContent: 'flex-start',
        flexDirection: 'row',
    }
}

export {Input};