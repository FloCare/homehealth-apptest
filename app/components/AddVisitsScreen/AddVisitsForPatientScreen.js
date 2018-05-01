import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {Button, Divider} from 'react-native-elements';
import moment from 'moment';
import CalendarStrip from 'react-native-calendar-strip';
import {floDB, Patient, VisitOrder} from '../../utils/data/schema';

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

        floDB.write(() => {
            // For this patient, for that episode, push a new visit
            const visitID = `${Math.random().toString()}_Visit`;
            patient.episodes[0].visit = {
                visitID,
                midnightEpochOfVisit: this.state.date
            };

            // const visitOrderObjs = floDB.objects(VisitOrder.schema.name).filtered(`midnightEpoch = ${this.state.date.valueOf()}`);
            // console.log('VisitOrderObj: ', visitOrderObjs);
            // if (visitOrderObjs && visitOrderObjs.length > 0) {
            //     visitOrderObjs[0].visitList.push(patient.episodes[0].visit);
            // }
        });
        console.log('Added visit');

        // console.log('Date is:', this.state.date.valueOf());
        // const visitOrderObjs = floDB.objects(VisitOrder.schema.name).filtered(`midnightEpoch = ${this.state.date.valueOf()}`);
        // console.log('VisitORders: ', visitOrderObjs.length);
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
