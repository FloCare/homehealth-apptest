import React from 'react';
import {View} from 'react-native';
import {SearchBar} from 'react-native-elements';
import styles from './styles';
import {SectionedPatientList} from '../SectionedPatientList';

const PatientListScreen = (props) => {
    const {onSearch, patientList, selectedPatient, onItemPressed} = props;
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
};

export {PatientListScreen};
