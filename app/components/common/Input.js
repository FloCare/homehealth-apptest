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
                style={{ height: 20, width: 200}} 
            />
        </View>
        );
};

const styles = {
    containerStyle: {
        borderBottomWidth: 1,
        padding: 5,
        backgroundColor: '#fff',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        borderColor: '#ddd',
        position: 'relative'
    }
}

export {Input};