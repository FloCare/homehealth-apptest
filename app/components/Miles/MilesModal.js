import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {Button} from 'react-native-elements';
import {InputField} from '../common/InputField';
import {PrimaryColor, PrimaryFontFamily} from '../../utils/constants';
import {Images} from '../../Images';
import {VisitService} from '../../data_services/VisitServices/VisitService';

const grayColor = '#E9E9E7';
const blackColor = '#000000';
const textInputColor = blackColor;

export default class MilesModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            odometerStart: props.odometerStart ? props.odometerStart.toString() : null,
            odometerEnd: props.odometerEnd ? props.odometerEnd.toString() : null,
            totalMiles: props.totalMiles ? props.totalMiles.toString() : null,
            comments: props.comments
        };
    }

    getOdometerInputField(title, value, onChange) {
        return (
            <InputField
                title={title}
                titleStyle={{color: grayColor, fontSize: 12, marginBottom: 5}}
                keyboardType={'numeric'}
                autoFocus={false}
                placeholder={'000000'}
                onChangeText={(text) => onChange(text)}
                value={value}
                style={{borderBottomColor: grayColor, borderBottomWidth: 1, marginBottom: 10, color: textInputColor}}
                placeholderTextColor={grayColor}
                selectionColor={textInputColor}
            />
        );
    }

    saveMilesData = () => {
        const {odometerStart, odometerEnd, totalMiles, comments} = this.state;
        // TODO Sanitise input as required
        VisitService.getInstance().updateMilesDataByVisitID(this.props.visitID,
            odometerStart, odometerEnd, totalMiles, comments);
    }

    render() {
        const title = `Log Miles: ${this.props.name}`;
        return (
            <View style={{margin: 10, backgroundColor: 'white', borderRadius: 5}}>
                <View style={{marginLeft: 20, margin: 10}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={{marginTop: 10, marginBottom: 10}}>
                            {title}
                        </Text>
                        <TouchableOpacity onPress={() => this.props.dismissMilesModal()} style={{width: 40, height: 40, alignItems: 'center', justifyContent: 'center'}}>
                            <Image style={{}} source={Images.close} />
                        </TouchableOpacity>
                    </View>
                    {
                        this.getOdometerInputField('Odometer Start', this.state.odometerStart, text => this.setState({odometerStart: text}))
                    }
                    {
                        this.getOdometerInputField('Odometer End', this.state.odometerEnd, text => this.setState({odometerEnd: text}))
                    }
                    <InputField
                        titleStyle={{color: grayColor, fontSize: 13}}
                        keyboardType={'default'}
                        autoFocus={false}
                        placeholder={'Comments'}
                        onChangeText={(text) => this.setState({comments: text})}
                        value={this.state.comments}
                        style={{borderBottomColor: grayColor, borderBottomWidth: 1, color: textInputColor}}
                        placeholderTextColor={grayColor}
                        selectionColor={textInputColor}
                    />
                </View>

                <Button
                    containerViewStyle={{marginLeft: 0, marginRight: 0, marginTop: 10}}
                    buttonStyle={{
                        backgroundColor: PrimaryColor,
                        marginLeft: 0,
                        marginRight: 0,
                        height: 40,
                        // borderRadius: 5,
                        borderBottomLeftRadius: 5,
                        borderBottomRightRadius: 5
                    }}
                    title='Done'
                    onPress={() => {
                        this.saveMilesData();
                        this.props.dismissMilesModal();
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
