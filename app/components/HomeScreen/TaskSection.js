import React, {Component} from 'react';
import {Dimensions, View, TouchableOpacity} from 'react-native';
import {styles} from '../common/styles';
import {CustomCheckBox} from '../common/CustomCheckBox';
import StyledText from '../common/StyledText';
import {TaskService} from '../../data_services/TaskService';
import {screenNames} from '../../utils/constants';

function taskCard(task, onPressCard, checkBoxDisabled = false) {
    return (
        <View
            style={{
                flexDirection: 'row',
                marginRight: 10,
                width: 0.95 * Dimensions.get('screen').width,
                marginVertical: 3
            }}
        >
            <View style={{justifyContent: 'space-around'}}>
                <CustomCheckBox
                    checked={task.isDone}
                    disabled={checkBoxDisabled}
                    onPress={() => TaskService.getInstance().flipTaskDoneStatus(task.taskID)}
                    checkBoxStyle={{width: 20, height: 20, alignSelf: 'flex-start', marginTop: 10}}
                    checkBoxContainerStyle={{width: 40, justifyContent: 'center'}}
                />
            </View>
            <TouchableOpacity
                onPress={onPressCard}
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

export class TaskSection extends Component {
    constructor(props) {
        super(props);
        this.subscriber = TaskService.getInstance().subscribeToFlatTasksForDay(props.midnightEpoch, this.setTasks.bind(this));
        this.state = {};
    }

    componentWillUnmount() {
        this.subscriber();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.midnightEpoch !== this.props.midnightEpoch) {
            this.subscriber();
            this.setState({});
            this.subscriber = TaskService.getInstance().subscribeToFlatTasksForDay(nextProps.midnightEpoch, this.setTasks.bind(this));
        }
    }

    setTasks(tasks) {
        this.setState({tasks});
    }

    newTaskSubmitHandler(text) {
        this.props.navigator.dismissLightBox();
        if (text && text.length !== 0) {
            TaskService.getInstance().createNewTask(text, this.props.midnightEpoch);
        }
    }

    render() {
        if ((!this.state.tasks || this.state.tasks.length === 0) && (this.props.dateMinusToday < 0)) {
            return null;
        }
        return (
            <View style={{flex: 1, marginVertical: 20, alignItems: 'center'}}>
                <StyledText
                    style={{fontSize: 12}}
                >
                    {'My Task'}
                </StyledText>
                {
                    this.props.dateMinusToday >= 0 ?
                        taskCard({body: '+ Add Task'}, () => this.props.navigator.showLightBox({
                            screen: screenNames.addTaskComponent,
                            style: {
                                backgroundBlur: 'dark',
                                backgroundColor: '#00000070',
                                tapBackgroundToDismiss: true
                            },
                            passProps: {
                                onSubmit: this.newTaskSubmitHandler.bind(this)
                            }
                        }), true)
                        : undefined
                }
                {
                    this.state.tasks ? this.state.tasks.map(task => taskCard(task)) : undefined
                }
            </View>
        );
    }
}
