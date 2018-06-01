import React, {Component} from 'react';
import {View, Image, SectionList, TouchableOpacity} from 'react-native';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger
} from 'react-native-popup-menu';
import styles from './styles';
import {TransparentPrimaryColor} from '../../utils/constants';
import StyledText from '../common/StyledText';
import {Images} from '../../Images';
import CustomMenuRenderer from '../common/CustomMenuRenderer';

// const CustomMenu = (props) => {
//     const {style, children, layouts, ...other} = props;
//     //const position = {top: layouts.triggerLayout.y, left: layouts.triggerLayout.x};
//     const position = {top: layouts.optionsLayout.height, left: layouts.optionsLayout.width};
//     console.log('position:', position);
//     return (
//         <View {...other} style={[style, position]}>
//             {children}
//         </View>
//     );
// };

class SectionedPatientList extends Component {
    constructor(props) {
        super(props);
        this.renderItem = this.renderItem.bind(this);
        this.renderSectionHeader = this.renderSectionHeader.bind(this);
        this.renderSeparator = this.renderSeparator.bind(this);
    }

    renderItem(item, selectedPatient, onPressPopupButton) {
        let backgroundColor = '#ffffff';
        if (item.patientID === selectedPatient) {
            backgroundColor = TransparentPrimaryColor(0.3);
        }
        return (
            <View
                style={{paddingLeft: 5, paddingRight: 5, backgroundColor}}
            >
                <View style={{flex: 10, flexDirection: 'row'}}>
                    <TouchableOpacity
                        style={{flex: 9, flexDirection: 'column'}}
                        onPress={({e}) => this.props.onItemPressed({item}, e)}
                    >
                        <StyledText style={styles.nameStyle}>{item.name}</StyledText>
                        <StyledText style={styles.addressStyle}>{item.address.formattedAddress}</StyledText>
                    </TouchableOpacity>
                    <View style={{flex: 1, marginVertical: 15}}>
                        <Menu renderer={CustomMenuRenderer} rendererProps={styles.rendererStyle}>
                            <MenuTrigger
                                children={<Image source={Images.threeDotButton} />}
                            />
                            <MenuOptions>
                                <MenuOption onSelect={() => onPressPopupButton('Notes', item)} >
                                    <StyledText style={styles.menuOptionsStyle}>Add Notes</StyledText>
                                </MenuOption>
                                <MenuOption onSelect={() => onPressPopupButton('Call', item)} >
                                    <StyledText style={styles.menuOptionsStyle}>Call</StyledText>
                                </MenuOption>
                                <MenuOption onSelect={() => onPressPopupButton('Maps', item)} >
                                    <StyledText style={styles.menuOptionsStyle}>Show on maps</StyledText>
                                </MenuOption>
                                <MenuOption onSelect={() => onPressPopupButton('Visits', item)} >
                                    <StyledText style={styles.menuOptionsStyle}>Add Visit</StyledText>
                                </MenuOption>
                                <MenuOption onSelect={() => onPressPopupButton('DeletePatient', item)} >
                                    <StyledText style={styles.menuOptionsStyle}>Remove Patient</StyledText>
                                </MenuOption>
                            </MenuOptions>
                        </Menu>
                    </View>
                </View>
            </View>
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
        const {selectedPatient, onPressPopupButton} = this.props;
        return (
            <SectionList
                sections={this.props.patientList}
                renderItem={({item}) => this.renderItem(item, selectedPatient, onPressPopupButton)}
                renderSectionHeader={this.renderSectionHeader}
                ItemSeparatorComponent={this.renderSeparator}
                keyExtractor={(item, index) => index}
            />
        );
    }
}

export {SectionedPatientList};
