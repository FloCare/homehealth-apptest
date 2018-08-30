import React, {Component} from 'react';
import {Alert, View, Text} from 'react-native';
import MilesLogScreen from './MilesLogScreen';
import {VisitService} from '../../data_services/VisitServices/VisitService';

const ACTIVE_TAB_INDEX = 0;
const SUBMITTED_TAB_INDEX = 1;

const ActiveTabComponent = () => <Text> Active </Text>;
const SubmittedTabComponent = () => <Text> Submitted </Text>;

const buttons = [{element: ActiveTabComponent}, {element: SubmittedTabComponent}];

export default class MilesLogScreenContainer extends Component {

    constructor(props) {
        super(props);
        const activeVisits = this.getActiveVisits();
        this.state = {
            selectedIndex: 0,
            sectionedActiveVisits: this.getSectionedDataFromVisits(activeVisits, ACTIVE_TAB_INDEX),
            sectionedSubmittedVisits: null,
            selectedVisitsSet: new Set([])
        };
        this.props.navigator.setButtons({
            rightButtons: [
                {
                    id: 'send-report',
                    title: 'Send Report',
                    buttonFontSize: 12
                }
            ]
        });
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        this.activeVisitListener = this.addListenerForActiveVisits();
        this.submittedVisitListener = this.addListenerForSubmittedVisits();
    }

    componentWillUnmount() {
        this.activeVisitListener.removeListener(this.setActiveVisits);
        this.submittedVisitListener.removeListener(this.setSubmittedVisits);
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

    addListenerForActiveVisits = () => {
        const activeVisitsResult = VisitService.getInstance().getActiveMilesLogVisits();
        activeVisitsResult.addListener(this.setActiveVisits);
        return activeVisitsResult;
    }

    addListenerForSubmittedVisits = () => {
        const submittedVisits = VisitService.getInstance().getSubmittedMilesLogVisits();
        submittedVisits.addListener(this.setSubmittedVisits);
        return submittedVisits;
    }

    getSectionedDataFromVisits = (visits, screenIndex) => {
        let title = screenIndex === ACTIVE_TAB_INDEX ? 'Select All' : null;
        if (visits.length === 0) title = null;
        return [{
            title,
            data: visits
        }];
        // createSectionedListByField(visits, 'NULL')
    }

    getActiveVisits = () => (
        VisitService.getInstance().getActiveMilesLogVisits()
    )

    setActiveVisits = (visits) => {
        this.setState({sectionedActiveVisits: this.getSectionedDataFromVisits(visits, ACTIVE_TAB_INDEX)});
    }

    setSubmittedVisits = (visits) => {
        this.setState({sectionedSubmittedVisits: this.getSectionedDataFromVisits(visits, SUBMITTED_TAB_INDEX)});
    }

    getSubmittedVisits = () => (
        VisitService.getInstance().getSubmittedMilesLogVisits()
    )

    getSectionToRenderBasedOnTab = () => {
        if (this.state.selectedIndex === ACTIVE_TAB_INDEX) {
            return this.state.sectionedActiveVisits;
        } else if (this.state.selectedIndex === SUBMITTED_TAB_INDEX) {
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

    updateIndex = (selectedIndex) => {
        if (selectedIndex === SUBMITTED_TAB_INDEX){
            this.props.navigator.setButtons({
                rightButtons: []
            });
            if (!this.state.sectionedSubmittedVisits) {
                const submittedVisits = this.getSubmittedVisits();
                this.setState({sectionedSubmittedVisits: this.getSectionedDataFromVisits(submittedVisits, SUBMITTED_TAB_INDEX)});
            }
        } else if (selectedIndex === ACTIVE_TAB_INDEX) {
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
        this.setState({selectedIndex});
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: '#F8F8F8'}}>
                <MilesLogScreen
                    buttons={buttons}
                    selectedIndex={this.state.selectedIndex}
                    sectionData={this.getSectionToRenderBasedOnTab()}
                    showCheckBox={this.state.selectedIndex === ACTIVE_TAB_INDEX}
                    toggleVisitSelected={this.toggleVisitSelected}
                    toggleSectionSelected={this.toggleSectionSelected}
                    selectedVisitsSet={this.state.selectedVisitsSet}
                    updateIndex={this.updateIndex}
                />
            </View>
        );
    }
}
