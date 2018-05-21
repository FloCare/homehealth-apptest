import React, {Component} from 'react';
import {View, Alert, NetInfo, Dimensions, Platform} from 'react-native';
import {floDB, Visit, VisitOrder} from '../../utils/data/schema';
import {HomeScreen} from './HomeScreen';
import {screenNames} from '../../utils/constants';
import Fab from '../common/Fab';
import {addListener, todayMomentInUTCMidnight} from '../../utils/utils';
import {VisitMapScreenController} from '../VisitMapScreen/VisitMapScreenController';
import {HandleConnectionChange} from '../../utils/connectionUtils';

class HomeScreenContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: todayMomentInUTCMidnight()
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

    componentDidMount() {
        NetInfo.getConnectionInfo().then((connectionInfo) => {
            console.log(`Initial, type:  ${connectionInfo.type}, effectiveType: ${connectionInfo.effectiveType}`);
        });

        NetInfo.addEventListener(
            'connectionChange',
            HandleConnectionChange
        );
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
                //TODO fix this hard coding
                this.navigateToVisitMapScreen(false);
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
        console.log('Home screen force update');
    }

    onPatientAdded() {
        Alert.alert(
            'Patient Added',
            'Please navigate to the patient lists to view the patient.',
        );
    }

    componentWillUnMount() {
        NetInfo.removeEventListener(
            'connectionChange',
            HandleConnectionChange
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

    navigateToVisitMapScreen(showCompleted) {
        console.log(`showc${showCompleted}`);
        const visitOrderObject = floDB.objectForPrimaryKey(VisitOrder, this.state.date.valueOf());
        if (visitOrderObject.visitList) {
            const visitOrderList = VisitMapScreenController.getUpdateOrderedVisitList(visitOrderObject.visitList, showCompleted);
            if (visitOrderList.length > 0) {
                this.props.navigator.push({
                    screen: screenNames.visitMapScreen,
                    passProps: {
                        date: this.state.date,
                        onOrderChange: this.onOrderChange.bind(this),
                        onNavigationEvent: this.onNavigatorEvent,
                        showCompleted
                    },
                    navigatorStyle: {
                        tabBarHidden: true
                    }
                });
            } else {
                //TODO display an error message here
            }
        }
    }

    navigateToAddNote() {
        this.props.navigator.push({
            screen: screenNames.addNote,
            title: 'Add Notes',
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
                onDone: () => {
                    this.onOrderChange();
                    this.props.navigator.pop();
                    this.navigateToVisitListScreen();
                }
            }
        });
    }

    render() {
        const visitResultObject = floDB.objects(Visit.schema.name)
            .filtered('midnightEpochOfVisit==$0', this.state.date.valueOf());
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
                    navigator={this.props.navigator}
                    navigateToVisitMapScreen={this.navigateToVisitMapScreen}
                    navigateToVisitListScreen={this.navigateToVisitListScreen}
                    date={this.state.date}
                    totalVisitsCount={visitResultObject.length}
                    remainingVisitsCount={visitResultObject.filtered('isDone==false').length}
                    onDateSelected={this.onDateSelected}
                    onOrderChange={this.onOrderChange}
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

export {HomeScreenContainer};
