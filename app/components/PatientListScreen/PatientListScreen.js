import React from 'react';
import {View} from 'react-native';
import {SearchBar} from 'react-native-elements';
import {MenuProvider} from 'react-native-popup-menu';
import styles from './styles';
import {SectionedList} from '../common/SectionedList/SectionedList';
import EmptyStateButton from '../common/EmptyStateButton';
import StyledText from '../common/StyledText';

const PatientListScreen = (props) => {
    const {
        searchText,
        onSearch,
        patientList,
        selectedPatient,
        onItemPressed,
        patientCount,
        onPressAddPatient,
        onPressPopupButton,
        menu
    } = props;
    if (patientCount === 0) {
        return (
            <View style={styles.emptyStateContainerStyle}>
                <StyledText style={styles.emptyStateHeaderStyle}>
                    No Patients
                </StyledText>

                <View style={{width: '75%'}}>
                    <StyledText style={styles.emptyStateMessageStyle}>
                        When you add patients, you'll see them here
                    </StyledText>
                </View>
                <EmptyStateButton onPress={onPressAddPatient}>
                    Add Patient
                </EmptyStateButton>
            </View>
        );
    }
    return (
        <View style={styles.container.container}>
            <SearchBar
                round
                lightTheme
                disabled
                value={searchText}
                onChangeText={(query) => {
                    onSearch(query);
                }}
                onClear={() => {
                    onSearch(null);
                }}
                placeholder='Search'
                containerStyle={{backgroundColor: '#f8f8f8', borderBottomWidth: 0, borderTopWidth: 0}}
                inputStyle={{backgroundColor: 'white', color: 'black'}}
                clearIcon={{color: '#dddddd', name: 'cancel'}}
            />
            <MenuProvider>
                <SectionedList
                    onRefresh={props.onRefresh}
                    refreshing={props.refreshing}
                    itemList={patientList}
                    selectedItem={selectedPatient}
                    onItemPressed={onItemPressed}
                    onPressPopupButton={onPressPopupButton}
                    menu={menu}
                />
            </MenuProvider>
        </View>
    );
};

export {PatientListScreen};
