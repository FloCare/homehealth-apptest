import React, {Component} from 'react';
import {Text, View, Image, SectionList, TouchableOpacity} from 'react-native';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import styles from './styles';
import {PrimaryColor} from '../../utils/constants';

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
        if (item.patientID === selectedPatient) {
            return (
                <View
                    style={{paddingLeft: 5, paddingRight: 5, backgroundColor: PrimaryColor}}
                >
                    <View style={{flex: 10, flexDirection: 'row'}}>
                        <TouchableOpacity
                            style={{flex: 9, flexDirection: 'column'}}
                            onPress={({e}) => this.props.onItemPressed({item}, e)}
                        >
                            <Text style={styles.nameStyle}>{item.name}</Text>
                            <Text style={styles.addressStyle}>{item.address.streetAddress}</Text>
                        </TouchableOpacity>
                        <View style={{flex: 1, marginVertical: 15}}>
                            <Menu rendererProps={{placement: 'top'}}>
                                <MenuTrigger
                                    children={<Image source={require('../../../resources/threeDotButton.png')} />}
                                />
                                <MenuOptions>
                                    <MenuOption onSelect={() => onPressPopupButton('Notes', item)} >
                                        <Text style={{color: PrimaryColor}}>Add Notes</Text>
                                    </MenuOption>
                                    <MenuOption onSelect={() => onPressPopupButton('Call', item)} >
                                        <Text style={{color: PrimaryColor}}>Call</Text>
                                    </MenuOption>
                                    <MenuOption onSelect={() => onPressPopupButton('Maps', item)} >
                                        <Text style={{color: PrimaryColor}}>Show on maps</Text>
                                    </MenuOption>
                                    <MenuOption onSelect={() => onPressPopupButton('Visits', item)} >
                                        <Text style={{color: PrimaryColor}}>Add Visit</Text>
                                    </MenuOption>
                                </MenuOptions>
                            </Menu>
                        </View>
                    </View>
                </View>
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
                    <View style={{flex: 1, marginVertical: 15}}>
                        <Menu rendererProps={{placement: 'top'}}>
                            <MenuTrigger
                                children={<Image source={require('../../../resources/threeDotButton.png')} />}
                            />
                            <MenuOptions>
                                <MenuOption onSelect={() => onPressPopupButton('Notes', item)} >
                                    <Text style={{color: PrimaryColor}}>Add Notes</Text>
                                </MenuOption>
                                <MenuOption onSelect={() => onPressPopupButton('Call', item)} >
                                    <Text style={{color: PrimaryColor}}>Call</Text>
                                </MenuOption>
                                <MenuOption onSelect={() => onPressPopupButton('Maps', item)} >
                                    <Text style={{color: PrimaryColor}}>Show on maps</Text>
                                </MenuOption>
                                <MenuOption onSelect={() => onPressPopupButton('Visits', item)} >
                                    <Text style={{color: PrimaryColor}}>Add Visit</Text>
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
            <Text style={styles.sectionHeader}>{section.title}</Text>
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
