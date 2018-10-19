import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {Button} from 'react-native-elements';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import {PrimaryColor, PrimaryFontFamily} from '../../utils/constants';
import {Images} from '../../Images';
import {borderColor, styles} from './styles';

export default class SelectDatesPopup extends Component {

    static START_DATE = 'start';
    static END_DATE= 'end';

    constructor(props) {
        super(props);
        this.state = {
            showTimePicker: null,
            startDate: props.startDate,
            endDate: props.endDate
        };
    }

    showDatePicker = (timepicker) => {
        this.setState({showTimePicker: timepicker});
    };

    hideTimePicker = () => {
        this.setState({showTimePicker: null});
    };

    formatDate = (date) => (moment(date).format('DD-MMM'));

    handleDoneClick = () => {
        if (this.state.endDate && this.state.startDate) {
            if (this.state.endDate >= this.state.startDate) {
                const startDate = moment(this.state.startDate).startOf('day');
                const endDate = moment(this.state.endDate).startOf('day');
                this.props.setDates(startDate.valueOf(), endDate.valueOf());
            }
        //    TODO Show error message OW
        }
        this.props.dismissModal();
    };

    render() {
        const startDateString = this.state.startDate ? this.formatDate(this.state.startDate) : '';
        const endDateString = this.state.endDate ? this.formatDate(this.state.endDate) : '';
        return (
            <View style={{backgroundColor: 'white', borderRadius: 5}}>
                <View style={{padding: 10, paddingLeft: 20}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{...styles.textStyle, fontSize: 15, marginTop: 10, marginBottom: 10}}>
                        {'Select Dates'}
                    </Text>
                    <TouchableOpacity onPress={this.props.dismissModal} style={{width: 40, height: 40, alignItems: 'center', justifyContent: 'center'}}>
                        <Image source={Images.close} />
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'row', marginTop: 10, alignItems: 'center'}}>
                    <Text style={{...styles.textStyle, fontSize: 11}}>
                        Start Date
                    </Text>
                    <TouchableOpacity style={{flex: 1}} onPress={() => this.showDatePicker(SelectDatesPopup.START_DATE)}>
                        <DateTimePicker
                            isVisible={!!this.state.showTimePicker && this.state.showTimePicker === SelectDatesPopup.START_DATE}
                            titleIOS={'Pick Start Date'}
                            maximumDate={new Date()}
                            onConfirm={(date) => { this.setState({startDate: date}); this.hideTimePicker(); }}
                            onCancel={() => {
                                this.hideTimePicker();
                            }}
                        />
                        <View style={{borderBottomColor: borderColor, borderBottomWidth: 1, marginLeft: 10, flex: 1, marginRight: 20, justifyContent: 'center'}}>
                            <Text style={{...styles.textStyle, fontSize: 12, paddingLeft: 5, paddingRight: 5, paddingBottom: 2}}>
                                {startDateString}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                    <View style={{flexDirection: 'row', marginTop: 10, alignItems: 'center'}}>
                    <Text style={{...styles.textStyle, fontSize: 11, marginTop: 10}}>
                        End Date
                    </Text>
                    <TouchableOpacity style={{flex: 1}} onPress={() => this.showDatePicker(SelectDatesPopup.END_DATE)}>
                        <DateTimePicker
                            isVisible={!!this.state.showTimePicker && this.state.showTimePicker === SelectDatesPopup.END_DATE}
                            maximumDate={new Date()}
                            titleIOS={'Pick End Date'}
                            onConfirm={(date) => { this.setState({endDate: date}); this.hideTimePicker(); }}
                            onCancel={() => {
                                this.hideTimePicker();
                            }}
                        />
                        <View style={{flex: 1, borderBottomColor: borderColor, borderBottomWidth: 1, marginLeft: 10, marginRight: 20, justifyContent: 'center'}}>
                            <Text style={{...styles.textStyle, fontSize: 12, paddingLeft: 5, paddingRight: 5, paddingBottom: 2}}>
                                {endDateString}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                </View>
                <Button
                    containerViewStyle={{marginLeft: 0, marginRight: 0, marginTop: 10}}
                    buttonStyle={{
                        backgroundColor: PrimaryColor,
                        marginLeft: 0,
                        marginRight: 0,
                        height: 40,
                        borderBottomLeftRadius: 5,
                        borderBottomRightRadius: 5
                    }}
                    title='Done'
                    onPress={() => {
                        this.handleDoneClick();
                    }}
                    textStyle={{
                        fontFamily: PrimaryFontFamily,
                        color: 'white',
                        fontSize: 16
                    }}
                />
            </View>
        );
    }

}
