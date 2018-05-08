import {StyleSheet} from 'react-native';
import {PrimaryColor} from '../../utils/constants';

export const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    //     margin: 0,
    //     padding: 0
    // },
    // listContainer: {
    //     paddingBottom: 60,
    //     marginBottom: 10,
    // },
    // inputStyle: {
    //     color: '#000',
    //     paddingRight: 5,
    //     fontSize: 18,
    //     lineHeight: 24,
    //     flex: 2,
    //     borderBottomWidth: 1,
    //     borderColor: '#ddd',
    // },
    // errorStyle: {
    //     color: '#d50000',
    //     padding: 5,
    //     fontSize: 12,
    // },
    // labelStyle: {
    //     fontSize: 14,
    //     color: "#525252",
    //     paddingBottom: 4,
    //     flex: 1
    // },
    nameStyle: {
        fontSize: 17,
        color: '#222222'
    },
    addressStyle: {
        fontSize: 12,
        color: '#999999'
    },
    badgeContainerStyle: {
        backgroundColor: '#f5f5f5',
        borderColor: '#cccccc',
        marginRight: 8,
        borderWidth: 0.5
    },
    badgeTextStyle: {
        color: '#525252',
        fontSize: 12,
        fontWeight: '300'
    },
    listContainer: {
        marginTop: 0,
        marginBottom: 0,
        marginRight: 50,
        flexDirection: 'row',
        flexWrap: 'nowrap',
    },
    cardContainerStyle: {
        borderRadius: 4,
        // paddingBottom: 0,
        margin: 10,
        marginLeft: 15,
        marginRight: 15,
        marginBottom: undefined,
        backgroundColor: '#ffffff',
        shadowColor: 'rgba(0, 0, 0, 0.11)',
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowRadius: 11,
        shadowOpacity: 1,
        elevation: 4
    },
    // containerStyle: {
    //     flex: 1,
    //     margin: 4,
    //     marginBottom: 20,
    //     flexDirection: 'column',
    // },
    // itemStyle: {
    //     backgroundColor: '#f5f5f5',
    //     borderStyle: 'solid',
    //     borderRadius: 25,
    //     paddingRight: 10,
    //     paddingLeft: 10,
    //     margin: 5,
    //     borderWidth: 0.5,
    //     borderColor: '#cccccc'
    // },
    // buttonStyle: {
    //     padding: 0,
    //     backgroundColor: "rgb(52,218,146)",
    //     margin: 0,
    //     right: 0,
    //     left: 0
    // },
    // buttonContainer: {
    //     flex: 1,
    //     position: 'absolute',
    //     bottom: 0,
    //     padding: 0,
    //     left: 0,
    //     right: 0,
    // }
});

export const colors = {
    primaryColor: PrimaryColor
};

export const navigatorStyles = {
    navigatorStyle: {
        tabBarHidden: true,
        navBarBackgroundColor: PrimaryColor,
        navBarTextColor: '#ffffff',
        navBarButtonColor: '#666666',
        //todo not working
        tabBarBackgroundColor: '#f8f8f8',
    }
};
