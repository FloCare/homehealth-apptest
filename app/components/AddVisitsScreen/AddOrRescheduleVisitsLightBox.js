import React, {Component} from 'react';
import {View, Image, TouchableHighlight, Dimensions} from 'react-native';
import firebase from 'react-native-firebase';
import {Button, Divider} from 'react-native-elements';
import CalendarStrip from 'react-native-calendar-strip';
import {todayMomentInUTCMidnight} from '../../utils/utils';
import {
    screenNames,
    PrimaryColor,
    visitSubjects,
} from '../../utils/constants';
import {Images} from '../../Images';
import StyledText from '../common/StyledText';
import {PatientDataService} from '../../data_services/PatientDataService';
import {VisitService} from '../../data_services/VisitServices/VisitService';
import {PlaceDataService} from '../../data_services/PlaceDataService';

class AddOrRescheduleVisitsLightBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: props.date || todayMomentInUTCMidnight()
        };
        this.onDateSelected = this.onDateSelected.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }

    onNavigatorEvent(event) {
        // STOP GAP solution. Will be removed when redux is used
        if (event.id === 'didAppear') {
            firebase.analytics().setCurrentScreen(screenNames.addVisitsForPatient, screenNames.addVisitsForPatient);
        }
    }

    onDateSelected(date) {
        if (!date.isSame(this.state.date, 'day')) {
            this.setState({date});
        }
        console.log(date.format());
    }

    onSubmit() {
        try {
            // Add a visit object
            if (this.props.visitSubject === visitSubjects.PATIENT) {
                const patientId = this.props.patientId;
                console.log('Adding visit for patient: ', patientId);
                const patient = this.patientDataService().getPatientByID(patientId);
                VisitService.getInstance().createNewVisits([patient], this.state.date.valueOf());
            } else if (this.props.visitSubject === visitSubjects.PLACE) {
                const placeId = this.props.placeId;
                console.log('Adding visit for place: ', placeId);
                const place = PlaceDataService.getInstance().getPlaceByID(placeId);
                VisitService.getInstance().createNewVisits([place], this.state.date.valueOf());
            }

            if (this.props.isReschedule && this.props.oldVisitId) {
                VisitService.getInstance().deleteVisitByID(this.props.oldVisitId);
            }
        } catch (e) {
            console.log('Error during Adding Visit: ', e);
        }
        this.props.navigator.dismissLightBox();
    }

    render() {
        const {height, width} = Dimensions.get('window');
        const title = this.props.title || 'Add Visit';
        return (
            <View
                style={{
                    height: height * 0.3,
                    width: width * 0.8,
                    backgroundColor: '#eeeeee',
                    borderRadius: 10,
                }}
            >
                <View style={{flexDirection: 'row', justifyContent: 'space-between', padding: 10}}>
                    <StyledText
                        style={{
                            fontWeight: 'bold',
                            fontSize: 15,
                        }}
                    >
                        {title}
                    </StyledText>
                    <TouchableHighlight onPress={() => this.props.navigator.dismissLightBox()}>
                        <Image source={Images.close} />
                    </TouchableHighlight>
                </View>
                <Divider
                    style={{
                        margin: 0,
                        height: 1,
                        backgroundColor: '#bbbbbb'
                    }}
                />
                <View>
                    <CalendarStrip
                        swipeEnabled
                        calendarDatesStyle={{paddingHorizontal: 10}}
                        style={{height: 95}}
                        styleWeekend={false}
                        calendarHeaderFormat='MMMM'
                        calendarHeaderStyle={{fontWeight: '100', fontSize: 12, alignSelf: 'flex-start', padding: 10}}
                        onDateSelected={this.onDateSelected}
                        selectedDate={this.state.date}
                        customDatesStyles={[
                            {
                                startDate: this.state.date.valueOf(),
                                dateContainerStyle: {backgroundColor: PrimaryColor, borderRadius: 10},
                                dateNameStyle: {color: 'white'},
                                dateNumberStyle: {color: 'white'},
                            },
                            {
                                startDate: todayMomentInUTCMidnight().valueOf(),
                                dateNameStyle: {color: PrimaryColor},
                                dateNumberStyle: {color: PrimaryColor},
                            }
                        ]}
                    />
                </View>
                <Button
                    title="Done"
                    containerViewStyle={{
                        width: '100%',
                        position: 'absolute',
                        bottom: 0,
                        marginLeft: 0,
                        marginRight: 0
                    }}
                    buttonStyle={{
                        backgroundColor: PrimaryColor,
                        borderRadius: 10,
                        borderTopLeftRadius: 0,
                        borderTopRightRadius: 0
                    }}
                    onPress={this.onSubmit}
                />
            </View>
        );
    }

    // External Services
    patientDataService = () => PatientDataService.getInstance();

}

export default AddOrRescheduleVisitsLightBox;
