import React, {Component} from 'react';
import firebase from 'react-native-firebase';
import {connect} from 'react-redux';
import {View, Alert, NetInfo, Dimensions, Platform} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import moment from 'moment';
import {HomeScreen} from './HomeScreen';
import {screenNames, eventNames, parameterValues} from '../../utils/constants';
import Fab from '../common/Fab';
// import {addListener, todayMomentInUTCMidnight} from '../../utils/utils';
import {HandleConnectionChange} from '../../utils/connectionUtils';
import {dateService} from '../../data_services/DateService';

class HomeScreenContainer extends Component {
    constructor(props) {
        super(props);

        this.navigateToVisitListScreen = this.navigateToVisitListScreen.bind(this);
        this.navigateToVisitMapScreen = this.navigateToVisitMapScreen.bind(this);
        this.onDateSelected = this.onDateSelected.bind(this);
        // this.onOrderChange = this.onOrderChange.bind(this);
        this.onPatientAdded = this.onPatientAdded.bind(this);

        this.navigateToAddNote = this.navigateToAddNote.bind(this);
        this.navigateToAddPatient = this.navigateToAddPatient.bind(this);
        this.navigateToAddVisit = this.navigateToAddVisit.bind(this);
        this.navigateToAddVisitFAB = this.navigateToAddVisitFAB.bind(this);

        this.onNavigatorEvent = this.onNavigatorEvent.bind(this);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
        // addListener(this.onOrderChange);
    }

    componentDidMount() {
        NetInfo.getConnectionInfo().then((connectionInfo) => {
            console.log(`Initial, type:  ${connectionInfo.type}, effectiveType: ${connectionInfo.effectiveType}`);
        });

        NetInfo.addEventListener(
            'connectionChange',
            HandleConnectionChange
        );

        SplashScreen.hide();
    }

    onNavigatorEvent(event) {
        // if (event.type === 'DeepLink') {
        //     if (event.link === 'date') {
        //         this.setState({date: event.payload});
        //     }
        // }
        // if (event.type === 'NavBarButtonPress') {
        //     if (event.id === 'list-view') {
        //         this.props.navigator.pop();
        //         this.navigateToVisitListScreen();
        //     }
        //     if (event.id === 'map-view') {
        //         this.props.navigator.pop();
        //         //TODO fix this hard coding
        //         this.navigateToVisitMapScreen(false);
        //     }
        // }
        // STOP GAP solution. Will be removed when redux is used
        if (event.id === 'didAppear') {
            firebase.analytics().setCurrentScreen(screenNames.HomeScreen, screenNames.HomeScreen);
        }
    }

    onDateSelected(date) {
        if (!date.isSame(this.props.date, 'day')) {
            dateService.setDate(date.valueOf());
        }
        console.log(date.format());
    }

    // onOrderChange() {
    //     this.forceUpdate();
    //     console.log('Home screen force update');
    // }

    onPatientAdded() {
        Alert.alert(
            'Patient Added',
            'Please navigate to the patient lists to view the patient.',
        );
    }

    componentWillUnmount() {
        NetInfo.removeEventListener(
            'connectionChange',
            HandleConnectionChange
        );
    }

    navigateToVisitListScreen() {
        firebase.analytics().logEvent(eventNames.VISIT_VIEW, {
            type: parameterValues.LIST
        });
        this.props.navigator.push({
            screen: screenNames.visitDayViewScreen,
            passProps: {
                selectedScreen: 'list',
            },
            navigatorStyle: {
                tabBarHidden: true
            }
        });
    }

    navigateToVisitMapScreen() {
        firebase.analytics().logEvent(eventNames.VISIT_VIEW, {
            type: parameterValues.MAP
        });
        this.props.navigator.push({
            screen: screenNames.visitDayViewScreen,
            passProps: {
                selectedScreen: 'map',
            },
            navigatorStyle: {
                tabBarHidden: true
            }
        });
    }

    navigateToAddNote() {
        firebase.analytics().logEvent(eventNames.FLOATING_BUTTON, {
            type: parameterValues.ADD_NOTE
        });
        this.props.navigator.push({
            screen: screenNames.addNote,
            title: 'Add Notes',
            navigatorStyle: {
                tabBarHidden: true
            }
        });
    }

    navigateToAddPatient() {
        firebase.analytics().logEvent(eventNames.FLOATING_BUTTON, {
            type: parameterValues.ADD_PATIENT
        });
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
                date: moment(this.props.date).utc(),
                // onDone: this.onOrderChange
            }
        });
    }

    navigateToAddVisitFAB() {
        firebase.analytics().logEvent(eventNames.FLOATING_BUTTON, {
            type: parameterValues.ADD_VISIT
        });
        this.props.navigator.push({
            screen: screenNames.addVisitScreen,
            title: 'Add Visit',
            navigatorStyle: {
                tabBarHidden: true
            },
            passProps: {
                date: moment(this.props.date).utc(),
                onDone: () => {
                //     // this.onOrderChange();
                    this.props.navigator.pop();
                    this.navigateToVisitListScreen();
                }
            }
        });
    }

    render() {
        return (
            <View
                style={[
                    {backgroundColor: '#fcfcfc'},
                    Platform.select({
                        ios: {height: Dimensions.get('window').height - getTabBarHeight()},
                        android: {flex: 1}
                    })]}
            >
                <HomeScreen
                    visitID={this.props.nextVisitID}
                    navigator={this.props.navigator}
                    navigateToVisitMapScreen={this.navigateToVisitMapScreen}
                    navigateToVisitListScreen={this.navigateToVisitListScreen}
                    date={moment(this.props.date).utc()}
                    totalVisitsCount={this.props.totalVisits}
                    remainingVisitsCount={this.props.remainingVisits}
                    onDateSelected={this.onDateSelected}
                    // onOrderChange={this.onOrderChange}
                    onPressAddVisit={this.navigateToAddVisit}
                    onPressAddVisitZeroState={this.navigateToAddVisitFAB}
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

function getTabBarHeight() {
    if (Platform.OS === 'ios') {
        const d = Dimensions.get('window');
        const {height, width} = d;

        if (height === 812 || width === 812) {
            return 85;
        } // iPhone X navbar height (regular title);
        return 50; // iPhone navbar height;
    }
    return 70; //android portrait navbar height;
}

function stateToProps(state) {
    return {
        nextVisitID: state.visitOrder[0],
        date: state.date,
        remainingVisits: state.visitOrder.reduce((totalRemaining, visitID) => totalRemaining + (state.visits[visitID].isDone ? 0 : 1), 0),
        totalVisits: state.visitOrder.length,
    };
}

export default connect(stateToProps)(HomeScreenContainer);
