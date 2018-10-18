import React, {Component} from 'react';
import {View, Text, FlatList, TouchableOpacity, Alert} from 'react-native';
import moment from 'moment';
import {grayColor, styles} from './styles';
import {isSameMonth} from '../../utils/collectionUtils';
import {PrimaryColor} from '../../utils/constants';
import {Report} from '../../utils/data/schema';
import {Divider} from 'react-native-elements';

// The day I will be a 1000 years old
const TIME_INF = 32384687400000;

export default class ReportsScreen extends Component {

    getReportSummary = (report) => {
        const reportItems = report.reportItems;
        const visits = reportItems.map(reportItem => reportItem.visit);
        let computedMiles = 0;
        let extraMiles = 0;
        let nVisits = 0;
        let minDate = TIME_INF;
        let maxDate = 0;
        visits.forEach(visit => {
            computedMiles += visit.visitMiles.computedMiles ? visit.visitMiles.computedMiles : 0;
            extraMiles += visit.visitMiles.extraMiles ? visit.visitMiles.extraMiles : 0;
            nVisits += 1;
            if (visit.midnightEpochOfVisit > maxDate) {
                maxDate = visit.midnightEpochOfVisit;
            }
            if (visit.midnightEpochOfVisit < minDate) {
                minDate = visit.midnightEpochOfVisit;
            }
        });
        return {
            computedMiles,
            extraMiles,
            nVisits,
            minDate,
            maxDate
        };
    };

    timeZoneConvertedEpoch = (date) => (moment(date).subtract(moment().utcOffset(), 'minutes'))

    getMonthString = (minDate, maxDate) => {
        if (isSameMonth(minDate, maxDate)) {
            return this.timeZoneConvertedEpoch(minDate).format('MMM');
        }
        const startMonth = this.timeZoneConvertedEpoch(minDate).format('MMM');
        const endMonth = this.timeZoneConvertedEpoch(maxDate).format('MMM');
        return `${startMonth} - ${endMonth}`;
    }

    renderDates = (minDate, maxDate) => {
        const monthString = this.getMonthString(minDate, maxDate);
        const startDate = this.timeZoneConvertedEpoch(minDate).format('DD');
        const endDate = this.timeZoneConvertedEpoch(maxDate).format('DD');
        return (
            <View>
                <Text style={styles.miniHeadingStyle}>
                    {monthString}
                </Text>
                <Text style={styles.miniContentStyle}>
                    {`${startDate} - ${endDate}`}
                </Text>
            </View>
        )
    }

    renderMiles = (computedMiles, extraMiles) => {
        const extraMilesSection = (
            <View style={{flexDirection: 'row'}}>
                <View>
                    <Text>
                        {` +${extraMiles}`}
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
                    {computedMiles}
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
    )

    renderSummary = (report) => {
        const {computedMiles, extraMiles, nVisits, minDate, maxDate} = this.getReportSummary(report);
        return (
            <View style={{flex: 1, flexDirection: 'row'}}>
                <View style={{flex: 1, alignItems: 'center'}}>
                    {
                        this.renderDates(minDate, maxDate)
                    }
                </View>
                <View style={{flex: 1, alignItems: 'center'}}>
                    {
                        this.renderMiles(computedMiles, extraMiles)
                    }
                </View>
                <View style={{flex: 1, alignItems: 'center'}}>
                    {
                        this.renderNumberOfVisits(nVisits)
                    }
                </View>
            </View>
        );
    };

    confirmAndSubmit = (reportID) => {
        Alert.alert(
            'Submit Report',
            'Submit report to office? Be warned - This action cannot be undone',
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'OK', onPress: () => { this.props.submitReport(reportID); }}
            ]
        );
    };

    getSubmitButton = (reportID) => (
        <TouchableOpacity
            style={{alignSelf: 'flex-end', borderColor: PrimaryColor, borderWidth: 1, borderRadius: 15, padding: 5, paddingLeft: 10, paddingRight: 10}}
            onPress={() => this.confirmAndSubmit(reportID)}
        >
            <Text style={{...styles.textStyle, color: PrimaryColor}}>
                Submit
            </Text>
        </TouchableOpacity>
    );

    getSubmittedButton = () => (
        <TouchableOpacity style={{alignSelf: 'flex-end', borderColor: grayColor, borderWidth: 1, borderRadius: 15, padding: 5, paddingLeft: 10, paddingRight: 10}}>
            <Text style={{...styles.textStyle, color: grayColor}}>
                Submitted
            </Text>
        </TouchableOpacity>
    );

    renderButtons = (reportID, submitted) => {
        const submitButton = submitted ? this.getSubmittedButton() : this.getSubmitButton(reportID);
        return (
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', marginTop: 15, marginBottom: 10}}>
                <View style={{flex: 2, flexDirection: 'row', marginLeft: 30}}>
                    <TouchableOpacity>
                        <Text style={{...styles.textStyle, color: PrimaryColor}}>
                            View
                        </Text>
                    </TouchableOpacity>
                    {
                        !submitted &&
                        <TouchableOpacity style={{marginLeft: 30}}>
                            <Text style={{...styles.textStyle, color: PrimaryColor}}>
                                Delete
                            </Text>
                        </TouchableOpacity>
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
        const reportSubmitted = report.status === Report.reportStateEnum.ACCEPTED;
        return (
            <View style={{marginTop: 10}}>
                {
                    this.renderSummary(report)}
                {
                    this.renderButtons(report.reportID, reportSubmitted)
                }
                <Divider style={styles.dividerStyle} />
            </View>
        );
    };

    render() {
        return (
            <FlatList
                data={this.props.data}
                renderItem={this.renderItem}
            />
        );
    }
}
