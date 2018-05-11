import {PrimaryColor, PrimaryFontFamily} from '../../utils/constants';

const styles = {
    sectionHeader: {
        padding: 10,
        paddingLeft: 15,
        fontSize: 17,
        color: '#525252',
        backgroundColor: '#f8f8f8',
        fontFamily: 'SF-Pro-Text-Semibold'
    },
    nameStyle: {
        padding: 10,
        paddingBottom: 0,
        fontSize: 17,
        color: '#222222',
        fontFamily: PrimaryFontFamily 
    },
    addressStyle: {
        padding: 10,
        paddingTop: 0,
        fontSize: 12,
        color: '#666666',
        fontFamily: PrimaryFontFamily
    },
    seperatorStyle: {
        height: 1,
        marginLeft: 15,
        backgroundColor: '#CED0CE',
    },
    menuOptionsStyle: {
        fontFamily: 'SF-Pro-Display-Regular',
        color: PrimaryColor,
        fontSize: 14
    }
};

export default styles;
