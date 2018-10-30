import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {Divider} from 'react-native-elements';
import SortableList from 'react-native-sortable-list';
import moment from 'moment';
import Modal from 'react-native-modal';
import Toast from 'react-native-easy-toast';
import {borderColor, styles, blackColor} from './styles';
import {
    detailBackGroundColor,
    ErrorMessageColor,
    PrimaryColor,
    screenNames
} from '../../utils/constants';
import {CustomCheckBox} from '../common/CustomCheckBox';
import SelectDatesPopup from './SelectDatesPopup';
import {isSameMonth} from '../../utils/collectionUtils';
import {SimpleButton} from '../common/SimpleButton';
import {milesRenderString} from '../../utils/renderFormatUtils';
import {Images} from '../../Images';
import {toastDuration, toastMessages} from './ToastMessages';
import {dateService} from '../../data_services/DateService';

function DateRowGenerator(toggleDate, navigator) {
    class RenderDateRow extends Component {

        constructor(props) {
            super(props);
            this.state = {
                detailed: false,
                data: props.data,
                rangeStartDate: null,
                rangeEndDate: null,
            };
        }

        getDate = () => (parseInt(this.state.data.date, 10));
        getVisits = () => (this.state.data.visits);
        getComputedMilesForVisit = (visit) => (visit.visitMiles.computedMiles);
        getExtraMilesForVisit = (visit) => visit.visitMiles.extraMiles;
        isSelected = () => (this.props.data.isSelected);

        dateAndCheckBoxComponent = () => {
            const date = this.getDate();
            return (
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <CustomCheckBox
                        checked={this.isSelected()}
                        checkBoxStyle={{width: 15, height: 15, alignSelf: 'center'}}
                        checkBoxContainerStyle={{width: 40, height: 40, justifyContent: 'center'}}
                        onPress={() => toggleDate(date.toString())}
                    />
                    <View style={{alignItems: 'center'}}>
                        <Text style={styles.miniHeadingStyle}>
                            {moment(date).format('MMM')}
                        </Text>
                        <Text style={styles.miniContentStyle}>
                            {moment(date).format('D')}
                        </Text>
                    </View>
                </View>
            );
        };

        totalMilesComponent = () => {
            const visits = this.getVisits();
            const milesVisits = visits.slice(1);
            let totalComputedMiles = 0;
            let extraMiles = 0;
            let infoPending = false;
            let pendingVisitsExist = false;
            for (let i = 0; i < visits.length; i++) {
                if (!visits[i].isDone) {
                    pendingVisitsExist = true;
                }
            }
            for (let i = 0; i < milesVisits.length; i++) {
                if (milesVisits[i].visitMiles.IsMilesInformationPresent) {
                    totalComputedMiles += this.getComputedMilesForVisit(milesVisits[i]);
                } else {
                    infoPending = true;
                    break;
                }
                if (this.getExtraMilesForVisit(milesVisits[i])) {
                    extraMiles += this.getExtraMilesForVisit(milesVisits[i]);
                }
            }
            const milesColor = pendingVisitsExist ? ErrorMessageColor : blackColor;
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
                <View>
                    {
                        infoPending ? <Text style={styles.miniContentStyle}>___</Text> :
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={{...styles.miniContentStyle, color: milesColor}}>
                                    {milesRenderString(totalComputedMiles)}
                                </Text>
                                {
                                    pendingVisitsExist &&
                                    <Text style={{color: ErrorMessageColor}}>
                                        *
                                    </Text>
                                }
                                {
                                    !!extraMiles && extraMilesSection
                                }
                            </View>
                    }
                </View>
            );
            return (
                <View style={{flex: 1, alignItems: 'center'}}>
                    <Text style={styles.miniHeadingStyle}>
                        Total Miles
                    </Text>
                    {milesSection}
                </View>
            );
        };

        totalVisitsComponent = () => {
            const visits = this.getVisits();
            return (
                <View style={{flex: 1, alignItems: 'center'}}>
                    <Text style={styles.miniHeadingStyle}>
                        Total Visits:
                    </Text>
                    <Text style={styles.miniContentStyle}>
                        {visits.length}
                    </Text>
                </View>
            );
        };

        renderDoneUndoneImage = (visit) => {
            const imageSource = visit.isDone ? Images.tickMark : Images.notDone;
            return <Image source={imageSource} />;
        };

        renderSingleVisit = (visit, isFirstVisit) => {
            const milesFontColor = visit.isDone ? styles.textStyle.color : ErrorMessageColor;
            return (
                <View style={{flex: 1, alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between', margin: 5}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        {
                            this.renderDoneUndoneImage(visit)
                        }
                        <Text style={{...styles.textStyle, marginLeft: 10}}>
                            {visit.getAssociatedName()}
                        </Text>
                    </View>
                    {
                        !isFirstVisit &&
                        <View style={{flexDirection: 'row', alignSelf: 'flex-end', alignItems: 'center'}}>
                            <Text style={{...styles.textStyle, color: milesFontColor}}>
                                {
                                    milesRenderString(this.getComputedMilesForVisit(visit))
                                }
                            </Text>
                            {
                                !!this.getExtraMilesForVisit(visit) &&
                                <Text style={{...styles.textStyle, fontSize: 10, color: milesFontColor}}>
                                    {`+${milesRenderString(this.getExtraMilesForVisit(visit))} mi`}
                                </Text>
                            }
                            {
                                !visit.isDone &&
                                    <Text style={{...styles.textStyle, fontSize: 10, color: milesFontColor}}>
                                        *
                                    </Text>
                            }
                        </View>
                    }
                </View>
            );
        };

        handleReviewClick = () => {
            dateService.setDate(this.getDate());
            navigator.push({
                    screen: screenNames.visitDayViewScreen,
                    passProps: {
                        selectedScreen: 'list',
                        date: this.getDate()
                    },
                    navigatorStyle: {
                        tabBarHidden: true
                    }
                }
            );
        };

        reviewSection = () => {
            const visits = this.getVisits();
            const notAllVisitsDone = visits.some(visit => !visit.isDone);
            if (notAllVisitsDone) {
                return (
                    <View style={{flex: 1, flexDirection: 'row', borderTopColor: borderColor, borderTopWidth: 1, padding: 15, alignItems: 'center'}}>
                        <Text style={{flex: 3, color: ErrorMessageColor, fontSize: 9, marginLeft: 10, marginRight: 10}}>
                            * Some miles are not counted for this day. Review and mark visits as 'Done' or 'Delete' them
                        </Text>
                        <View style={{flex: 1}}>
                            <TouchableOpacity onPress={this.handleReviewClick}>
                                <View style={{borderColor: PrimaryColor, borderWidth: 1, borderRadius: 3, padding: 3, alignItems: 'center'}}>
                                    <Text style={{...styles.textStyle, color: PrimaryColor}}>
                                        Review
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            }
        };

        commentsSection = () => {
            const visits = this.getVisits();
            let commentsString = '';
            for (let i = 0; i < visits.length; i++) {
                if (visits[i].visitMiles.milesComments) {
                    commentsString += `Visit-${i + 1}: ${visits[i].visitMiles.milesComments}; `;
                }
            }
            if (commentsString) {
                return (
                    <View style={{borderTopColor: borderColor, borderTopWidth: 1, flexDirection: 'row', padding: 15, paddingBottom: 5}}>
                        <Text style={styles.miniHeadingStyle}>
                            Comments:
                        </Text>
                        <Text style={{...styles.miniContentStyle, fontSize: 10, marginRight: 10, flex: 1, flexWrap: 'wrap'}}>
                            {commentsString}
                        </Text>
                    </View>
                );
            }
        }

        getDetailedVisitsComponent = () => {
            const visits = this.getVisits();
            const isFirstVisit = (visit) => (visits[0].visitID === visit.visitID);
            return (
                <View>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{flex: 1}} />
                        <View style={{flex: 6}}>
                            {visits.map(visit => this.renderSingleVisit(visit, isFirstVisit(visit)))}
                        </View>
                        <View style={{flex: 1}} />
                    </View>
                    {this.reviewSection()}
                    {this.commentsSection()}
                </View>
            );
        };

        toggleDetailView = () => {
            this.props.onItemLayoutUpdate(this.state.data.date);
            this.setState({detailed: !this.state.detailed});
        };

        render() {
            return (
                <View style={{flex: 1, marginBottom: 5, marginTop: 5}} onLayout={this.onLayoutCallback}>
                    <TouchableOpacity onPress={this.toggleDetailView}>
                        <View style={{flexDirection: 'row', flex: 1}}>
                            {
                               this.dateAndCheckBoxComponent()
                            }
                            {
                                this.totalMilesComponent()
                            }
                            {
                                this.totalVisitsComponent()
                            }
                        </View>
                        {
                            this.state.detailed &&
                                <View style={{flex: 1, flexDirection: 'row', backgroundColor: detailBackGroundColor, borderTopColor: borderColor, borderTopWidth: 1}}>
                                    <View style={{flex: 1, marginTop: 10, marginBottom: 10}}>
                                        {
                                            this.getDetailedVisitsComponent()
                                        }
                                    </View>
                                </View>
                        }
                    </TouchableOpacity>
                    <Divider style={styles.dividerStyle} />
                </View>
            );
        }
    }
    return (RenderDateRow);
}

