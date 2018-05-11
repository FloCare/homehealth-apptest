import {PrimaryColor, PrimaryFontFamily} from '../../utils/constants';

const styles = {
    parentContainerStyle: {
        flex: 1
    },
    callButtonStyle: {
        height: 40,
        borderRadius: 21,
        backgroundColor: 'transparent',
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowRadius: 12,
        shadowOpacity: 1,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: PrimaryColor
    },
    containerStyle: {
        margin: 14,
        marginLeft: 27,
        marginRight: 16,
        flexDirection: 'row'
    },
    iconStyle: {
        alignSelf: 'flex-start',
        margin: 2,
        padding: 2
    },
    visitStyle: {
        fontSize: 12,
        width: '50%',
        lineHeight: 16,
        letterSpacing: -0.26,
        marginBottom: 10,
        textAlign: 'left',
        color: '#999999',
    },
    fontStyle: {
        fontSize: 18,
        fontFamily: PrimaryFontFamily
    },
    headerStyle: {
        color: '#222222',
        marginBottom: 5,
    },
    dividerStyle: {
        margin: 0,
        height: 1,
        backgroundColor: "#dddddd"
    },
    itemStyle: {
        backgroundColor: '#f5f5f5',
        borderStyle: 'solid',
        borderRadius: 25,
        paddingRight: 10,
        paddingLeft: 10,
        margin: 5,
        borderWidth: 0.5,
        borderColor: '#cccccc'
    },
    noteStyle: {
        paddingRight: 20,
        paddingBottom: 10,
        fontSize: 12,
        flex: 1,
        lineHeight: 18,
        color: '#525252'
    },
    buttonContainerStyle: {
        margin: 2,
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%'
    },
    footerButtonStyle: {
        borderRadius: 3,
        padding: 8,
        width: '100%',
        backgroundColor: PrimaryColor
    },
    buttonStyle: {
        backgroundColor: PrimaryColor,
        marginLeft: 0,
        marginRight: 0,
        height: 50
    }
};

export default styles;
