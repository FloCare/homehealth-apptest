import {PrimaryColor, PrimaryFontFamily} from '../../utils/constants';

const styles = {
    buttonStyle: {
        backgroundColor: PrimaryColor,
        marginLeft: 0,
        marginRight: 0,
        height: 50
    },
    nameTextStyle: {
        flex: 1,
        textAlign: 'left',
        textAlignVertical: 'center',
        fontWeight: '200',
        fontSize: 23,
        paddingLeft: 10,
        paddingRight: 10
    },
    nameContainerStyle: {
        backgroundColor: '#e1e8ee', 
        borderWidth: 1,
        borderColor: '#a2a2a2',
        height: 50
    },
    scrollViewStyle: {
        flex: 9,
        borderColor: '#a2a2a2',
        borderBottomWidth: 1,
        backgroundColor: '#e1e8ee',
    },
    notesTextStyle: {
        textAlignVertical: 'top',
        paddingLeft: 10,
        paddingRight: 10,
        fontFamily: PrimaryFontFamily
    }
};

export default styles;
