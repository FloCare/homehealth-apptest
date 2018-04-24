import React from 'react';
import {View, Text, TextInput, FlatList} from 'react-native';
import {Button, SearchBar, ListItem} from 'react-native-elements';
//import styles from './`';

// createListItemComponent = (item, onItemToggle) => {
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

const renderItem = (item, onItemSelect) => {
    return (
        <ListItem
            key={item.patientID}
            title={item.name}
            subtitle={item.address.streetAddress}
            onPress={() => onItemSelect(item)}
        />
    );
};

const AddNoteFormWithoutPatientTag = (props) => {
    const {
        value,
        name,
        patientList,
        onChangeText,
        onChangeSearchText,
        onItemSelect,
        handleSubmit,
        searchRef,
        searching,
        setNoSearching
    } = props;

    return (
        <View style={{flex: 1}}>
            <SearchBar
                ref={searchRef}
                onChangeText={onChangeSearchText}
                placeholder='Search a patient name'
                clearIcon={{color: '#fffff', name: 'close'}}
                onClear={setNoSearching}
            />
            {!searching && (name) &&
            <View style={{flex: 1, backgroundColor: '#a2a2a2', borderWidth: 3, borderColor: '#000'}}>
                <Text style={{flex: 1, textAlign: 'center', textAlignVertical: 'center', fontWeight: 'bold', fontSize: 14}}>{name}</Text>
            </View>
            }
            {searching &&
            <FlatList
                data={patientList}
                renderItem={({item}) => renderItem(item, onItemSelect)}
            />
            }
            {!searching &&
                <View
                    style={{
                        borderColor: '#000',
                        borderWidth: 3,
                        backgroundColor: '#a2a2a2'
                    }}
                >
                    <TextInput
                        style={{textAlignVertical: 'top'}}
                        placeholder='Please type your notes here ...'
                        multiline
                        numberOfLines={20}
                        onChangeText={onChangeText}
                        value={value}
                    />
                </View>
            }
            <Button
                disabled={searching || (!name)}
                large
                title={'Save'}
                onPress={handleSubmit}
                buttonStyle={{
                    backgroundColor: '#45ceb1'
                }}
            />
        </View>
    );
};

export {AddNoteFormWithoutPatientTag};
