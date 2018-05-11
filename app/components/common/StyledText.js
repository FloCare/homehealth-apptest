import React from 'react';
import {Text} from 'react-native';
import {PrimaryFontFamily} from '../../utils/constants';


const StyledText = (props) => {
    return (
        <Text style={{...styles.TextStyle, ...props.style}}>
            {props.children}
        </Text>
    );
};

const styles = {
    TextStyle: {
        fontFamily: PrimaryFontFamily,
        fontSize: 18
    }
};

export default StyledText;
