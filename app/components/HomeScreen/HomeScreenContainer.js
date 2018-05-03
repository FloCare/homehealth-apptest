import React, {Component} from 'react';
import {View, Alert} from 'react-native';
import moment from 'moment';
import {floDB, Visit} from '../../utils/data/schema';
import {HomeScreen} from './HomeScreen';
import {screenNames} from '../../utils/constants';
import Fab from '../common/Fab';
import {addListener} from '../../utils/utils';

class HomeScreenContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: moment().utc().startOf('day')
        };

        this.navigateToVisitListScreen = this.navigateToVisitListScreen.bind(this);
        this.navigateToVisitMapScreen = this.navigateToVisitMapScreen.bind(this);
        this.onDateSelected = this.onDateSelected.bind(this);
        this.onOrderChange = this.onOrderChange.bind(this);
        this.onPatientAdded = this.onPatientAdded.bind(this);

        this.navigateToAddNote = this.navigateToAddNote.bind(this);
        this.navigateToAddPatient = this.navigateToAddPatient.bind(this);
        this.navigateToAddVisit = this.navigateToAddVisit.bind(this);
        this.navigateToAddVisitFAB = this.navigateToAddVisitFAB.bind(this);

        this.onNavigatorEvent = this.onNavigatorEvent.bind(this);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
        addListener(this.onOrderChange);
    }

    onNavigatorEvent(event) {
        if (event.type === 'DeepLink') {
            if (event.link === 'date') {
                this.setState({date: event.payload});
            }
        }
        if (event.type === 'NavBarButtonPress') {
            if (event.id === 'list-view') {
                this.props.navigator.pop();
                this.navigateToVisitListScreen();
            }
            if (event.id === 'map-view') {
                this.props.navigator.pop();
                this.navigateToVisitMapScreen();
            }
        }
    }
    
    onDateSelected(date) {
        if (!date.isSame(this.state.date, 'day')) {
            this.setState({date});
        }
        console.log(date.format());
    }

    onOrderChange() {
        this.forceUpdate();
        console.log('was called');
    }

    onPatientAdded() {
        Alert.alert(
            'Patient Added',
            'Please navigate to the patient lists to view the patient.',
        );
    }

    navigateToVisitListScreen() {
        this.props.navigator.push({
            screen: screenNames.visitListScreen,
            passProps: {
                date: this.state.date,
                onOrderChange: this.onOrderChange.bind(this),
                onNavigationEvent: this.onNavigatorEvent
            },
            navigatorStyle: {
                tabBarHidden: true
            }
        });
    }

    navigateToVisitMapScreen() {
        this.props.navigator.push({
            screen: screenNames.visitMapScreen,
            passProps: {
                date: this.state.date,
                onOrderChange: this.onOrderChange.bind(this),
                onNavigationEvent: this.onNavigatorEvent
            },
            navigatorStyle: {
                tabBarHidden: true
            }
        });
    }

    navigateToAddNote() {
        this.props.navigator.push({
            screen: screenNames.addNote,
            title: 'Add Note',
            navigatorStyle: {
                tabBarHidden: true
            }
        });
    }

    navigateToAddPatient() {
        this.props.navigator.push({
            screen: screenNames.addPatient,
            title: 'Add Patient',
            navigatorStyle: {
                tabBarHidden: true
            },
            passProps: {
                onPatientAdded: this.onPatientAdded
            }
        });
    }

    navigateToAddVisit() {
        this.props.navigator.push({
            screen: screenNames.addVisitScreen,
            title: 'Add Visit',
            navigatorStyle: {
                tabBarHidden: true
            },
            passProps: {
                date: this.state.date,
                onDone: this.onOrderChange
            }
        });
    }

    navigateToAddVisitFAB() {
        this.props.navigator.push({
            screen: screenNames.addVisitScreen,
            title: 'Add Visit',
            navigatorStyle: {
                tabBarHidden: true
            },
            passProps: {
                date: this.state.date,
                onDone: () => { this.onOrderChange(); this.props.navigator.pop(); this.navigateToVisitListScreen(); }
            }
        });
    }

    render() {
        const visitResultObject = floDB.objects(Visit.schema.name)
            .filtered('midnightEpochOfVisit==$0', this.state.date.valueOf());
        return (
            <View style={{flex: 1}}>
                <HomeScreen
                    navigator={this.props.navigator}
                    navigateToVisitMapScreen={this.navigateToVisitMapScreen}
                    navigateToVisitListScreen={this.navigateToVisitListScreen}
                    date={this.state.date}
                    totalVisitsCount={visitResultObject.length}
                    remainingVisitsCount={visitResultObject.filtered('isDone==false').length}
                    onDateSelected={this.onDateSelected}
                    onOrderChange={this.onOrderChange}
                    onPressAddVisit={this.navigateToAddVisit}
                />
                <Fab
                    onPressAddNote={this.navigateToAddNote}
                    onPressAddVisit={this.navigateToAddVisitFAB}
                    onPressAddPatient={this.navigateToAddPatient}
                />
            </View>
        );
    }
}

export {HomeScreenContainer};
