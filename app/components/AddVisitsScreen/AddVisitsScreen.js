import React from 'react';
import {View, FlatList} from 'react-native';
import {SearchBar, ListItem, List} from 'react-native-elements';
import {Tag} from '../common/tag';

function createListItemComponent(item, onItemToggle) {
    const avatar = item.type === 'patient' ? require('../../../resources/ic_fiber_pin_2x.png') : require('../../../resources/ic_location_on_black_24dp.png');
    const rightIcon = item.isSelected ? {name: 'check'} : {name: 'ac-unit'};
    console.log([item.type + item.id, item.name, item.address, avatar, rightIcon, onItemToggle].join(', '));
    return (
        <ListItem
            key={item.key}
            title={item.name}
            subtitle={item.address}
            avatar={avatar}
            rightIcon={rightIcon}
            onPressRightIcon={() => onItemToggle(item)}
        />
    );
}

function AddVisitsScreen(props) {
    console.log(`1111 ${props.listItems[0]}`);
    return (
        <View style={{flex: 1}}>
            <SearchBar onChangeText={props.onChangeText} />
            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                {props.selectedItems.map((item) => <Tag text={item.name} onPress={() => props.onTagPress(item)} />)}
            </View>
            <FlatList
                data={props.listItems}
                renderItem={({item}) => createListItemComponent(item, props.onItemToggle)}
            />
            {/*<List>*/}
                {/*{props.listItems.map((item) => createListItemComponent(item, props.onItemToggle))}*/}
            {/*</List>*/}
        </View>
    );
}

export {AddVisitsScreen};
