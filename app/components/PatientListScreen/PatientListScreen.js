import React from 'react';
import {View} from 'react-native';
import {SearchBar} from 'react-native-elements';
import {MenuProvider} from 'react-native-popup-menu';
import styles from './styles';
import {SectionedPatientList} from '../SectionedPatientList';
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
        onPressPopupButton
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
    } else {
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
                    <SectionedPatientList
                        patientList={patientList}
                        selectedPatient={selectedPatient}
                        onItemPressed={onItemPressed}
                        onPressPopupButton={onPressPopupButton}
                    />
                </MenuProvider>
            </View>
        );
    }
};

export {PatientListScreen};
