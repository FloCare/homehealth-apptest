import React from 'react';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import {View} from 'react-native';
import {diagnosisList, PrimaryColor} from '../../utils/constants';

function DiagnosisMultiSelect(locals) {
    if (locals.hidden) {
        return null;
    }
    return (
        <View>
            <View>
                <SectionedMultiSelect
                    items={diagnosisList}
                    uniqueKey='id'
                    subKey='children'
                    selectText='Diagnosis'
                    showDropDowns
                    readOnlyHeadings
                    onSelectedItemsChange={locals.config.onSelectedItemsChange}
                    selectedItems={locals.config.selectedItems}
                    colors={{primary: PrimaryColor}}
                />
            </View>
        </View>
    );
}


export default DiagnosisMultiSelect;
