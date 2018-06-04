import React from 'react';
import {View} from 'react-native';
import {SearchBar} from 'react-native-elements';
import {MenuProvider} from 'react-native-popup-menu';
import styles from './styles';
import {SectionedList} from '../common/SectionedList/SectionedList';
import EmptyStateButton from '../common/EmptyStateButton';
import StyledText from '../common/StyledText';

const StopListScreen = (props) => {
    const {searchText, onSearch, stopList, selectedStop, onPressAddStop, stopCount, menu, onPressPopupButton} = props;
    if (stopCount === 0) {
        return (
            <View style={styles.container.container}>
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
                            fontWeight: '300',
                            fontSize: 20
                        }}
                    >No Places</StyledText>
                    <View
                        style={{
                            flexDirection: 'row',
                            flexWarp: 'wrap',
                            marginTop: 5,
                            marginBottom: 20,
                        }}
                    >
                        <StyledText style={{color: 'grey', paddingHorizontal: 40, textAlign: 'center'}}>When you add places, you'll see them here</StyledText>
                    </View>
                    <EmptyStateButton
                        onPress={onPressAddStop}
                    >
                        Add Place
                    </EmptyStateButton>
                </View>
            </View>
        );
    } 
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
                containerStyle={{backgroundColor: '#f8f8f8', borderBottomWidth: 0, borderTopWidth: 0}}
                inputStyle={{backgroundColor: 'white', color: 'black'}}
                clearIcon={{color: '#dddddd', name: 'cancel'}}
            />
            <MenuProvider>
                <SectionedList
                    itemList={stopList}
                    selectedItem={selectedStop}
                    menu={menu}
                    onItemPressed={() => { console.log('Stop pressed'); }}
                    onPressPopupButton={onPressPopupButton}
                />
            </MenuProvider>
        </View>
    );
};

export {StopListScreen};
