import React, {Component} from 'react';
import {View, SectionList, TouchableOpacity} from 'react-native';
import styles from './styles';
import StyledText from '../common/StyledText';

class SectionedStopList extends Component {
    constructor(props) {
        super(props);
        this.renderItem = this.renderItem.bind(this);
        this.renderSectionHeader = this.renderSectionHeader.bind(this);
        this.renderSeparator = this.renderSeparator.bind(this);
    }

    renderItem(item, selectedStop) {
        if (item.placeID === selectedStop) {
            return (
                <TouchableOpacity
                    style={{paddingLeft: 5, paddingRight: 5, backgroundColor: '#ff9999'}}
                    onPress={() => { console.log('Nowhere to go!'); }}
                >
                    <StyledText style={styles.nameStyle}>{item.name}</StyledText>
                    <StyledText style={styles.addressStyle}>{item.address.streetAddress}</StyledText>
                </TouchableOpacity>
            );
        }
        return (
            <TouchableOpacity
                style={{paddingLeft: 5, paddingRight: 5, backgroundColor: '#ffffff'}}
                onPress={() => { console.log('Nowhere to go!'); }}
            >
                <StyledText style={styles.nameStyle}>{item.name}</StyledText>
                <StyledText style={styles.addressStyle}>{item.address.streetAddress}</StyledText>
            </TouchableOpacity>
        );
    }

    renderSectionHeader({section}) {
        return (
            <StyledText style={styles.sectionHeader}>{section.title}</StyledText>
        );
    }

    renderSeparator() {
        return (
            <View style={styles.seperatorStyle} />
        );
    }

    render() {
        const {selectedStop} = this.props;
        return (
            <SectionList
                sections={this.props.stopList}
                renderItem={({item}) => this.renderItem(item, selectedStop)}
                renderSectionHeader={this.renderSectionHeader}
                ItemSeparatorComponent={this.renderSeparator}
                keyExtractor={(item, index) => index}
            />
        );
    }
}

export {SectionedStopList};
