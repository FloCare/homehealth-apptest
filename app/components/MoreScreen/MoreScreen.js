import React from 'react';
import {View, Image} from 'react-native';
import {Divider, List, ListItem} from 'react-native-elements';
import {Images} from '../../Images';

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
    },
];

function MoreScreen(props) {
    props.navigator.setTitle({title: 'More'});

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
                        />);
                    })
                }
            </List>
        </View>
    );
}

export {MoreScreen};
