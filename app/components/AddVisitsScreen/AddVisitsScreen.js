import React from 'react';
import {View, FlatList} from 'react-native';
import {SearchBar, Button, Text} from 'react-native-elements';
import {Tag} from '../common/tag';
import EmptyStateButton from '../common/EmptyStateButton';

//TODO improve efficiency
//TODO mark the places already selected for visit as such
//
// function _createListItemComponent(item, onItemToggle) {
//     const avatar = item.type === 'patient' ? require('../../../resources/ic_fiber_pin_2x.png') : require('../../../resources/ic_location_on_black_24dp.png');
//     const rightIcon = item.isSelected ? {name: 'check'} : {name: 'ac-unit'};
//     console.log([item.type + item.id, item.name, item.address, avatar, rightIcon, onItemToggle].join(', '));
//     return (
//         <ListItem
//             key={item.key}
//             title={item.name}
//             subtitle={item.address}
//             avatar={avatar}
//             rightIcon={rightIcon}
//             onPressRightIcon={() => onItemToggle(item)}
//         />
//     );
// }

function getComponentToDisplayBasedOnProps(props) {
    if (props.listItems.length === 0) {
        return (
            <View
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Text
                    style={{
                        fontWeight: '300',
                        fontSize: 20
                    }}
                >No Patients</Text>

                <Text
                    style={{
                        textAlign: 'center',
                        padding: 0,
                        margin: 20,
                        marginTop: 5,
                    }}
                >
                    When you add patients, you'll see them here
                </Text>
                <EmptyStateButton
                    onPress={props.onPressAddPatient}
                >
                    Add Patient
                </EmptyStateButton>
            </View>
        );
    }

    this.getTags = function () {
        if (props.selectedItems.length > 0) {
            return (
                <View
                    style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        marginLeft: 16,
                        marginRight: 16,
                        marginTop: 4,
                        borderBottomWidth: 1,
                        borderColor: '#aaaaaa',
                        paddingBottom: 4
                    }}
                >
                    {props.selectedItems.map((item) => <Tag
                        text={item.name}
                        onPress={() => props.onTagPress(item)}
                    />)}
                </View>
            );
        }
        return (
            <View />
        );
    };

    return (
        <View style={{flex: 1}}>
            {this.getTags()}
            <FlatList
                data={props.listItems}
                renderItem={props.renderItem}
            />
        </View>
    );
}

function AddVisitsScreen(props) {
    //TODO theres inconsistencies in whether the button lable is in caps or not
    return (
        <View style={{flex: 1}}>
            <SearchBar
                lightTheme
                placeholder='search patients or stops'
                onChangeText={props.onChangeText}
            />
            {getComponentToDisplayBasedOnProps(props)}
            <Button
                large
                title='Done'
                onPress={props.onDone}
                containerViewStyle={{flexDirection: 'row', marginLeft: 0, marginRight: 0}}
                buttonStyle={{flex: 1}}
                backgroundColor={'#45ceb1'}
            />
        </View>
    );
}

export {AddVisitsScreen};
