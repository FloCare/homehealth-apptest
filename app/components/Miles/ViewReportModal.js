import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity, FlatList} from 'react-native';
import {Divider} from 'react-native-elements';
import {ReportService} from '../../data_services/VisitServices/ReportService';
import {timeZoneConvertedEpoch} from '../../utils/utils';
import {Report} from '../../utils/data/schema';
import {Images} from '../../Images';
import {styles} from './styles';
import {defaultBackGroundColor, PrimaryColor} from '../../utils/constants';
import {milesRenderString} from '../../utils/renderFormatUtils';
import {getMilesFromDateSummary} from './common';

export default class ViewReportModal extends Component {

    getStatusString(status) {
        if (status === Report.reportStateEnum.CREATED) {
            return 'Not Submitted';
        } else if (status === Report.reportStateEnum.SUBMIT_QUEUED) {
            return 'Submit Queued';
        } else if (status === Report.reportStateEnum.ACCEPTED) {
            return 'Submitted';
        }
        return 'Unknown status for report';
    }

    getDataForFlatList = (dateWiseSummary) => {
        const dataArray = [];
        for (const date in dateWiseSummary) {
            const dateSummary = dateWiseSummary[date];
            dateSummary.date = date;
            dataArray.push(dateSummary);
        }
        dataArray.sort((item1, item2) => parseInt(item1.date, 10) - parseInt(item2.date, 10));
        return dataArray;
    };


    renderMiles = (computedMiles, extraMiles) => (
        <View style={{flexDirection: 'row'}}>
            <Text style={styles.miniContentStyle}>
                {milesRenderString(computedMiles)}
            </Text>
            {
                !!extraMiles &&
                <View style={{flexDirection: 'row', marginLeft: 5}}>
                    <Text style={styles.miniContentStyle}>
                        {milesRenderString(extraMiles)}
                    </Text>
                    <View>
                        <Text style={{...styles.miniHeadingStyle, fontSize: 6}}>
                            Extra
                        </Text>
                        <Text style={{...styles.miniHeadingStyle, fontSize: 6}}>
                            Mi
                        </Text>
                    </View>
                </View>
            }
        </View>
        );


    renderHeader = (minDate, maxDate, reportStatus, totalComputedMiles, totalExtraMiles, totalVisits) => {
        const startDate = timeZoneConvertedEpoch(minDate).format('MMM DD');
        const endDate = timeZoneConvertedEpoch(maxDate).format('MMM DD');
        const reportStatusString = this.getStatusString(reportStatus);

        return (
            <View
                style={{
                    justifyContent: 'space-between',
                    padding: 10,
                    ...styles.shadowStyle,
                    borderRadius: 5
                }}
            >
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={styles.miniHeadingStyle}>
                            Report:
                        </Text>
                        <Text style={{...styles.miniContentStyle, fontSize: 15, marginLeft: 3}}>
                            {`${startDate} - ${endDate}`}
                        </Text>
                        <Text style={{...styles.miniHeadingStyle, color: PrimaryColor, marginLeft: 3}}>
                            {`(${reportStatusString})`}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={this.props.dismissMilesModal} style={{width: 40, height: 40, alignItems: 'center', justifyContent: 'center'}}>
                        <Image style={{}} source={Images.close} />
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{...styles.miniHeadingStyle, marginRight: 3}}>
                        Total Miles:
                    </Text>
                    {
                        this.renderMiles(totalComputedMiles, totalExtraMiles)
                    }
                    <Text style={{...styles.miniHeadingStyle, marginLeft: 20}}>
                        Total Visits
                    </Text>
                    <Text style={{...styles.miniContentStyle, fontSize: 15, marginLeft: 10}}>
                        {totalVisits}
                    </Text>
                </View>
            </View>);
    };

    renderDateSummary = (item) => {
        const data = item.item;
        const date = parseInt(data.date, 10);
        return (
            <View style={{flex: 1}}>
                <View style={{flex: 1, marginTop: 10, flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{flex: 1, alignItems: 'center'}}>
                        <Text style={styles.miniHeadingStyle}>
                            {timeZoneConvertedEpoch(date).format('MMM')}
                        </Text>
                        <Text style={styles.miniContentStyle}>
                            {timeZoneConvertedEpoch(date).format('DD')}
                        </Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'center'}}>
                        <Text style={styles.miniHeadingStyle}>
                            Total Miles
                        </Text>
                        {
                            this.renderMiles(data.computedMiles, date.extraMiles)
                        }
                    </View>
                    <View style={{flex: 1, alignItems: 'center'}}>
                        <Text style={styles.miniHeadingStyle}>
                            Total Visits
                        </Text>
                        <Text style={styles.miniContentStyle}>
                            {data.nVisits}
                        </Text>
                    </View>
                </View>
                <Divider style={{...styles.dividerStyle, marginTop: 10}} />
            </View>
        );
    };

    render() {
        const {status, minDate, maxDate, dateWiseSummary} = ReportService.getInstance().getReportDateWiseSummary(this.props.report);
        const {totalComputedMiles, totalExtraMiles, totalVisits} = getMilesFromDateSummary(dateWiseSummary);
        return (
            <View style={{flex: 1, backgroundColor: defaultBackGroundColor, borderRadius: 5}}>
                {
                    this.renderHeader(minDate, maxDate, status, totalComputedMiles, totalExtraMiles, totalVisits)
                }
                {
                    <FlatList
                        data={this.getDataForFlatList(dateWiseSummary)}
                        renderItem={this.renderDateSummary}
                        keyExtractor={(item) => item.date}
                    />
                }
            </View>
        );
    }
}
