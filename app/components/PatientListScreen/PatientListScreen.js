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
            <View
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <StyledText
                    style={{
                        color: 'grey',
                        fontWeight: '200',
                        fontSize: 22
                    }}
                >No Patients</StyledText>

                <View
                    style={{
                        width: '75%'
                    }}
                >
                    <StyledText
                        style={{
                            textAlign: 'center',
                            padding: 0,
                            margin: 20,
                            marginTop: 5,
                            fontSize: 14,
                            color: 'grey',
                        }}
                    >When you add patients, you'll see them here
                    </StyledText>
                </View>
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
                    value={searchText}
                    onChangeText={(query) => {
                        onSearch(query);
                    }}
                    onClear={() => {
                        onSearch(null);
                    }}
                    placeholder='Search'
                    clearIcon={{color: '#86939e', name: 'cancel'}}
                />
                <MenuProvider customStyles={MenuProviderStyles}>
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

const styles2 = {
    backdrop: {
        backgroundColor: 'red'
    }
};

const MenuProviderStyles = {
    menuProviderWrapper: styles2.container,
    backdrop: styles2.backdrop
};

export {PatientListScreen};
