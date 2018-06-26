import React, {Component} from 'react';
import {View, Image} from 'react-native';
import {Divider, List, ListItem} from 'react-native-elements';
import {Images} from '../../Images';
import {screenNames} from '../../utils/constants';

const list = [
    {
        icon: Images.visitLog,
        title: 'Visit Log',
    },
    {
        icon: Images.milesLog,
        title: 'Miles Log',
    },
    {
        icon: Images.savedPlaces,
        title: 'Saved Places',
        onPress: {
            screen: screenNames.stopList,
            animated: true,
            animationType: 'slide-horizontal',
            title: 'Saved Places',
            navigatorStyle: {
                tabBarHidden: true,
                largeTitle: false,
            }
        }
    },
    'div',
    {
        icon: Images.accessCode,
        title: 'Access Code',
    },
    {
        icon: Images.setting,
        title: 'Settings',
    },
    {
        icon: Images.legal,
        title: 'Legal',
        onPress: {
            screen: screenNames.legal,
            title: 'Legal',
            navigatorStyle: {
                tabBarHidden: true,
                largeTitle: false,
            }
        },
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
                        list.map((listItem) => {
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
                                disabled={listItem.onPress === undefined}
                                onPress={() => this.props.navigator.push(listItem.onPress)}
                            />);
                        })
                    }
                </List>
            </View>
        );
    }
}

export {MoreScreen};
