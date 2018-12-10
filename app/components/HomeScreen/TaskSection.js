import React, {Component} from 'react';
import {Dimensions, View, TouchableOpacity} from 'react-native';
import {styles} from '../common/styles';
import {CustomCheckBox} from '../common/CustomCheckBox';
import StyledText from '../common/StyledText';
import {TaskService} from '../../data_services/TaskService';
import {screenNames} from '../../utils/constants';

const shadowStyle = {
    shadowRadius: 5,
    shadowColor: 'rgba(36, 23, 38, 0.16)',
    shadowOffset: {
        width: -0.1,
        height: 1.5
    },
    shadowOpacity: 1,
};

export class TaskSection extends Component {
    constructor(props) {
        super(props);
        this.subscriber = TaskService.getInstance().subscribeToFlatTasksForDay(props.midnightEpoch, this.setTasks.bind(this));
        this.state = {};
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.midnightEpoch !== this.props.midnightEpoch) {
            this.subscriber();
            this.setState({});
            this.subscriber = TaskService.getInstance().subscribeToFlatTasksForDay(nextProps.midnightEpoch, this.setTasks.bind(this));
        }
    }

    componentWillUnmount() {
        this.subscriber();
    }

    setTasks(tasks) {
        this.setState({tasks});
    }

    taskCard(task, onPressCard, checkBoxDisabled = false) {
        if (!onPressCard && task.taskID) {
            onPressCard = this.taskModalGenerator(task.body, task.taskID);
        }
        const TaskComponent = onPressCard ? TouchableOpacity : View;
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
                <TaskComponent
                    onPress={onPressCard}
                    style={[
                        styles.cardContainerStyle,
                        shadowStyle,
                        {flex: 8, marginTop: 2, marginBottom: 2, flexDirection: 'row'}
                    ]}
                >
                    <View style={{flex: 1, margin: 8, marginLeft: 25}}>
                        <StyledText style={{marginVertical: 5, color: task.color, fontSize: 16}}>
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
                </TaskComponent>
            </View>
        );
    }

    taskModalGenerator(taskBody, taskID) {
        const func = () => {
            this.props.navigator.showLightBox({
                screen: screenNames.addTaskComponent,
                style: {
                    backgroundBlur: 'dark',
                    backgroundColor: '#00000070',
                    tapBackgroundToDismiss: true
                },
                passProps: {
                    existingText: taskBody,
                    onSubmit: ((text) => this.taskSubmitHandler(text, taskID)),
                    onDismiss: (() => this.props.navigator.dismissLightBox())
                }
            });
        };
        return func.bind(this);
    }

    taskSubmitHandler(text, taskID) {
        this.props.navigator.dismissLightBox();
        if (text && text.length !== 0) {
            if (!taskID) {
                TaskService.getInstance().createNewTask(text, this.props.midnightEpoch);
            } else { TaskService.getInstance().editTask(text, taskID); }
        }
    }

    render() {
        let firstTaskCard;
        if (this.props.dateMinusToday >= 0) {
            firstTaskCard = this.taskCard({body: '+ Add Task'}, this.taskModalGenerator(), true);
        } else if (!this.state.tasks || this.state.tasks.length === 0) {
            firstTaskCard = this.taskCard({body: "You didn't have any tasks", color: 'grey'}, undefined, true);
        } else firstTaskCard = undefined;

        return (
            <View style={{marginVertical: 20, alignItems: 'center'}}>
                <StyledText
                    style={{fontSize: 12, color: '#999999'}}
                >
                    {'My Task'}
                </StyledText>
                {firstTaskCard}
                {
                    this.state.tasks ? this.state.tasks.map(task => this.taskCard({...task, color: 'black'})) : undefined
                }
            </View>
        );
    }
}
