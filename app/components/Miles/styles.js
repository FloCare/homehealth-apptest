import {StyleSheet} from 'react-native';
import {defaultBackGroundColor, PrimaryFontFamily} from '../../utils/constants';

export const grayColor = '#999999';
export const blackColor = '#222222';
export const borderColor = '#E1E1E1';
export const dotColor = '#B6B6B6'

export const styles = StyleSheet.create({
    inputTitleStyle: {
        color: grayColor,
        fontSize: 12,
        marginBottom: 5
    },
    borderStyle: {
        color: grayColor
    },
    dividerStyle: {
        margin: 0,
        height: 1,
        backgroundColor: '#dddddd'
    },
    textStyle: {
        color: blackColor,
        fontSize: 12,
        fontFamily: PrimaryFontFamily
    },
    miniHeadingStyle: {
        fontSize: 10,
        color: grayColor,
        fontFamily: PrimaryFontFamily
    },
    miniContentStyle: {
        fontSize: 15,
        color: blackColor,
        fontFamily: PrimaryFontFamily
    },
    toastStyle: {
        backgroundColor: defaultBackGroundColor,
        borderColor: grayColor,
        borderRadius: 5,
        borderWidth: 1
    },
    toastTextStyle: {
        color: blackColor,
        fontSize: 12
    },
    shadowStyle: {
        elevation: 3,
        backgroundColor: defaultBackGroundColor,
        shadowColor: 'black',
        shadowOpacity: 0.3,
        shadowOffset: {width: 2, height: 2},
        shadowRadius: 2,
    }
});
