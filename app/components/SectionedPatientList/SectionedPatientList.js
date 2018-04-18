import React, {Component} from 'react';
import {Text, View, SectionList, TouchableOpacity} from 'react-native';
import styles from './styles';

class SectionedPatientList extends Component {
    constructor(props) {
        super(props);
        this.renderItem = this.renderItem.bind(this);
        this.renderSectionHeader = this.renderSectionHeader.bind(this);
        this.renderSeparator = this.renderSeparator.bind(this);
    }

    renderItem(item) {
        return (
            <TouchableOpacity
                style={{paddingLeft: 5, paddingRight: 5, backgroundColor: '#ffffff'}}
                onPress={({e}) => this.props.onItemPressed({item}, e)}
            >
                <Text style={styles.nameStyle}>{item.name}</Text>
                <Text style={styles.addressStyle}>{item.streetAddress}</Text>
            </TouchableOpacity>
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
        return (
            <SectionList
                sections={this.props.patientList}
                renderItem={({item}) => this.renderItem(item)}
                renderSectionHeader={this.renderSectionHeader}
                ItemSeparatorComponent={this.renderSeparator}
                keyExtractor={(item, index) => index}
            />
        );
    }
}

export {SectionedPatientList};