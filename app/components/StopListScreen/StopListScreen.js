import React from 'react';
import {View} from 'react-native';
import {SearchBar} from 'react-native-elements';
import styles from './styles';
import {SectionedStopList} from '../SectionedStopList';

const StopListScreen = (props) => {
    const {onSearch, stopList, selectedStop, onItemPressed} = props;
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
};

export {StopListScreen};
