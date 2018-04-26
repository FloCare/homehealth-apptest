import React, {Component} from 'react';
import {View} from 'react-native';
import moment from 'moment';
import {floDB, Visit} from '../../utils/data/schema';
import {HomeScreen} from './HomeScreen';
import {screenNames} from '../../utils/constants';
import Fab from '../common/Fab';

class HomeScreenContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: moment().utc().startOf('day')
        };

        this.navigateToVisitListScreen = this.navigateToVisitListScreen.bind(this);
        this.navigateToVisitMapScreen = this.navigateToVisitMapScreen.bind(this);
        this.onDateSelected = this.onDateSelected.bind(this);
        this.navigateToAddNote = this.navigateToAddNote.bind(this);
        this.navigateToAddPatient = this.navigateToAddPatient.bind(this);
        this.navigateToAddVisit = this.navigateToAddVisit.bind(this);
    }
    
    onDateSelected(date) {
        if (!date.isSame(this.state.date, 'day')) {
            this.setState({date});
        }
        console.log(date.format());
    }

    navigateToVisitListScreen() {
        this.props.navigator.push({
            screen: screenNames.visitListScreen,
            passProps: {
                date: this.state.date
            },
            navigatorStyle: {
                tabBarHidden: true
            },
            navigatorButtons: {
                rightButtons: [{
                    id: 'calendar-picker-visits',
                    title: 'pick',
                    // component: 'CalendarPickerButton',
                    // passProps: {
                    //     currentDate: this.state.date
                    // }
                }]
            }
        });
    }

    navigateToVisitMapScreen() {
        this.props.navigator.push({
            screen: screenNames.visitMapScreen,
            passProps: {
                date: this.state.date
            },
            navigatorStyle: {
                tabBarHidden: true
            },
            navigatorButtons: {
                rightButtons: [{
                    id: 'calendar-picker-visits',
                    title: 'pick',
                    // component: 'CalendarPickerButton',
                    // passProps: {
                    //     currentDate: this.state.date
                    // }
                }]
            }
        });
    }

    navigateToAddNote() {
        this.props.navigator.push({
            screen: screenNames.addNote,
            navigatorStyle: {
                tabBarHidden: true
            }
        });
    }

    navigateToAddPatient() {
        this.props.navigator.push({
            screen: screenNames.addPatient,
            navigatorStyle: {
                tabBarHidden: true
            }
        });
    }

    navigateToAddVisit() {
        this.props.navigator.push({
            screen: screenNames.addVisitScreen,
            navigatorStyle: {
                tabBarHidden: true
            }
        });
    }

    render() {
        this.visitResultObject = floDB.objects(Visit.schema.name)
            .filtered('midnightEpochOfVisit==$0', this.state.date.valueOf())
            .filtered('isDone==false');
        console.log(`vobject length${this.visitResultObject.length}`);
        return (
            <View style={{flex: 1}}>
                <HomeScreen
                    visitResultObject={this.visitResultObject}
                    navigateToVisitMapScreen={this.navigateToVisitMapScreen}
                    navigateToVisitListScreen={this.navigateToVisitListScreen}
                    date={this.state.date}
                    onDateSelected={this.onDateSelected}
                />
                <Fab
                    onPressAddNote={this.navigateToAddNote}
                    onPressAddVisit={this.navigateToAddVisit}
                    onPressAddPatient={this.navigateToAddPatient}
                />
            </View>
        );
    }
}

export {HomeScreenContainer};
