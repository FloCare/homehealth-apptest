import React, {Component} from 'react';
import {View, Image} from 'react-native';
import {Divider, List, ListItem} from 'react-native-elements';
import firebase from 'react-native-firebase';
import {BugReporting} from 'instabug-reactnative';
import {Images} from '../../Images';
import {screenNames} from '../../utils/constants';
import {setAutoScreenShotForInstabug} from '../../utils/instabugUtils';

const list = navigator => [
    {
        icon: Images.visitLog,
        title: 'Visit Log',
        disabled: true
    },
    {
        icon: Images.milesLog,
        title: 'Miles Log',
        disabled: true
    },
    {
        icon: Images.savedPlaces,
        title: 'Saved Places',
        onPress: () => navigator.push({
            screen: screenNames.stopList,
            animated: true,
            animationType: 'slide-horizontal',
            title: 'Saved Places',
            navigatorStyle: {
                tabBarHidden: true,
                largeTitle: false,
            }
        })
    },
    'div',
    {
        icon: Images.accessCode,
        title: 'Access Code',
        disabled: true
    },
    {
        icon: Images.setting,
        title: 'Settings',
        disabled: true
    },
    {
        icon: Images.legal,
        title: 'Legal',
        onPress: () => navigator.push({
            screen: screenNames.legal,
            title: 'Legal',
            navigatorStyle: {
                tabBarHidden: true,
                largeTitle: false,
            }
        })
    },
    'div',
    {
        icon: Images.sendfeedback,
        title: 'Send Feedback',
        hideChevron: true,
        onPress: () => {
            setAutoScreenShotForInstabug(false);
            BugReporting.invokeWithInvocationModeAndOptions(BugReporting.invocationMode.newFeedback, [BugReporting.invocationOptions.emailFieldHidden]);
            BugReporting.onSDKDismissedHandler(() => setAutoScreenShotForInstabug(true));
        }
    },
];

class MoreScreen extends Component {
    constructor(props) {
        super(props);

        props.navigator.setTitle({title: 'More'});
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent(event) {
        if (event.id === 'willAppear') {
            this.props.navigator.setTitle({
                title: 'More'
            });
        }
        // STOP GAP solution. To brainstorm on the right way of doing it
        if (event.id === 'didAppear') {
            firebase.analytics().setCurrentScreen(screenNames.more, screenNames.more);
        }
    }
        render() {
        return (
            <View
                style={{
                    paddingHorizontal: 15,
                    backgroundColor: 'white',
                    flex: 1
                }}
            >
                <List
                    containerStyle={{
                        borderTopWidth: 0,
                        borderBottomWidth: 0
                    }}
                >
                    {
                        list(this.props.navigator).map((listItem, index) => {
                            if (listItem === 'div') {
                                return <Divider key={index} style={{backgroundColor: '#dddddd', marginVertical: 10}} />;
                            }

                            return (<ListItem
                                containerStyle={{
                                    borderTopWidth: 0,
                                    borderBottomWidth: 0,
                                    paddingTop: 5,
                                    paddingBottom: 5
                                }}
                                key={index}
                                avatarOverlayContainerStyle={{
                                    backgroundColor: 'white',
                                }}
                                avatar={listItem.icon}
                                avatarStyle={{width: 20, height: 20, resizeMode: 'contain'}}
                                title={listItem.title}
                                disabled={listItem.disabled}
                                hideChevron={listItem.hideChevron}
                                onPress={() => listItem.onPress()}
                            />);
                        })
                    }
                </List>
            </View>
        );
    }
}

export {MoreScreen};
