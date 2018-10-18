import React, {Component} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import moment from 'moment';
import {VisitService} from '../../data_services/VisitServices/VisitService';
import {createSectionedListByField, sortByArray} from '../../utils/collectionUtils';
import {EpisodeMessagingService} from '../../data_services/MessagingServices/PubNubMessagingService/EpisodeMessagingService';
import ActiveLogsScreen from './ActiveLogsScreen';
import ReportsScreen from './ReportsScreen';
import {defaultBackGroundColor, PrimaryColor} from '../../utils/constants';

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

    getFormattedDataForActiveLogs = (visits) => {
        let visitsByMidnightEpoch = createSectionedListByField(visits, (visit) => visit.midnightEpochOfVisit, 'date', 'visits');
        visitsByMidnightEpoch.forEach(section => {
            const allVisits = section.visits;
            const serverEntityVisits = allVisits.filter(visit => EpisodeMessagingService.isVisitOfCommonInterest(visit));
            if (serverEntityVisits.length > 0) {
                const midnightEpoch = parseInt(section.date, 10);
                const visitOrder = VisitService.getInstance().getVisitOrderForDate(midnightEpoch).visitList.map(visit => visit.visitID);
                sortByArray(serverEntityVisits, visitOrder, (visit => visit.visitID));
            }
            section.visits = serverEntityVisits;
        });
        //Remove days with no visits. Might have been removed because only local visits
        visitsByMidnightEpoch = visitsByMidnightEpoch.filter(section => section.visits.length);
        visitsByMidnightEpoch.sort(this.sortSectionByDate);
        return visitsByMidnightEpoch;
    };


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
                        deleteReport={this.deleteReport}
                        submitReport={this.submitReport}
                    />);
            default:
                return <View />;
        }
    };

    setActiveLogs = (visits) => {
        this.setState({activeLogsData: this.getFormattedDataForActiveLogs(visits)});
    };

    setReports = (reports) => {
        this.setState({reportsData: reports});
    };

    createReport = (visitIDs) => {
        VisitService.getInstance().generateReportForVisits(visitIDs);
        this.setState({selectedDatesSet: new Set([])});
    };

    sortSectionByDate = (section1, section2) => (
        (parseInt(section1.title, 10) - parseInt(section2.title, 10))
    );

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
            const allDates = this.state.activeLogsData.map(item => item.date);
            this.setState({selectedDatesSet: new Set(allDates)});
        }
    };

    selectDatesInRange = (startDate, endDate) => {
        const allDates = this.state.activeLogsData.map(item => item.date);
        const timeZoneMoment = (date) => moment(parseInt(date, 10)).subtract(moment().utcOffset(), 'minutes').valueOf();
        const selectedDates = allDates.filter(date => (timeZoneMoment(date) >= (startDate) && timeZoneMoment(date) <= endDate));
        this.setState({selectedDatesSet: new Set(selectedDates)});
    };

    updateScreenIndex = (screenIndex) => {
        this.setState({screenIndex});
    };

    submitReport = (reportID) => {
        VisitService.getInstance().submitReport(reportID);
    };

    deleteReport = (reportID) => {
        VisitService.getInstance().deleteReportAndItems(reportID);
    };

    render() {
        const selectedTabStyle = {borderBottomWidth: 2, borderBottomColor: PrimaryColor};
        return (
            <View style={{flex: 1, backgroundColor: defaultBackGroundColor}}>
                <View
                    style={{flexDirection: 'row',
                        elevation: 3,
                        shadowColor: 'black',
                        shadowOpacity: 0.3,
                        shadowOffset: {width: 2, height: 2},
                        shadowRadius: 2,
                        backgroundColor: defaultBackGroundColor
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
