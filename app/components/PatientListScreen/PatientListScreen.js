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
                    <View 
                        style={{
                            flexDirection: 'row', 
                            flexWarp: 'wrap',
                            marginTop: 5,
                            marginBottom: 20
                        }}
                    >
                        <Text>When you add patients, you'll see them here</Text>
                    </View>
                    <EmptyStateButton 
                        onPress={onPressAddPatient}
                    >
                        Add Patient
                    </EmptyStateButton>
                </View>
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
