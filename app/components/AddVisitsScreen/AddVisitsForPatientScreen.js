import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {Button, Divider} from 'react-native-elements';
import moment from 'moment';
import CalendarStrip from 'react-native-calendar-strip';
import {floDB, Patient, Visit, VisitOrder} from '../../utils/data/schema';
import {arrayToMap} from '../../utils/collectionUtils';

class AddVisitsForPatientScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: moment().utc().startOf('day')
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
        console.log('Patient episodes are: ', patient.episodes);
        console.log('Date is:', this.state.date.valueOf());

        try {
            // Add a visit object
            floDB.write(() => {
                // For this patient, for that episode, push a new visit
                const visitID = `${Math.random().toString()}_Visit`;
                patient.episodes[0].visits.push({
                    visitID,
                    midnightEpochOfVisit: this.state.date.valueOf()
                });
            });

            // Todo: Check if this can be improved
            // Todo: Visit and visitOrder should be inserted in same transaction
            const allVisits = floDB.objects(Visit).filtered('midnightEpochOfVisit=$0', this.state.date.valueOf());
            let visitOrderObj = floDB.objectForPrimaryKey(VisitOrder, this.state.date.valueOf());
            console.log('VisitOrderObj: ', visitOrderObj);
            if (!visitOrderObj) {
                floDB.write(() => {
                    visitOrderObj = floDB.create(VisitOrder, {midnightEpoch: this.state.date.valueOf(), visitList: []});
                });
            }
            if (visitOrderObj && visitOrderObj.length > 0) {
                visitOrderObj.visitList.push(patient.episodes[0].visit);
            }
            const visitListByID = arrayToMap(visitOrderObj.visitList, 'visitID');
            let indexOfFirstDoneVisit;
            for (indexOfFirstDoneVisit = 0; indexOfFirstDoneVisit < visitOrderObj.visitList.length && !visitOrderObj.visitList[indexOfFirstDoneVisit].isDone; indexOfFirstDoneVisit++) {}

            // Copy the visits till indexOfFirstDoneVisit into newvisitOrder
            const newVisitOrder = [];
            newVisitOrder.push(...visitOrderObj.visitList.slice(0, indexOfFirstDoneVisit));

            for (let j = 0; j < allVisits.length; j++) {
                if (!visitListByID.has(allVisits[j].visitID)) {
                    newVisitOrder.push(allVisits[j]);
                }
            }
            newVisitOrder.push(...visitOrderObj.visitList.slice(indexOfFirstDoneVisit, visitOrderObj.visitList.length));

            floDB.write(() => {
                visitOrderObj.visitList = newVisitOrder;
            });
        } catch (e) {
            console.log('Error during Adding Visit: ', e);
        }
        this.props.navigator.dismissModal();
    }

    render() {
        return (
            <View
                style={{
                    height: '60%',
                    width: '90%',
                    borderColor: 'black',
                    borderWidth: 2,
                    backgroundColor: '#eeeeee'
                }}
            >
                <View>
                    <Text
                        style={{
                            fontWeight: 'bold',
                            fontSize: 25
                        }}
                    >
                        Add Visit
                    </Text>
                </View>
                <Divider
                    style={{
                        margin: 0,
                        height: 2,
                        backgroundColor: '#bbbbbb'
                    }}
                />
                <View>
                    <CalendarStrip
                        style={{height: 75}}
                        styleWeekend={false}
                        calendarHeaderFormat='MMMM'
                        calendarHeaderStyle={{fontWeight: '200', fontSize: 20}}
                        onDateSelected={this.onDateSelected}
                        selectedDate={this.state.date}
                        customDatesStyles={[
                            {
                                startDate: this.state.date.valueOf(),
                                dateContainerStyle: {backgroundColor: '#45ceb1', borderRadius: 0},
                                dateNameStyle: {color: 'white'},
                                dateNumberStyle: {color: 'white'},
                            },
                            {
                                startDate: moment().utc().startOf('day').valueOf(),
                                dateContainerStyle: {borderColor: '#45ceb1', borderRadius: 0},
                            }
                        ]}
                    />
                </View>
                <Button
                    title="SAVE"
                    large
                    containerViewStyle={{
                        width: '100%',
                        position: 'absolute',
                        bottom: 0,
                        marginLeft: 0,
                        marginRight: 0
                    }}
                    onPress={this.onSubmit}
                />
            </View>
        );
    }
}

export default AddVisitsForPatientScreen;
