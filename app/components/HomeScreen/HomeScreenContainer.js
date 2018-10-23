import React, {Component} from 'react';
import firebase from 'react-native-firebase';
import {connect} from 'react-redux';
import codePush from 'react-native-code-push';
import {
    SafeAreaView,
    Alert,
    NetInfo,
    Dimensions,
    Platform,
    AsyncStorage,
    ScrollView,
    View
} from 'react-native';
import RNSecureKeyStore from 'react-native-secure-key-store';
import Modal from 'react-native-modal';
import SplashScreen from 'react-native-splash-screen';
import moment from 'moment';
import Instabug from 'instabug-reactnative';
import {HomeDayView} from './HomeDayView';
import {screenNames, eventNames, parameterValues} from '../../utils/constants';
import Fab from '../common/Fab';
// import {addListener, todayMomentInUTCMidnight} from '../../utils/utils';
import {HandleConnectionChange} from '../../utils/connectionUtils';
import {dateService} from '../../data_services/DateService';
import {setItem} from '../../utils/InMemoryStore';
import {todayMomentInUTCMidnight} from '../../utils/utils';
import {CalendarStripStyled} from '../common/CalendarStripStyled';
import {DayCard} from '../WeekViewScreen/DayCard';
import {VisitService} from '../../data_services/VisitServices/VisitService';
import {PatientDataService} from '../../data_services/PatientDataService';
import {PlaceDataService} from '../../data_services/PlaceDataService';
import SyncingDataModal from './SyncingDataModal';

const codePushOptions = {checkFrequency: codePush.CheckFrequency.ON_APP_RESUME, installMode: codePush.InstallMode.ON_NEXT_RESUME, minimumBackgroundDuration: 60 * 1};

class HomeScreenContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {calendarMode: 'Day', currentViewWeekStart: moment(this.props.date).day(1), syncingDataModalVisible: this.props.syncDataFromServer};

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
        this.onModeChange = this.onModeChange.bind(this);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
        // addListener(this.onOrderChange);
        setItem('navigator', this.props.navigator);
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
        this.syncDataFromServer();
    }

    setOnboardingStatus = (onBoardingStatus) => {
        AsyncStorage.setItem('onBoardingMessagesStatus', JSON.stringify(onBoardingStatus));
    };

    getOnboardingStatus = async () => {
        try {
            return JSON.parse(await AsyncStorage.getItem('onBoardingMessagesStatus'));
        } catch (error) {
            return { };
        }
    };

    isInstaBugOnboardingMessageShown = (onBoardingStatusObject) => (
        onBoardingStatusObject && onBoardingStatusObject.instaBugStatus
    );

    showInstabugOnboardingMessage = async () => {
        const onboardingStatus = await this.getOnboardingStatus();
        if (!this.isInstaBugOnboardingMessageShown(onboardingStatus)) {
            Instabug.showWelcomeMessage(Instabug.welcomeMessageMode.live);
            const updatedOnBoardingStatus = {
                ...onboardingStatus,
                instaBugStatus: true
            };
            this.setOnboardingStatus(updatedOnBoardingStatus);
        }
    };

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
        // STOP GAP solution. To brainstorm on the right way of doing it
        if (event.id === 'didAppear') {
            firebase.analytics().setCurrentScreen(screenNames.home, screenNames.home);
        }
        if (event.id === 'bottomTabReselected') {
            this.onDateSelected(todayMomentInUTCMidnight());
            this.calendarRef.resetCalendar();
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

    onModeChange(mode) {
        this.setState({calendarMode: mode});
    }

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

    getDatesForWeek(date) {
        const dates = [];
        for (let i = 0; i < 7; i++) {
            dates.push(moment(date).day(1).add(i, 'd').valueOf());
        }
        return dates;
    }

    getMainBody(calendarMode) {
        if (calendarMode === 'Day') {
            return (
                <HomeDayView
                    visitID={this.props.nextVisitID}
                    navigator={this.props.navigator}
                    dateMinusToday={this.props.dateMinusToday}
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
            );
        }

        const weekViewColumnGenerator = dayFilter => (
                <View
                    style={{flex: 1}}
                >
                    {
                        this.getDatesForWeek(this.state.currentViewWeekStart).map(date => {
                            const day = moment(date).day();
                            const visitOrder = VisitService.getInstance().visitRealmService.getVisitOrderForDate(date);
                            if (dayFilter(day, visitOrder.visitList.length)) {
                                return (
                                    <DayCard
                                        visitOrder={visitOrder}
                                    />
                                );
                            }
                        })
                    }
                </View>
            );

        return (
            <View
                style={{
                    flexDirection: 'row',
                    marginTop: 10,
                    marginHorizontal: 5
                }}
            >
                {weekViewColumnGenerator((day, visitsOnDay) => day % 2 === 1 || (day === 0 && visitsOnDay > 0))}
                {weekViewColumnGenerator((day) => day % 2 === 0 && day !== 0)}
            </View>
        );
    }

    onSyncFromServer = () => {
        this.setState({syncingDataModalVisible: false});
        AsyncStorage.setItem('syncDone', 'true');
        setTimeout(() => { this.showInstabugOnboardingMessage(); }, 1000);
    };

    async syncDataFromServer() {
        const startingTime = moment().valueOf();
        await RNSecureKeyStore.get('accessToken').then(() =>
            Promise.all([PatientDataService.getInstance().syncPatientListFromServer(), PlaceDataService.getInstance().fetchAndSavePlacesFromServer()])
                    .then(() => VisitService.getInstance().fetchAndSaveMyVisitsFromServer()));
        const endTime = moment().valueOf();
        const minimumLoadingTime = 1000;
        if (endTime - startingTime < minimumLoadingTime) {
            setTimeout(this.onSyncFromServer, minimumLoadingTime - (endTime - startingTime));
        } else {
            this.onSyncFromServer();
        }
    }

    render() {
        return (
            <SafeAreaView
                style={[
                    {backgroundColor: '#F8F8F8'},
                    Platform.select({
                        ios: {height: Dimensions.get('window').height - getTabBarHeight()},
                        android: {flex: 1}
                    })]}
            >
                <CalendarStripStyled
                    ref={ref => { this.calendarRef = ref; }}
                    onModeChange={this.onModeChange}
                    onWeekChanged={date => this.setState({currentViewWeekStart: moment(date).day(1)})}
                    dateRowAtBottom
                    showMonth
                    paddingTop={Platform.select({ios: 20, android: 20})}
                    date={moment(this.props.date).utc()}
                    // noRounding={props.remainingVisitsCount === 0}
                    onDateSelected={this.onDateSelected}
                />
                <ScrollView
                    style={{flex: 1}}
                    keyboardShouldPersistTaps
                >
                    <Modal
                        isVisible={this.state.syncingDataModalVisible}
                        animationInTiming={10}
                        backdropOpacity={0.8}
                    >
                        <SyncingDataModal />
                    </Modal>
                    {this.getMainBody(this.state.calendarMode)}
                </ScrollView>
                <Fab
                    onPressAddNote={this.navigateToAddNote}
                    onPressAddVisit={() => {
                        firebase.analytics().logEvent(eventNames.FLOATING_BUTTON, {
                            type: parameterValues.ADD_VISIT
                        });
                        this.navigateToAddVisitFAB();
                    }}
                    onPressAddPatient={this.navigateToAddPatient}
                />
            </SafeAreaView>
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
    const isVisitDone = (visitID) => state.visits[visitID] && state.visits[visitID].isDone;
    return {
        nextVisitID: state.visitOrder[0],
        date: state.date,
        dateMinusToday: state.date < todayMomentInUTCMidnight().valueOf() ? -1 : (state.date === todayMomentInUTCMidnight().valueOf() ? 0 : 1),
        remainingVisits: state.visitOrder.reduce((totalRemaining, visitID) => totalRemaining + (isVisitDone(visitID) ? 0 : 1), 0),
        totalVisits: state.visitOrder.length,
    };
}

export default connect(stateToProps)(codePush(codePushOptions)(HomeScreenContainer));
