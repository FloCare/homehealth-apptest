import {View, Dimensions, TextInput} from 'react-native';
import React from 'react';
import StyledText from './StyledText';

export const InputField = React.forwardRef((props, ref) => (
    <View
        style={{width: Dimensions.get('window').width * 0.7, marginVertical: 10}}
    >
        <StyledText
            style={{color: 'white', textAlign: 'left', ...props.titleStyle}}
        >
            {props.title}
        </StyledText>
        <TextInput
            ref={ref}
            keyboardType={props.keyboardType}
            value={props.value}
            autoFocus={props.autoFocus}
            placeholder={props.placeholder}
            secureTextEntry={props.secureTextEntry}
            onChangeText={props.onChangeText}
            onSubmitEditing={props.onSubmitEditing}

            autoCapitalize={'none'}
            selectionColor={props.selectionColor || 'rgba(255,255,255,0.5)'}
            underlineColorAndroid={'white'}
            autoCorrect={false}
            style={{color: 'white', ...props.style}}
            placeholderTextColor={props.placeholderTextColor || 'rgba(255,255,255,0.35)'}
        />
    </View>
));
