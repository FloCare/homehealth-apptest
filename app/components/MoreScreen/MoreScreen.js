import React, {Component} from 'react';
import {View, Image} from 'react-native';
import {Divider, List, ListItem} from 'react-native-elements';
import firebase from 'react-native-firebase';
import BugReporting from 'instabug-reactnative';
import {Images} from '../../Images';
import {screenNames} from '../../utils/constants';

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
        title: 'Report',
        onPress: () => {
            BugReporting.setPromptOptionsEnabled(false, true, true);
            BugReporting.invoke();
        }
    },
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
                        list(this.props.navigator).map((listItem) => {
                            if (listItem === 'div') {
                                return <Divider style={{backgroundColor: '#dddddd', marginVertical: 20}} />;
                            }

                            return (<ListItem
                                containerStyle={{
                                    borderTopWidth: 0,
                                    borderBottomWidth: 0,
                                    paddingTop: 10,
                                    paddingBottom: 10
                                }}
                                avatarOverlayContainerStyle={{
                                    backgroundColor: 'white',
                                }}
                                titleContainerStyle={{
                                    paddingLeft: 15
                                }}
                                avatar={listItem.icon}
                                avatarStyle={{resizeMode: Image.resizeMode.contain}}
                                title={listItem.title}
                                disabled={listItem.disabled}
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
