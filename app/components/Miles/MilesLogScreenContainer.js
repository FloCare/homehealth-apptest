import React, {Component} from 'react';
import {Alert, Text, TouchableOpacity, View} from 'react-native';
import moment from 'moment';
import {VisitService} from '../../data_services/VisitServices/VisitService';
import {createSectionedListByField} from '../../utils/collectionUtils';
import {EpisodeMessagingService} from '../../data_services/MessagingServices/PubNubMessagingService/EpisodeMessagingService';
import ActiveLogsScreen from './ActiveLogsScreen';
import ReportsScreen from './ReportsScreen';
import {PrimaryColor} from '../../utils/constants';

export default class MilesLogScreenContainer extends Component {

    static ACTIVE_TAB_INDEX = 0;
    static SUBMITTED_TAB_INDEX = 1;

    constructor(props) {
        super(props);
        this.activeVisitSubscriber = VisitService.getInstance().subscribeToActiveVisits(this.setActiveLogs);
        this.reportsSubscriber = VisitService.getInstance().subscribeToReports(this.setReports);
        this.state = {
            screenIndex: MilesLogScreenContainer.ACTIVE_TAB_INDEX,
            selectedDatesSet: new Set([]),
            activeLogsData: this.getFormattedDataForActiveLogs(this.activeVisitSubscriber.currentData),
            reportsData: this.reportsSubscriber.currentData
        };
    }

    componentWillUnmount() {
        this.activeVisitSubscriber.unsubscribe();
        this.reportsSubscriber.unsubscribe();
    }

    sortSectionByDate = (section1, section2) => (
        (parseInt(section1.title, 10) - parseInt(section2.title, 10))
    );

    getFormattedDataForActiveLogs = (visits) => {
        // TODO Sort inside section by visit order
        const visitsByMidnightEpoch = createSectionedListByField(visits, (visit) => visit.midnightEpochOfVisit, 'date', 'visits');
        visitsByMidnightEpoch.forEach(section => {
            const allVisits = section.visits;
            section.visits = allVisits.filter(visit => EpisodeMessagingService.isVisitOfCommonInterest(visit));
        //    TODO Delete section if visits length becomes zero now
        });
        visitsByMidnightEpoch.sort(this.sortSectionByDate);
        return visitsByMidnightEpoch;
    };

    setActiveLogs = (visits) => {
        this.setState({activeLogsData: this.getFormattedDataForActiveLogs(visits)});
    };

    setReports = (reports) => {
        console.log('callback from reports');
        this.setState({reportsData: reports});
    };

    createReport = (visitIDs) => {
        VisitService.getInstance().generateReportForVisits(visitIDs);
        this.setState({selectedDatesSet: new Set([])});
    };

    toggleDateSelected = (date) => {
        const newSelectedDateSet = new Set(this.state.selectedDatesSet);
        if (this.state.selectedDatesSet.has(date)) {
            newSelectedDateSet.delete(date);
        } else {
            newSelectedDateSet.add(date);
        }
        this.setState({selectedDatesSet: newSelectedDateSet});
    };

    toggleSelectAll = (isCurrentlySelected) => {
        if (isCurrentlySelected) {
            this.setState({selectedDatesSet: new Set()});
        } else {
            const allDates = this.state.activeLogsData.map(item => item.date)
            this.setState({selectedDatesSet: new Set(allDates)});
        }
    }

    selectDatesInRange = (startDate, endDate) => {
        const allDates = this.state.activeLogsData.map(item => item.date);
        const timeZoneMoment = (date) => moment(parseInt(date, 10)).subtract(moment().utcOffset(), 'minutes').valueOf();
        const selectedDates = allDates.filter(date => (timeZoneMoment(date) >= (startDate) && timeZoneMoment(date) <= endDate));
        this.setState({selectedDatesSet: new Set(selectedDates)});
    }

    updateScreenIndex = (screenIndex) => {
        this.setState({screenIndex});
    }

    submitReport = (reportID) => {
        VisitService.getInstance().submitReport(reportID);
    }

    getScreenBasedOnSelectedIndex = () => {
        switch (this.state.screenIndex) {
            case MilesLogScreenContainer.ACTIVE_TAB_INDEX:
                return (
                    <ActiveLogsScreen
                        data={this.state.activeLogsData}
                        navigator={this.props.navigator}
                        selectedDatesSet={this.state.selectedDatesSet}
                        toggleDateSelected={this.toggleDateSelected}
                        toggleSelectAll={this.toggleSelectAll}
                        selectDatesInRange={this.selectDatesInRange}
                        createReport={this.createReport}
                    />);
            case MilesLogScreenContainer.SUBMITTED_TAB_INDEX:
                return (
                    <ReportsScreen
                        data={this.state.reportsData}
                        submitReport={this.submitReport}
                    />);
            default:
                return <View />;
        }
    }

    render() {
        const selectedTabStyle = {borderBottomWidth: 2, borderBottomColor: PrimaryColor};
        return (
            <View style={{flex: 1, backgroundColor: '#F8F8F8'}}>
                <View
                    style={{flexDirection: 'row',
                        elevation: 3,
                        shadowColor: 'black',
                        shadowOpacity: 0.3,
                        shadowOffset: {width: 2, height: 2},
                        shadowRadius: 2,
                        backgroundColor: 'white'
                    }}
                >
                    <TouchableOpacity
                        style={[{flex: 1, alignItems: 'center'}, this.state.screenIndex === MilesLogScreenContainer.ACTIVE_TAB_INDEX ? selectedTabStyle : {}]}
                        onPress={() => this.updateScreenIndex(MilesLogScreenContainer.ACTIVE_TAB_INDEX)}
                    >
                        <Text style={{textAlign: 'center', fontSize: 16, marginTop: 10, marginBottom: 5}}>
                            Active Logs
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[{flex: 1, alignItems: 'center'}, this.state.screenIndex === MilesLogScreenContainer.SUBMITTED_TAB_INDEX ? selectedTabStyle : {}]}
                        onPress={() => this.updateScreenIndex(MilesLogScreenContainer.SUBMITTED_TAB_INDEX)}
                    >
                        <Text style={{textAlign: 'center', fontSize: 16, marginTop: 10, marginBottom: 5}}>
                            Reports
                        </Text>
                    </TouchableOpacity>
                </View>
                {
                    this.getScreenBasedOnSelectedIndex()
                }
            </View>

        );
    }
}
