import React from 'react';
import {Dimensions, View, TouchableOpacity} from 'react-native';
import {styles} from '../common/styles';
import {CustomCheckBox} from '../common/CustomCheckBox';
import StyledText from '../common/StyledText';

function taskCard(task, onPress) {
    return (
        <View style={{flexDirection: 'row', marginRight: 10, width: 0.95 * Dimensions.get('screen').width, marginVertical: 3}}>
            <View style={{justifyContent: 'space-around'}}>
                <CustomCheckBox
                    checked={false}
                    onPress={() => {}}
                    checkBoxStyle={{width: 20, height: 20, alignSelf: 'flex-start', marginTop: 10}}
                    checkBoxContainerStyle={{width: 40, justifyContent: 'center'}}
                />
            </View>
            <TouchableOpacity
                onPress={onPress}
                style={[
                    styles.cardContainerStyle,
                    {flex: 8, marginTop: 2, marginBottom: 2, flexDirection: 'row', shadowRadius: 1}
                ]}
            >
                <View style={{flex: 1, margin: 15, marginLeft: 25}}>
                    <StyledText style={{marginVertical: 5}}>
                        {task.body}
                    </StyledText>
                    {
                        task.patientName
                            && <StyledText
                                    style={{fontSize: 9, fontWeight: '300'}}
                            >
                                    {task.patientName}
                                </StyledText>
                    }
                </View>
            </TouchableOpacity>
        </View>
    );
}
export function TaskSection(props) {
    return (
        <View style={{flex: 1, marginVertical: 20, alignItems: 'center'}} >
            <StyledText
                style={{fontSize: 12}}
            >
                {`My Task ${props.tasks.length}`}
            </StyledText>

            {
                 props.tasks.map(task => taskCard(task))
            }
        </View>
    );
}
