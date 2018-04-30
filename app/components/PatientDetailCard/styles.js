const styles = {
    parentContainerStyle: {
        flex: 1
    },
    callButtonStyle: {
        width: 72,
        height: 40,
        borderRadius: 21,
        backgroundColor: 'transparent',
        shadowColor: "rgba(0, 0, 0, 0.1)",
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowRadius: 12,
        shadowOpacity: 1,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#45ceb1"
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
        width: 150,
        lineHeight: 16,
        letterSpacing: -0.26,
        textAlign: "left",
        color: "#999999"
    },
    headerStyle: {
        fontSize: 18,
        color: '#222222',
        marginBottom: 5
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
        fontSize: 12,
        color: '#525252'
    },
    buttonContainerStyle: {
        position: 'absolute',
        bottom: 1,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    footerButtonStyle: {
        width: 210,
        height: 40,
        borderRadius: 3,
        backgroundColor: '#45ceb1'
    }
};

export default styles;
