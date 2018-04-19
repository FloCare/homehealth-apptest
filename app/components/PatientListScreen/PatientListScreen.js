import React from 'react';
import {View} from 'react-native';
import {SearchBar} from 'react-native-elements';
import styles from './styles';
import {SectionedPatientList} from '../SectionedPatientList';

const PatientListScreen = (props) => {
    return (
        <View style={styles.container}>
            <SearchBar
                round
                lightTheme
                disabled
                onChangeText={(query) => {
                    props.onSearch(query);
                }}
                onClear={() => {
                    props.onSearch(null);
                }}
                placeholder='Search'
            />
            <SectionedPatientList
                patientList={props.patientList}
                selectedPatient={props.selectedPatient}
                onItemPressed={props.onItemPressed}
            />
        </View>
    );
};

export {PatientListScreen};
