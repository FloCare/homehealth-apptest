import React from 'react';
import {View, Text} from 'react-native';
import {SearchBar} from 'react-native-elements';
import styles from './styles';
import {SectionedPatientList} from '../SectionedPatientList';
import EmptyStateButton from '../common/EmptyStateButton';

const PatientListScreen = (props) => {
    const {
        onSearch,
        patientList,
        selectedPatient,
        onItemPressed,
        patientCount,
        onPressAddPatient
    } = props;
    if (patientCount === 0) {
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

                <Text style={{
                    textAlign: 'center',
                    padding: 0,
                    margin: 20,
                    marginTop: 5,
                }}>
                    When you add patients, you'll see them here
                </Text>
                <EmptyStateButton
                    onPress={onPressAddPatient}
                >
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
                    onChangeText={(query) => {
                        onSearch(query);
                    }}
                    onClear={() => {
                        onSearch(null);
                    }}
                    placeholder='Search'
                />
                <SectionedPatientList
                    patientList={patientList}
                    selectedPatient={selectedPatient}
                    onItemPressed={onItemPressed}
                />
            </View>
        );
    }
};

export {PatientListScreen};
