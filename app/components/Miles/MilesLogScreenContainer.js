import React, {Component} from 'react';
import {Alert} from 'react-native';
import MilesLogScreen from './MilesLogScreen';
import {VisitService} from '../../data_services/VisitServices/VisitService';

export default class MilesLogScreenContainer extends Component {

    static ACTIVE_TAB_INDEX = 0;
    static SUBMITTED_TAB_INDEX = 1;

    constructor(props) {
        super(props);
        this.setNavigatorButtonsForActiveLogs();
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        this.activeVisitSubscriber = VisitService.getInstance().subscribeToActiveVisits(this.setActiveVisits);
        this.submittedVisitsSubscriber = VisitService.getInstance().subscribeToSubmittedVisits(this.setSubmittedVisits);
        this.state = {
            screenIndex: MilesLogScreenContainer.ACTIVE_TAB_INDEX,
            sectionedActiveVisits: this.getSectionedDataFromVisits(this.activeVisitSubscriber.currentData, MilesLogScreenContainer.ACTIVE_TAB_INDEX),
            sectionedSubmittedVisits: null,
            selectedVisitsSet: new Set([])
        };
    }

    componentWillUnmount() {
        this.activeVisitSubscriber.unsubscribe();
        this.submittedVisitsSubscriber.unsubscribe();
    }

    onNavigatorEvent(event) {
        if (event.id === 'send-report') {
            if (this.state.selectedVisitsSet.size > 0) {
                Alert.alert(
                    'Send Report',
                    'Send report for the selected visits?',
                    [
                        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                        {text: 'OK', onPress: () => { this.handleSendReportClick(Array.from(this.state.selectedVisitsSet)); }}
                    ]
                );
            }
        }
    }

    setNavigatorButtonsForActiveLogs() {
        this.props.navigator.setButtons({
            rightButtons: [
                {
                    id: 'send-report',
                    title: 'Send Report',
                    buttonFontSize: 12
                }
            ]
        });
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

    setActiveVisits = (visits) => {
        this.setState({sectionedActiveVisits: this.getSectionedDataFromVisits(visits, MilesLogScreenContainer.ACTIVE_TAB_INDEX)});
    }

    setSubmittedVisits = (visits) => {
        this.setState({sectionedSubmittedVisits: this.getSectionedDataFromVisits(visits, MilesLogScreenContainer.SUBMITTED_TAB_INDEX)});
    }

    getSectionToRenderBasedOnTab = () => {
        if (this.state.screenIndex === MilesLogScreenContainer.ACTIVE_TAB_INDEX) {
            return this.state.sectionedActiveVisits;
        } else if (this.state.screenIndex === MilesLogScreenContainer.SUBMITTED_TAB_INDEX) {
            return this.state.sectionedSubmittedVisits;
        }
    }

    handleSendReportClick = (visitIDs) => {
        VisitService.getInstance().generateReportAndSubmitVisits(visitIDs);
        this.setState({selectedVisitsSet: new Set([])});
    }

    toggleVisitSelected = (visitID) => {
        const newSelectedVisitsSet = new Set(this.state.selectedVisitsSet);
        if (this.state.selectedVisitsSet.has(visitID)) {
            newSelectedVisitsSet.delete(visitID);
        } else {
            newSelectedVisitsSet.add(visitID);
        }
        this.setState({selectedVisitsSet: newSelectedVisitsSet});
    }

    toggleSectionSelected = (sectionTitle, isCurrentlySelected) => {
        const sectionData = this.state.sectionedActiveVisits.find(section => section.title === sectionTitle).data;
        const visitIDs = sectionData.map(visit => visit.visitID);
        const newSelectedVisitsSet = new Set(this.state.selectedVisitsSet);
        if (isCurrentlySelected) {
            visitIDs.forEach(visitID => newSelectedVisitsSet.delete(visitID));
        } else {
            visitIDs.forEach(visitID => newSelectedVisitsSet.add(visitID));
        }

        this.setState({selectedVisitsSet: newSelectedVisitsSet});
    }

    updateScreenIndex = (screenIndex) => {
        if (screenIndex === MilesLogScreenContainer.SUBMITTED_TAB_INDEX) {
            this.props.navigator.setButtons({
                rightButtons: []
            });
            if (!this.state.sectionedSubmittedVisits) {
                const submittedVisits = this.submittedVisitsSubscriber.currentData;
                this.setState({sectionedSubmittedVisits: this.getSectionedDataFromVisits(submittedVisits, MilesLogScreenContainer.SUBMITTED_TAB_INDEX)});
            }
        } else if (screenIndex === MilesLogScreenContainer.ACTIVE_TAB_INDEX) {
            this.setNavigatorButtonsForActiveLogs();
        }
        this.setState({screenIndex});
    }

    render() {
        return (
            <MilesLogScreen
                screenIndex={this.state.screenIndex}
                updateScreenIndex={this.updateScreenIndex}
                sectionData={this.getSectionToRenderBasedOnTab()}
                showCheckBox={this.state.screenIndex === MilesLogScreenContainer.ACTIVE_TAB_INDEX}
                toggleVisitSelected={this.toggleVisitSelected}
                toggleSectionSelected={this.toggleSectionSelected}
                selectedVisitsSet={this.state.selectedVisitsSet}
            />
        );
    }
}
