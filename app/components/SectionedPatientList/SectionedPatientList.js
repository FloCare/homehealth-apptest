import React, {Component} from 'react';
import {Text, View, Image, SectionList, TouchableOpacity} from 'react-native';
import styles from './styles';

class SectionedPatientList extends Component {
    constructor(props) {
        super(props);
        this.renderItem = this.renderItem.bind(this);
        this.renderSectionHeader = this.renderSectionHeader.bind(this);
        this.renderSeparator = this.renderSeparator.bind(this);
    }

    renderItem(item, selectedPatient) {
        if (item.patientID === selectedPatient) {
            return (
                <TouchableOpacity
                    style={{paddingLeft: 5, paddingRight: 5, backgroundColor: '#ff9999'}}
                    onPress={({e}) => this.props.onItemPressed({item}, e)}
                >
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <View style={{flex: 1, flexDirection: 'column'}}>
                            <Text style={styles.nameStyle}>{item.name}</Text>
                            <Text style={styles.addressStyle}>{item.address.streetAddress}</Text>
                        </View>
                        <TouchableOpacity style={{marginVertical: 15}} onPress={() => {console.log('More button pressed')}}>
                            <Image source={require('../../../resources/threeDotButton.png')} />
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            );
        }
        return (
            <View
                style={{paddingLeft: 5, paddingRight: 5, backgroundColor: '#ffffff'}}
            >
                <View style={{flex: 10, flexDirection: 'row'}}>
                    <TouchableOpacity
                        style={{flex: 9, flexDirection: 'column'}}
                        onPress={({e}) => this.props.onItemPressed({item}, e)}
                    >
                        <Text style={styles.nameStyle}>{item.name}</Text>
                        <Text style={styles.addressStyle}>{item.address.streetAddress}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1, marginVertical: 15}} onPress={() => {console.log('More button pressed')}}>
                        <Image source={require('../../../resources/threeDotButton.png')} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    renderSectionHeader({section}) {
        return (
            <Text style={styles.sectionHeader}>{section.title}</Text>
        );
    }

    renderSeparator() {
        return (
            <View style={styles.seperatorStyle} />
        );
    }

    render() {
        const {selectedPatient} = this.props;
        return (
            <SectionList
                sections={this.props.patientList}
                renderItem={({item}) => this.renderItem(item, selectedPatient)}
                renderSectionHeader={this.renderSectionHeader}
                ItemSeparatorComponent={this.renderSeparator}
                keyExtractor={(item, index) => index}
            />
        );
    }
}

export {SectionedPatientList};
