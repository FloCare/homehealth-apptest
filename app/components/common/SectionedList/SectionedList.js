import React, {Component} from 'react';
import {View, Image, SectionList, TouchableOpacity} from 'react-native';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger
} from 'react-native-popup-menu';
import styles from './styles';
import {PrimaryColor, TransparentPrimaryColor} from '../../../utils/constants';
import StyledText from '../../common/StyledText';
import {Images} from '../../../Images';
import CustomMenuRenderer from '../CustomMenuRenderer';

class SectionedList extends Component {
    constructor(props) {
        super(props);
        this.renderItem = this.renderItem.bind(this);
        this.renderSectionHeader = this.renderSectionHeader.bind(this);
        this.renderSeparator = this.renderSeparator.bind(this);
        this._renderMenu = this._renderMenu.bind(this);
    }

    _renderMenu(item, onPressPopupButton, menuItems) {
        const menu = [];
        menuItems.forEach((menuItem) => {
            if (menuItem.localOnly && !item.isLocallyOwned) { return; }
            menu.push(
                <MenuOption onSelect={() => onPressPopupButton(menuItem.id, item)}>
                    <StyledText style={styles.menuOptionsStyle}>{menuItem.title}</StyledText>
                </MenuOption>
            );
        });
        return menu;
    }

    renderItem(item, selectedItem, onPressPopupButton, menu) {
        let backgroundColor = '#ffffff';
        if (item.key === selectedItem) {
            backgroundColor = TransparentPrimaryColor(0.3);
        }
        return (
            <TouchableOpacity
                style={{flex: 1, marginHorizontal: 5, flexDirection: 'row', alignItems: 'center', backgroundColor}}
                onPress={({e}) => this.props.onItemPressed({item}, e)}
            >
                <View
                    style={{marginLeft: 5, backgroundColor: item.recentlyAssigned ? PrimaryColor : 'clear', width: 7, height: 7, borderRadius: 7}}
                />
                <View>
                    <StyledText style={styles.nameStyle}>{item.name}</StyledText>
                    <StyledText style={styles.addressStyle}>{item.address.formattedAddress}</StyledText>
                </View>
            </TouchableOpacity>
        );
        // {/*<View style={{flex: 1, marginVertical: 15}}>*/}
        // {/*<Menu renderer={CustomMenuRenderer} rendererProps={styles.rendererStyle}>*/}
        // {/*<MenuTrigger*/}
        // {/*children={<Image source={Images.threeDotButton} />}*/}
        // {/*/>*/}
        // {/*<MenuOptions>*/}
        // {/*{this._renderMenu(item, onPressPopupButton, menu)}*/}
        // {/*</MenuOptions>*/}
        // {/*</Menu>*/}
        // {/*</View>*/}
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
        const {selectedItem, onPressPopupButton, menu} = this.props;
        return (
            <SectionList
                onRefresh={this.props.onRefresh}
                refreshing={this.props.refreshing}
                sections={this.props.itemList}
                renderItem={({item}) => this.renderItem(item, selectedItem, onPressPopupButton, menu)}
                renderSectionHeader={this.renderSectionHeader}
                ItemSeparatorComponent={this.renderSeparator}
                keyExtractor={(item, index) => index}
            />
        );
    }
}

export {SectionedList};
