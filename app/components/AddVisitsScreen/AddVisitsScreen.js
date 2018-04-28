import React from 'react';
import {View, FlatList} from 'react-native';
import {SearchBar, ListItem, Button} from 'react-native-elements';
import {Tag} from '../common/tag';
import {CustomButton} from "../common/CustomButton";

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

function AddVisitsScreen(props) {
    //TODO theres inconsistencies in whether the button lable is in caps or not
    return (
        <View style={{flex: 1}}>
            <SearchBar
                lightTheme
                placeholder='search patients or stops'
                onChangeText={props.onChangeText} />
            <View style={{flexDirection: 'row', flexWrap: 'wrap', margin: 16}}>
                {props.selectedItems.map((item) => <Tag text={item.name} onPress={() => props.onTagPress(item)} />)}
            </View>
            <FlatList
                data={props.listItems}
                renderItem={props.renderItem}
            />
            {/*<List>*/}
                {/*{props.listItems.map((item) => _createListItemComponent(item, props.onItemToggle))}*/}
            {/*</List>*/}
            <CustomButton
                title={'Done'}
                onPress={props.onDone}
            />
        </View>
    );
}

export {AddVisitsScreen};
