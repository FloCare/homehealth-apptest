import React from 'react';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import {View} from 'react-native';


const items = [
    {
        name: 'Diagnosis',
        id: 0,
        children: [{
            name: 'ADHD',
            id: 10,
        }, {
            name: 'BLA',
            id: 17,
        }, {
            name: 'BLAH',
            id: 13,
        }, {
            name: 'BLAHH',
            id: 14,
        }, {
            name: 'BLAHHH',
            id: 15,
        }, {
            name: 'BLAHHHH',
            id: 16,
        }]
    },
];

function DiagnosisMultiSelect(locals) {
    console.log('========================================');
    console.log('INSIDE Diagnosis');
    console.log('========================================');

    if (locals.hidden) {
        return null;
    }
    return (
        <View>
            <View>
                <SectionedMultiSelect
                    items={items}
                    uniqueKey='id'
                    subKey='children'
                    selectText='Diagnosis'
                    showDropDowns
                    readOnlyHeadings
                    onSelectedItemsChange={() => { console.log('halsflasjfjalsf'); }}
                    selectedItems={{}}
                />
            </View>
        </View>
    );
}


export default DiagnosisMultiSelect;
