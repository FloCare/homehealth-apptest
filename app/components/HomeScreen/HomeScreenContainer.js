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
        this.onOrderChange = this.onOrderChange.bind(this);

        this.navigateToAddNote = this.navigateToAddNote.bind(this);
        this.navigateToAddPatient = this.navigateToAddPatient.bind(this);
        this.navigateToAddVisit = this.navigateToAddVisit.bind(this);

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
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

    navigateToVisitListScreen() {
        this.props.navigator.push({
            screen: screenNames.visitListScreen,
            passProps: {
                date: this.state.date,
                onOrderChange: this.onOrderChange.bind(this)
            },
            navigatorStyle: {
                tabBarHidden: true
            },
            navigatorButtons: {
                rightButtons: [{
                    id: 'calendar-picker',
                    icon: require('../../../resources/calendar.png'),
                }]
            }
        });
    }

    navigateToVisitMapScreen() {
        this.props.navigator.push({
            screen: screenNames.visitMapScreen,
            passProps: {
                date: this.state.date,
                onOrderChange: this.onOrderChange.bind(this)
            },
            navigatorStyle: {
                tabBarHidden: true
            },
            navigatorButtons: {
                rightButtons: [{
                    id: 'calendar-picker',
                    icon: require('../../../resources/calendar.png'),
                },
                // {
                //     id: 'list-view',
                //     icon: require('../../../resources/listView.png')
                // }
                ]
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
            navigatorButtons: {
                rightButtons: [
                    {
                        id: 'calendar-picker',
                        icon: require('../../../resources/calendar.png'),
                    },
                    {
                        id: 'add', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                        icon: require('../../../resources/addButton.png'), // for icon button, provide the local image asset name
                        buttonColor: 'white'
                    }
                ]
            },
            passProps: {
                date: this.state.date,
                onDone: this.onOrderChange
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
                    onPressAddVisit={this.navigateToAddVisit}
                    onPressAddPatient={this.navigateToAddPatient}
                />
            </View>
        );
    }
}

export {HomeScreenContainer};
