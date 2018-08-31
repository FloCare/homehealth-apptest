import React, {Component} from 'react';
import {View, Text, SectionList, Image, TouchableOpacity} from 'react-native';
import moment from 'moment/moment';
import Modal from 'react-native-modal';
import {PrimaryColor} from '../../utils/constants';
import {CustomCheckBox} from '../common/CustomCheckBox';
import {Address} from '../../utils/data/schemas/Models/address/Address';
import {styles} from '../common/styles';
import {Images} from '../../Images';
import {VisitMiles} from '../../utils/data/schemas/Models/visitMiles/VisitMiles';
import {milesRenderString} from '../../utils/renderFormatUtils';
import {Report} from '../../utils/data/schema';
import MilesLogScreenContainer from './MilesLogScreenContainer';
import AddOrEditMilesModal from './AddOrEditMilesModal';

export default class MilesLogScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            milesModalVisible: false
        };
    }

    dismissEditMilesModal = () => {
        this.setState({milesModalVisible: false});
    }

    showEditMilesModal = () => {
        this.setState({milesModalVisible: true});
    }

    handleItemClick = () => {
        if (this.props.selectedIndex === MilesLogScreenContainer.ACTIVE_TAB_INDEX) {
            this.showEditMilesModal();
        }
    }

    formatDate = (date) => (
        // TODO Validate in multiple time zones
        moment(date).subtract(moment().utcOffset(), 'minutes').format('MMMM DD')
    )

    updateIndex = (selectedIndex) => {
        this.props.updateSelectedTabIndex(selectedIndex);
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

                <TouchableOpacity
                    style={{flex: 1}}
                    onPress={() => { this.handleItemClick(); }}
                >
                    <Modal
                        isVisible={this.state.milesModalVisible}
                        onBackButtonPress={() => this.dismissEditMilesModal()}
                        avoidKeyboard
                        backdropOpacity={0.8}
                    >
                        <AddOrEditMilesModal
                            name={visit.getAssociatedName()}
                            visitID={visit.visitID}
                            odometerStart={visit.visitMiles.odometerStart}
                            odometerEnd={visit.visitMiles.odometerEnd}
                            totalMiles={visit.visitMiles.totalMiles}
                            comments={visit.visitMiles.milesComments}
                            dismissMilesModal={this.dismissEditMilesModal}
                        />
                    </Modal>
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
                                    <Text style={{...styles.addressStyle, fontSize: 10, marginRight: 10}}>
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
                </TouchableOpacity>
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

    render() {
        const selectedTabStyle = {borderBottomWidth: 2, borderBottomColor: PrimaryColor};
        return (
            <View>
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
                        style={[{flex: 1, alignItems: 'center'}, this.props.selectedIndex === MilesLogScreenContainer.ACTIVE_TAB_INDEX ? selectedTabStyle : {}]}
                        onPress={() => this.props.updateSelectedTabIndex(MilesLogScreenContainer.ACTIVE_TAB_INDEX)}
                    >
                        <Text style={{textAlign: 'center', fontSize: 16, marginTop: 10, marginBottom: 5}}>
                            Active Logs
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[{flex: 1, alignItems: 'center'}, this.props.selectedIndex === MilesLogScreenContainer.SUBMITTED_TAB_INDEX ? selectedTabStyle : {}]}
                        onPress={() => this.props.updateSelectedTabIndex(MilesLogScreenContainer.SUBMITTED_TAB_INDEX)}
                    >
                        <Text style={{textAlign: 'center', fontSize: 16, marginTop: 10, marginBottom: 5}}>
                            Submitted Logs
                        </Text>
                    </TouchableOpacity>
                </View>
                <SectionList
                    renderItem={({item}) => this.renderItem(item)}
                    renderSectionHeader={({section: {title}}) => this.renderSectionHeader(title)}
                    sections={this.props.sectionData}
                    keyboardShouldPersistTaps
                    keyExtractor={(item, index) => item + index}
                    stickySectionHeadersEnabled={false}
                />
            </View>
        );
    }
}
