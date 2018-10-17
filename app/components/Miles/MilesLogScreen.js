import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import moment from 'moment/moment';
import {PrimaryColor} from '../../utils/constants';
import {CustomCheckBox} from '../common/CustomCheckBox';
import {styles} from '../common/styles';
import MilesLogScreenContainer from './MilesLogScreenContainer';
import ActiveLogsScreen from './ActiveLogsScreen';
import ReportsScreen from './ReportsScreen';

export default class MilesLogScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visitIDForMilesModal: null
        };
    }

    handleItemClick = (visitID) => {
        if (this.props.screenIndex === MilesLogScreenContainer.ACTIVE_TAB_INDEX) {
            this.showEditMilesModalForVisitID(visitID);
        }
    }

    formatDate = (date) => (
        moment(date).subtract(moment().utcOffset(), 'minutes').format('MMMM DD')
    )

    isVisitSelected = (visitID) => (this.props.selectedDatesSet.has(visitID))

    toggleVisitSelected = (visitID) => (this.props.toggleDateSelected(visitID))


    renderSectionHeader = (title) => {
        if (!title) return;
        let isSectionSelected;
        if (this.props.showCheckBox) {
            const allSectionVisits = this.props.sectionData.find(section => section.title === title).data;
            const visitIDs = allSectionVisits.map(visit => visit.visitID);
            isSectionSelected = visitIDs.every(visitID => this.isVisitSelected(visitID));
        }
        return (
            <View style={{flexDirection: 'row', flex: 1, borderBottomColor: '#E1E1E1', borderBottomWidth: 1, alignItems: 'center', marginTop: 5}}>
                <View style={{width: 40}}>
                    {
                        this.props.showCheckBox &&
                        <CustomCheckBox
                            checked={isSectionSelected}
                            checkBoxStyle={{width: 15, height: 15, alignSelf: 'flex-start', marginTop: 10}}
                            checkBoxContainerStyle={{width: 40, height: '100%', justifyContent: 'center'}}
                            onPress={() => this.props.toggleSectionSelected(title, isSectionSelected)}
                        />
                    }
                </View>
                <Text style={{...styles.milesDataStyle, fontSize: 15, fontWeight: '500'}}>{title}</Text>
            </View>
        );
    }

    getScreenBasedOnSelectedIndex = () => {
        switch (this.props.screenIndex) {
            case MilesLogScreenContainer.ACTIVE_TAB_INDEX:
                return (
                    <ActiveLogsScreen
                        data={this.props.data}
                        navigator={this.props.navigator}
                        selectedDatesSet={this.props.selectedDatesSet}
                        toggleDateSelected={this.props.toggleDateSelected}
                        toggleSelectAll={this.props.toggleSelectAll}
                        selectDatesInRange={this.props.selectDatesInRange}
                    />);
            case MilesLogScreenContainer.SUBMITTED_TAB_INDEX:
                return <ReportsScreen />;
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
                        style={[{flex: 1, alignItems: 'center'}, this.props.screenIndex === MilesLogScreenContainer.ACTIVE_TAB_INDEX ? selectedTabStyle : {}]}
                        onPress={() => this.props.updateScreenIndex(MilesLogScreenContainer.ACTIVE_TAB_INDEX)}
                    >
                        <Text style={{textAlign: 'center', fontSize: 16, marginTop: 10, marginBottom: 5}}>
                            Active Logs
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[{flex: 1, alignItems: 'center'}, this.props.screenIndex === MilesLogScreenContainer.SUBMITTED_TAB_INDEX ? selectedTabStyle : {}]}
                        onPress={() => this.props.updateScreenIndex(MilesLogScreenContainer.SUBMITTED_TAB_INDEX)}
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
