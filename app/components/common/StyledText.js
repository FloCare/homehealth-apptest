import React from 'react';
import {Text} from 'react-native';


const StyledText = (props) => {
    return (
        <Text style={{...styles.TextStyle, ...props.style}}>
            {props.children}
        </Text>
    );
};

const styles = {
    TextStyle: {
        fontFamily: 'SF-Pro-Text-Regular',
        fontSize: 18
    }
};

export default StyledText;
