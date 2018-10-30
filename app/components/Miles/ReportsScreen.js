import React, {Component} from 'react';
import {View, Text, FlatList, TouchableOpacity, Alert} from 'react-native';
import {Divider} from 'react-native-elements';
import Modal from 'react-native-modal';
import {grayColor, styles} from './styles';
import {isSameMonth} from '../../utils/collectionUtils';
import {PrimaryColor} from '../../utils/constants';
import {Report} from '../../utils/data/schema';
import {milesRenderString} from '../../utils/renderFormatUtils';
import ViewReportModal from './ViewReportModal';
import {ReportService} from '../../data_services/VisitServices/ReportService';
import {timeZoneConvertedEpoch} from '../../utils/utils';
import {getMilesFromDateSummary} from './common';

export default class ReportsScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalReportID: null
        };
    }

    getReportSummary = (report) => {
        const {minDate, maxDate, dateWiseSummary} = ReportService.getInstance().getReportDateWiseSummary(report);
        const {totalComputedMiles, totalExtraMiles, totalVisits} = getMilesFromDateSummary(dateWiseSummary);
        return {
            totalComputedMiles,
            totalExtraMiles,
            totalVisits,
            minDate,
            maxDate
        };
    };

    getMonthString = (minDate, maxDate) => {
        if (isSameMonth(minDate, maxDate)) {
            return timeZoneConvertedEpoch(minDate).format('MMM');
        }
        const startMonth = timeZoneConvertedEpoch(minDate).format('MMM');
        const endMonth = timeZoneConvertedEpoch(maxDate).format('MMM');
        return `${startMonth} - ${endMonth}`;
    };

    getDeleteButton = (reportID) => (
        <TouchableOpacity style={{marginLeft: 30}} onPress={() => this.confirmAndDeleteReport(reportID)}>
            <Text style={{...styles.textStyle, color: PrimaryColor}}>
                Delete
            </Text>
        </TouchableOpacity>
    );

    getViewButton = (report) => (
        <TouchableOpacity onPress={() => this.handleViewReportClick(report.reportID)}>
            <Modal
                isVisible={!!this.state.modalReportID && this.state.modalReportID === report.reportID}
                onBackButtonPress={() => this.dismissReportModal()}
                avoidKeyboard
                backdropOpacity={0.8}
            >
                <ViewReportModal
                    report={report}
                    dismissMilesModal={this.dismissReportModal}
                />
            </Modal>
            <Text style={{...styles.textStyle, color: PrimaryColor}}>
                View
            </Text>
        </TouchableOpacity>
    );

    getSubmitButton = (reportID) => (
        <TouchableOpacity
            style={{alignSelf: 'flex-end', borderColor: PrimaryColor, borderWidth: 1, borderRadius: 15, padding: 5, paddingLeft: 10, paddingRight: 10}}
            onPress={() => this.confirmAndSubmitReport(reportID)}
        >
            <Text style={{...styles.textStyle, color: PrimaryColor}}>
                Submit
            </Text>
        </TouchableOpacity>
    );

    getSubmittedButton = (status) => (
        <TouchableOpacity style={{alignSelf: 'flex-end', borderColor: grayColor, borderWidth: 1, borderRadius: 15, padding: 5, paddingLeft: 10, paddingRight: 10}}>
            <Text style={{...styles.textStyle, color: grayColor}}>
                {
                    status === Report.reportStateEnum.ACCEPTED ? 'Submitted' : 'Submit Queued'
                }
            </Text>
        </TouchableOpacity>
    );

    confirmAndDeleteReport = (reportID) => {
        Alert.alert(
            'Delete Report',
            'Are you sure you want to delete report? These visits will go back to active logs',
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'OK', onPress: () => { this.props.deleteReport(reportID); }}
            ]
        );
    };

    confirmAndSubmitReport = (reportID) => {
        Alert.alert(
            'Submit Report',
            'Submit report to office? Be warned - This action cannot be undone',
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'OK', onPress: () => { this.props.submitReport(reportID); }}
            ]
        );
    };

    dismissReportModal = () => {
        this.setState({modalReportID: null});
    };

    handleViewReportClick = (reportID) => {
        this.setState({modalReportID: reportID});
    };

    renderDates = (minDate, maxDate) => {
        const monthString = this.getMonthString(minDate, maxDate);
        const startDate = timeZoneConvertedEpoch(minDate).format('DD');
        const endDate = timeZoneConvertedEpoch(maxDate).format('DD');
        return (
            <View>
                <Text style={styles.miniHeadingStyle}>
                    {monthString}
                </Text>
                <Text style={styles.miniContentStyle}>
                    {`${startDate} - ${endDate}`}
                </Text>
            </View>
        );
    };

    renderMiles = (computedMiles, extraMiles) => {
        const extraMilesSection = (
            <View style={{flexDirection: 'row'}}>
                <View>
                    <Text>
                        {` +${milesRenderString(extraMiles)}`}
                    </Text>
                </View>
                <View>
                    <Text style={{...styles.miniHeadingStyle, fontSize: 6}}>
                        Extra
                    </Text>
                    <Text style={{...styles.miniHeadingStyle, fontSize: 6}}>
                        mi
                    </Text>
                </View>
            </View>
        );
        const milesSection = (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.miniContentStyle}>
                    {milesRenderString(computedMiles)}
                </Text>
                {
                    !!extraMiles && extraMilesSection
                }
            </View>
        );
        return (
            <View>
                <Text style={styles.miniHeadingStyle}>
                    Total Miles
                </Text>
                {
                    milesSection
                }
            </View>
        );
    };

    renderNumberOfVisits = (nVisits) => (
        <View>
            <Text style={styles.miniHeadingStyle}>
                Total Visits
            </Text>
            <Text style={styles.miniContentStyle}>
                {nVisits}
            </Text>
        </View>
    );

    renderSummary = (report) => {
        const {totalComputedMiles, totalExtraMiles, totalVisits, minDate, maxDate} = this.getReportSummary(report);
        return (
            <View style={{flex: 1, flexDirection: 'row'}}>
                <View style={{flex: 1, alignItems: 'center'}}>
                    {
                        this.renderDates(minDate, maxDate)
                    }
                </View>
                <View style={{flex: 1, alignItems: 'center'}}>
                    {
                        this.renderMiles(totalComputedMiles, totalExtraMiles)
                    }
                </View>
                <View style={{flex: 1, alignItems: 'center'}}>
                    {
                        this.renderNumberOfVisits(totalVisits)
                    }
                </View>
            </View>
        );
    };


    renderButtons = (report) => {
        const {reportID, status} = report;
        const submitButton = status === Report.reportStateEnum.CREATED ? this.getSubmitButton(reportID) : this.getSubmittedButton(status);
        const deleteAllowed = status === Report.reportStateEnum.CREATED;
        return (
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', marginTop: 15, marginBottom: 10}}>
                <View style={{flex: 1, flexDirection: 'row', marginLeft: 30}}>
                    {
                        this.getViewButton(report)
                    }
                    {
                        deleteAllowed &&
                        this.getDeleteButton(reportID)
                    }
                </View>
                <View style={{flex: 1, marginRight: 40}}>
                    {
                        submitButton
                    }
                </View>
            </View>
        );
    };

    renderItem = (item) => {
        const report = item.item;
        return (
            <View style={{marginTop: 10}}>
                {
                    this.renderSummary(report)}
                {
                    this.renderButtons(report)
                }
                <Divider style={styles.dividerStyle} />
            </View>
        );
    };

    render() {
        // render data is a realm collection. Fetch from db doesn't happen till we access it.
        // Need this to ensure data is fetched so that flatlist knows to update if there is a change in data.
        const renderData = this.props.data.map(item => item);
        return (
            <FlatList
                data={renderData}
                renderItem={this.renderItem}
                keyExtractor={(item) => item.reportID}
            />
        );
    }
}
