import React from 'react';
import {View, Text} from 'react-native';
import {SearchBar} from 'react-native-elements';
import styles from './styles';
import {SectionedStopList} from '../SectionedStopList';
import EmptyStateButton from '../common/EmptyStateButton';

const StopListScreen = (props) => {
    const {onSearch, stopList, selectedStop, onPressAddStop, stopCount} = props;
    if (stopCount === 0) {
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
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Text
                        style={{
                            fontWeight: '300',
                            fontSize: 20
                        }}
                    >No Places</Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            flexWarp: 'wrap',
                            marginTop: 5,
                            marginBottom: 20
                        }}
                    >
                        <Text>When you add places, you'll see them here</Text>
                    </View>
                    <EmptyStateButton
                        onPress={onPressAddStop}
                    >
                        Add Place
                    </EmptyStateButton>
                </View>
            </View>
        );
    } else {
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
                <SectionedStopList
                    stopList={stopList}
                    selectedStop={selectedStop}
                />
            </View>
        );
    }
};

export {StopListScreen};
