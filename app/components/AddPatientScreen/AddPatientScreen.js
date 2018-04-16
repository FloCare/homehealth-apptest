import React, {Component} from 'react';
import {View} from 'react-native';
import {Button} from 'react-native-elements';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import styles from './styles';
import {AddPatientForm} from '../AddPatientForm';

class AddPatientScreen extends Component {
    /*
        Presentational component - has for a form and button as children
     */
    render() {
        const {refName, onSubmit, onChange, value, items, onSelectedItemsChange, selectedItems} = this.props;
        return (
            <View style={styles.containerStyle}>
                <AddPatientForm
                    refName={refName}
                    onChange={onChange}
                    value={value}
                />
                <SectionedMultiSelect
                    items={items}
                    uniqueKey='id'
                    subKey='children'
                    selectText='Diagnosis'
                    showDropDowns
                    readOnlyHeadings
                    onSelectedItemsChange={onSelectedItemsChange}
                    selectedItems={selectedItems}
                />
                <Button
                    buttonStyle={styles.buttonStyle}
                    title='Save'
                    onPress={onSubmit}
                />
            </View>
        );
    }
}

export { AddPatientScreen };
