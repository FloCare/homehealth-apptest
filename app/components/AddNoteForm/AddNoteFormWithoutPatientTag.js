import React from 'react';
import {View, Text, TextInput, FlatList} from 'react-native';
import {Button, SearchBar, ListItem} from 'react-native-elements';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';

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
        <View style={{flex: 10, justifyContent: 'space-between'}}>
            <SearchBar
                ref={searchRef}
                onChangeText={onChangeSearchText}
                placeholder='Search a patient name'
                clearIcon={{name: 'close'}}
                onClear={setNoSearching}
                round
                lightTheme
            />
            {!searching && (name) &&
            <View style={{backgroundColor: '#e1e8ee', borderWidth: 1, borderColor: '#a2a2a2', height: 50}}>
                <Text
                    style={{
                        flex: 1,
                        textAlign: 'left',
                        textAlignVertical: 'center',
                        fontWeight: '200',
                        fontSize: 23,
                        paddingLeft: 10,
                        paddingRight: 10
                    }}
                >{name}</Text>
            </View>
            }
            {searching &&
            <FlatList
                data={patientList}
                renderItem={({item}) => renderItem(item, onItemSelect)}
            />
            }
            {!searching && name &&
                <KeyboardAwareScrollView
                    style={{
                        flex: 9,
                        borderColor: '#a2a2a2',
                        borderBottomWidth: 1,
                        backgroundColor: '#e1e8ee'
                    }}
                    keyboardShouldPersistTaps='handled'
                >
                    <TextInput
                        style={{textAlignVertical: 'top', paddingLeft: 10, paddingRight: 10}}
                        placeholder='Please type your notes here ...'
                        multiline
                        numberOfLines={20}
                        onChangeText={onChangeText}
                        value={value}
                    />
                </KeyboardAwareScrollView>
            }
            <Button
                disabled={searching || (!name)}
                title='Save'
                onPress={handleSubmit}
                containerViewStyle={{marginLeft: 0, marginRight: 0}}
                buttonStyle={styles.buttonStyle}
            />
        </View>
    );
};

export {AddNoteFormWithoutPatientTag};
