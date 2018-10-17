import React, {Component} from 'react';
import {Alert} from 'react-native';
import moment from 'moment';
import MilesLogScreen from './MilesLogScreen';
import {VisitService} from '../../data_services/VisitServices/VisitService';
import {createSectionedListByField} from '../../utils/collectionUtils';
import {EpisodeMessagingService} from '../../data_services/MessagingServices/PubNubMessagingService/EpisodeMessagingService';

export default class MilesLogScreenContainer extends Component {

    static ACTIVE_TAB_INDEX = 0;
    static SUBMITTED_TAB_INDEX = 1;

    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        this.activeVisitSubscriber = VisitService.getInstance().subscribeToActiveVisits(this.setActiveVisits);
        this.submittedVisitsSubscriber = VisitService.getInstance().subscribeToSubmittedVisits(this.setSubmittedVisits);
        this.state = {
            screenIndex: MilesLogScreenContainer.ACTIVE_TAB_INDEX,
            sectionedActiveVisits: this.getSectionedDataFromVisits(this.activeVisitSubscriber.currentData, MilesLogScreenContainer.ACTIVE_TAB_INDEX),
            sectionedSubmittedVisits: null,
            selectedDatesSet: new Set([]),
            data: this.getFormattedDataForActiveLogs(this.activeVisitSubscriber.currentData)
        };
    }

    componentWillUnmount() {
        this.activeVisitSubscriber.unsubscribe();
        this.submittedVisitsSubscriber.unsubscribe();
    }

    onNavigatorEvent(event) {
        if (event.id === 'send-report') {
            if (this.state.selectedDatesSet.size > 0) {
                Alert.alert(
                    'Send Report',
                    'Send report for the selected visits?',
                    [
                        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                        {text: 'OK', onPress: () => { this.handleSendReportClick(Array.from(this.state.selectedDatesSet)); }}
                    ]
                );
            }
        }
    }

    getSectionedDataFromVisits = (visits, screenIndex) => {
        let title = screenIndex === MilesLogScreenContainer.ACTIVE_TAB_INDEX ? 'Select All' : null;
        if (visits.length === 0) title = null;
        // TODO Change this to one section per week/similar
        return [{
            title,
            data: visits
        }];
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

    setActiveVisits = (visits) => {
        this.setState({data: this.getFormattedDataForActiveLogs(visits)});
    };

    setSubmittedVisits = (visits) => {
        this.setState({sectionedSubmittedVisits: this.getSectionedDataFromVisits(visits, MilesLogScreenContainer.SUBMITTED_TAB_INDEX)});
    };

    getSectionToRenderBasedOnTab = () => {
        if (this.state.screenIndex === MilesLogScreenContainer.ACTIVE_TAB_INDEX) {
            return this.state.sectionedActiveVisits;
        } else if (this.state.screenIndex === MilesLogScreenContainer.SUBMITTED_TAB_INDEX) {
            return this.state.sectionedSubmittedVisits;
        }
    }

    handleSendReportClick = (visitIDs) => {
        VisitService.getInstance().generateReportAndSubmitVisits(visitIDs);
        this.setState({selectedDatesSet: new Set([])});
    }

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
            const allDates = this.state.data.map(item => item.date)
            this.setState({selectedDatesSet: new Set(allDates)});
        }
    }

    selectDatesInRange = (startDate, endDate) => {
        const allDates = this.state.data.map(item => item.date);
        const timeZoneMoment = (date) => moment(parseInt(date, 10)).subtract(moment().utcOffset(), 'minutes').valueOf();
        const selectedDates = allDates.filter(date => (timeZoneMoment(date) >= (startDate) && timeZoneMoment(date) <= endDate));
        this.setState({selectedDatesSet: new Set(selectedDates)});
    }

    updateScreenIndex = (screenIndex) => {
        if (screenIndex === MilesLogScreenContainer.SUBMITTED_TAB_INDEX) {
            if (!this.state.sectionedSubmittedVisits) {
                const submittedVisits = this.submittedVisitsSubscriber.currentData;
                this.setState({sectionedSubmittedVisits: this.getSectionedDataFromVisits(submittedVisits, MilesLogScreenContainer.SUBMITTED_TAB_INDEX)});
            }
        }
        this.setState({screenIndex});
    }

    render() {
        return (
            <MilesLogScreen
                screenIndex={this.state.screenIndex}
                updateScreenIndex={this.updateScreenIndex}
                data={this.state.data}
                navigator={this.props.navigator}
                selectedDatesSet={this.state.selectedDatesSet}
                toggleDateSelected={this.toggleDateSelected}
                selectDatesInRange={this.selectDatesInRange}
                toggleSelectAll={this.toggleSelectAll}
            />
        );
    }
}
