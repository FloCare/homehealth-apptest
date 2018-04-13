import React from 'react';
import {Text, View, SectionList} from 'react-native';
import {SearchBar} from 'react-native-elements';
import styles from './styles';

const renderItem = ({item}) => {
    return (
        <View style={{ paddingLeft: 5, paddingRight: 5, backgroundColor: '#ffffff' }}>
            <Text style={styles.nameStyle}>{item.name}</Text>
            <Text style={styles.addressStyle}>{item.address}</Text>
        </View>
    );
};

const getSections = () => {
    const sections = [
        {title: 'D', data: [{name:'Devin', address: 'HRX'}]},
        {title: 'J', data: [{name:'Jackson', address: 'HRX'},{name:'James', address: 'HRX'},{name:'Jillian', address: 'HRX'},]},
        {title: 'J', data: [{name:'Jackson', address: 'HRX'},{name:'James', address: 'HRX'},{name:'Jillian', address: 'HRX'},]},
        {title: 'J', data: [{name:'Jackson', address: 'HRX'},{name:'James', address: 'HRX'},{name:'Jillian', address: 'HRX'},]},
        {title: 'J', data: [{name:'Jackson', address: 'HRX'},{name:'James', address: 'HRX'},{name:'Jillian', address: 'HRX'},]},
        {title: 'J', data: [{name:'Jackson', address: 'HRX'},{name:'James', address: 'HRX'},{name:'Jillian', address: 'HRX'},]},
    ];
    return sections;
};

const renderSectionHeader = ({ section }) => {
    return (
        <Text style={styles.sectionHeader}>{section.title}</Text>
    );
};

const renderSeparator = () => {
    return (
        <View style={styles.seperatorStyle} />
    );
};

const PatientListScreen = () => {
    return (
        <View style={styles.container}>
            <SearchBar
                round
                lightTheme
                disabled
                onChangeText={(text) => {
                    console.log(text);
                    //Update the sections in state here
                }}
                onClear={() => {
                    //TODO
                    //reset the sections to default
                }}
                placeholder='Search'
            />
            <SectionList
                sections={getSections()}
                renderItem={renderItem}
                renderSectionHeader={renderSectionHeader}
                ItemSeparatorComponent={renderSeparator}
                keyExtractor={(item, index) => index}
            />
        </View>
    );
};

export {PatientListScreen};
