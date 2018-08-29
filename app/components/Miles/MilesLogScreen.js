import React, {Component} from 'react';
import {View, Text, SectionList, Image} from 'react-native';
import {ButtonGroup} from 'react-native-elements';
import moment from 'moment/moment';
import {PrimaryColor} from '../../utils/constants';
import {CustomCheckBox} from '../common/CustomCheckBox';
import {Address} from '../../utils/data/schemas/Models/address/Address';
import {styles} from '../common/styles';
import {Images} from '../../Images';
import {VisitMiles} from '../../utils/data/schemas/Models/visitMiles/VisitMiles';
import {milesRenderString} from '../../utils/renderFormatUtils';
import {Report} from '../../utils/data/schema';

const ActiveTabComponent = () => <Text> Active </Text>;
const SubmittedTabComponent = () => <Text> Submitted </Text>;

export default class MilesLogScreen extends Component {

    formatDate = (date) => (
        // TODO Validate in multiple time zones
        moment(date).subtract(moment().utcOffset(), 'minutes').format('MMMM DD')
    )

    updateIndex = (selectedIndex) => {
        this.props.updateIndex(selectedIndex);
    }

    isVisitSelected = (visitID) => (this.props.selectedVisitsSet.has(visitID))

    toggleVisitSelected = (visitID) => (this.props.toggleVisitSelected(visitID))

    renderItem = (visit) => {
        const milesTravelled = VisitMiles.getMiles(visit.visitMiles.odometerStart, visit.visitMiles.odometerEnd);
        const isVisitReportPending = visit.getReportStatus() === Report.reportStateEnum.CREATED;
        return (
            <View style={{flexDirection: 'row', flex: 1, marginTop: 5, marginBottom: 5, borderBottomColor: '#E1E1E1', borderBottomWidth: 1}}>
                <View style={{width: 40}}>
                    {
                        this.props.showCheckBox &&
                        <CustomCheckBox
                            checked={this.isVisitSelected(visit.visitID)}
                            checkBoxStyle={{width: 15, height: 15, alignSelf: 'flex-start', marginTop: 10}}
                            checkBoxContainerStyle={{width: 40, height: '100%', justifyContent: 'center'}}
                            onPress={() => this.toggleVisitSelected(visit.visitID)}
                        />
                    }
                </View>


                <View style={{flex: 1}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', flex: 1, alignItems: 'center'}}>
                        <View>
                            <Text style={{...styles.nameStyle, fontSize: 15}}>{visit.getAssociatedName()}</Text>
                            <View style={{flexDirection: 'row', marginTop: 2}}>
                                <Image source={Images.location} style={{marginRight: 8}} />
                                <Text style={styles.addressStyle}>
                                    {Address.minifiedAddress(visit.getAddress().formattedAddress)}
                                </Text>
                            </View>
                        </View>
                        <View>
                            <Text style={{...styles.milesDataStyle, fontSize: 10, marginRight: 10}}>
                                {this.formatDate(parseInt(visit.midnightEpochOfVisit, 10))}
                            </Text>
                            {
                                isVisitReportPending &&
                                <Text style={{...styles.milesDataStyle, fontSize: 10, marginRight: 10}}>
                                    Queued
                                </Text>
                            }
                        </View>
                    </View>
                    <View style={{flex: 1, marginTop: 5}}>
                        <Text style={styles.milesHeadingStyle}>
                            Odometer Reading
                        </Text>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', flex: 1, marginTop: 5}}>
                            <View style={{flexDirection: 'row', flex: 1}}>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={{...styles.milesHeadingStyle, fontSize: 9}}>
                                        Start:
                                    </Text>
                                    <Text style={{...styles.milesDataStyle, fontSize: 10, marginLeft: 3}}>
                                        {milesRenderString(visit.visitMiles.odometerStart)}
                                    </Text>
                                </View>
                                <View style={{flexDirection: 'row', marginLeft: 20}}>
                                    <Text style={{...styles.milesHeadingStyle, fontSize: 9}}>
                                        End:
                                    </Text>
                                    <Text style={{...styles.milesDataStyle, fontSize: 10, marginLeft: 3}}>
                                        {milesRenderString(visit.visitMiles.odometerEnd)}
                                    </Text>
                                </View>
                            </View>
                            <View style={{marginRight: 15}}>
                                <Text style={{...styles.milesDataStyle, fontSize: 12}}>
                                    {`${milesRenderString(milesTravelled)} Mi`}
                                </Text>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', marginTop: 5, marginBottom: 5}}>
                            <Text style={styles.milesHeadingStyle}>
                                Comments:
                            </Text>
                            <Text style={{...styles.milesDataStyle, fontSize: 11, marginLeft: 3}}>
                                {visit.visitMiles.milesComments}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    renderSectionHeader = (title) => {
        if (!title) return;
        let isSectionSelected;
        if (this.props.showCheckBox) {
            const allSectionVisits = this.props.sectionData.find(section => section.title === title).data;
            const visitIDs = allSectionVisits.map(visit => visit.visitID);
            isSectionSelected = visitIDs.every(visitID => this.isVisitSelected(visitID));
        }
        return (
            <View style={{flexDirection: 'row', flex: 1, borderBottomColor: '#E1E1E1', borderBottomWidth: 1, alignItems: 'center'}}>
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

    render() {
        //TODO Move to container
        const buttons = [{element: ActiveTabComponent}, {element: SubmittedTabComponent}];
        return (
            <View>
                <ButtonGroup
                    onPress={this.updateIndex}
                    selectedIndex={this.props.selectedIndex}
                    buttons={buttons}
                    containerStyle={{height: 30}}
                    selectedButtonStyle={{borderBottomColor: PrimaryColor, borderBottomWidth: 2}}
                />
                <SectionList
                    renderItem={({item}) => this.renderItem(item)}
                    renderSectionHeader={({section: {title}}) => this.renderSectionHeader(title)}
                    sections={this.props.sectionData}
                    keyExtractor={(item, index) => item + index}
                    stickySectionHeadersEnabled={false}
                />
            </View>
        );
    }
}