export default class ActiveLogsScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showSelectDatesModal: false
        };
        this.renderRow = DateRowGenerator(this.props.toggleDateSelected, this.props.navigator);
    }

    getAllDates = () => (
        Object.keys(this.props.data)
    );


    onPressSelectDates = () => {
        this.setState({showSelectDatesModal: true});
    };

    dismissDatesModal = () => {
        this.setState({showSelectDatesModal: false});
    };

    setDatesRange = (startDate, endDate) => {
        this.setState({
            rangeStartDate: startDate,
            rangeEndDate: endDate
        });
        this.props.selectDatesInRange(startDate, endDate);
    };


    getRangeDateString = () => {
        const {rangeStartDate, rangeEndDate} = this.state;
        if (rangeStartDate && rangeEndDate) {
            let start;
            if (isSameMonth(rangeStartDate, rangeEndDate)) {
                start = moment(rangeStartDate).format('DD');
            } else {
                start = moment(rangeStartDate).format('DD-MMM');
            }
            const end = moment(rangeEndDate).format('DD-MMM');
            return `${start} - ${end}`;
        }
        return '';
    };

    filterSection = () => {
        const allDates = this.getAllDates();
        const areAllSelected = allDates.every(date => this.props.selectedDatesSet.has(date));
        const rangeDateString = this.getRangeDateString();
        return (
            <View style={{flexDirection: 'row', borderBottomColor: borderColor, borderBottomWidth: 1, alignItems: 'center', paddingTop: 5, paddingBottom: 5}}>
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                    <CustomCheckBox
                        checked={areAllSelected}
                        checkBoxStyle={{width: 15, height: 15, alignSelf: 'center'}}
                        checkBoxContainerStyle={{width: 40, height: 30, justifyContent: 'center', marginBottom: 0}}
                        onPress={() => this.props.toggleSelectAll(areAllSelected)}
                    />
                    <Text>
                        Select All
                    </Text>
                </View>
                <TouchableOpacity onPress={() => { this.onPressSelectDates(); }} style={{flex: 1, paddingLeft: 20, flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image source={Images.dates} style={{height: 28, resizeMode: 'contain'}} />
                        <Text style={{...styles.textStyle, color: PrimaryColor, marginLeft: 3}}>
                            Dates
                        </Text>
                    </View>
                    <View style={{minHeight: 30, justifyContent: 'center'}}>
                        <Modal
                            isVisible={this.state.showSelectDatesModal}
                            onBackButtonPress={this.dismissDatesModal}
                            dismissDatesModal={this.dismissDatesModal}
                            avoidKeyboard
                            backdropOpacity={0.8}
                        >
                            <SelectDatesPopup
                                dismissModal={this.dismissDatesModal}
                                setDates={this.setDatesRange}
                                startDate={this.state.rangeStartDate}
                                endDate={this.state.rangeEndDate}
                            />
                        </Modal>
                        <View style={{borderBottomColor: borderColor, borderBottomWidth: 1, marginLeft: 10, paddingLeft: 3, paddingRight: 3, minWidth: 40}}>
                            <Text style={{...styles.textStyle, fontSize: 9}}>
                                {rangeDateString}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    visitMilesNotPresentForVisits = (visits) => (visits.some(visit => !visit.visitMiles.IsMilesInformationPresent));
    pendingVisitsPresentForVisits = (visits) => (visits.some(visit => !visit.isDone));

    milesPresentForAllSelectedDates = () => {
        const selectedDates = Array.from(this.props.selectedDatesSet);
        // Check if miles is present for all visits except the first visit
        return !selectedDates.some(date => this.visitMilesNotPresentForVisits(this.props.data[date].visits.slice(1)));
    };

    anyPendingVisits = () => {
        const selectedDates = Array.from(this.props.selectedDatesSet);
        return selectedDates.some(date => this.pendingVisitsPresentForVisits(this.props.data[date].visits));
    };

    handleCreateReportClick = () => {
        if (this.props.selectedDatesSet.size > 0) {
            if (this.anyPendingVisits()) {
                this.refs.toast.show(toastMessages.visitsPending, toastDuration.LONG);
            } else if (!this.milesPresentForAllSelectedDates()) {
                this.refs.toast.show(toastMessages.milesPending, toastDuration.LONG);
            } else {
                const selectedDates = Array.from(this.props.selectedDatesSet);
                const allVisitIDs = selectedDates.reduce((accum, date) => {
                    const visits = this.props.data[date].visits;
                    const visitIDs = visits.map(visit => visit.visitID);
                    accum = [...accum, ...visitIDs];
                    return accum;
                }, []);
                this.props.createReport(allVisitIDs);
                this.refs.toast.show(toastMessages.createReportSuccess, toastDuration.MEDIUM);
            }
        }
    };

    render() {
        const dateAndVisitsData = this.props.data;
        const dates = Object.keys(this.props.data);
        dates.forEach(date => {
            const section = dateAndVisitsData[date];
            section.isSelected = this.props.selectedDatesSet.has(date);
        });
        return (
            <View style={{flex: 1}}>
                {
                    this.filterSection()
                }
                <View style={{marginTop: 5, flex: 1}}>
                    <SortableList
                        data={dateAndVisitsData}
                        order={this.props.order}
                        renderRow={this.renderRow}
                    />
                </View>
                <SimpleButton
                    title='Create Report'
                    onPress={this.handleCreateReportClick}
                    style={{height: 50}}
                />
                <Toast
                    ref='toast'
                    position='bottom'
                    style={styles.toastStyle}
                    textStyle={styles.toastTextStyle}
                    fadeInDuration={50}
                    fadeOutDuration={300}
                    positionValue={220}
                />
            </View>
        );
    }
}
