import React, {Component} from 'react';
import {View, Image, TouchableHighlight} from 'react-native';
import {Button, Divider} from 'react-native-elements';
import moment from 'moment';
import CalendarStrip from 'react-native-calendar-strip';
import {floDB, Patient, Visit, VisitOrder} from '../../utils/data/schema';
import {arrayToMap} from '../../utils/collectionUtils';
import {makeCallbacks, todayMomentInUTCMidnight} from '../../utils/utils';
import {PrimaryColor} from '../../utils/constants';
import {Images} from '../../Images';
import StyledText from '../common/StyledText';

class AddVisitsForPatientScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: todayMomentInUTCMidnight()
        };
        this.onDateSelected = this.onDateSelected.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onDateSelected(date) {
        if (!date.isSame(this.state.date, 'day')) {
            this.setState({date});
        }
        console.log(date.format());
    }

    onSubmit() {
        const patientId = this.props.patientId;
        console.log('Adding visit for: ', patientId);
        const patient = floDB.objectForPrimaryKey(Patient, patientId);
        // console.log('Patient episodes are: ', patient.episodes);
        console.log('Date is:', this.state.date.valueOf());

        try {
            // Add a visit object
            let newVisit;
            floDB.write(() => {
                // For this patient, for that episode, push a new visit
                const visitID = `${Math.random().toString()}_Visit`;
                newVisit = floDB.create(Visit, {
                    visitID,
                    midnightEpochOfVisit: this.state.date.valueOf()
                });
                patient.episodes[0].visits.push(newVisit);
            });

            // Todo: Check if this can be improved
            // Todo: Visit and visitOrder should be inserted in same transaction
            let visitOrderObj = floDB.objectForPrimaryKey(VisitOrder, this.state.date.valueOf());
            // console.log('VisitOrderObj: ', visitOrderObj);
            if (!visitOrderObj) {
                floDB.write(() => {
                    visitOrderObj = floDB.create(VisitOrder, {midnightEpoch: this.state.date.valueOf(), visitList: []});
                });
            }

            let indexOfFirstDoneVisit;
            for (indexOfFirstDoneVisit = 0; indexOfFirstDoneVisit < visitOrderObj.visitList.length && !visitOrderObj.visitList[indexOfFirstDoneVisit].isDone; indexOfFirstDoneVisit++) {}

            // Copy the visits till indexOfFirstDoneVisit into newvisitOrder
            const newVisitOrder = [];
            newVisitOrder.push(...visitOrderObj.visitList.slice(0, indexOfFirstDoneVisit));

            newVisitOrder.push(newVisit);

            newVisitOrder.push(...visitOrderObj.visitList.slice(indexOfFirstDoneVisit, visitOrderObj.visitList.length));

            floDB.write(() => {
                visitOrderObj.visitList = newVisitOrder;
            });
        } catch (e) {
            console.log('Error during Adding Visit: ', e);
        }
        //TODO implement redux and remove this hack
        makeCallbacks();
        this.props.navigator.dismissLightBox();
    }

    render() {
        return (
            <View
                style={{
                    height: '55%',
                    width: '90%',
                    backgroundColor: '#eeeeee',
                    borderRadius: 10,
                    marginLeft: '5%',
                    marginRight: '5%',
                    marginTop: '15%',
                }}
            >
                <View style={{flexDirection: 'row', justifyContent: 'space-between', padding: 10}}>
                    <StyledText
                        style={{
                            fontWeight: 'bold',
                            fontSize: 15,
                        }}
                    >
                        Add Visit
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
                        style={{height: 75}}
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
}

export default AddVisitsForPatientScreen;
