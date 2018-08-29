import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {Button} from 'react-native-elements';
import {InputField} from '../common/InputField';
import {PrimaryColor, PrimaryFontFamily} from '../../utils/constants';
import {Images} from '../../Images';
import {VisitService} from '../../data_services/VisitServices/VisitService';
import {styles} from './styles';
import {milesRenderString} from '../../utils/renderFormatUtils';

const grayColor = '#999999';
const blackColor = '#222222';
const textInputColor = blackColor;

export default class AddOrEditMilesModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            odometerStart: props.odometerStart ? milesRenderString(props.odometerStart) : null,
            odometerEnd: props.odometerEnd ? milesRenderString(props.odometerEnd) : null,
            totalMiles: props.totalMiles ? milesRenderString(props.totalMiles) : null,
            comments: props.comments
        };
    }

    getOdometerInputField(title, value, onChange) {
        return (
            <InputField
                title={title}
                titleStyle={styles.inputTitleStyle}
                keyboardType={'numeric'}
                autoFocus={false}
                fontSize={15}
                onChangeText={(text) => onChange(text)}
                value={value}
                style={{borderBottomColor: grayColor, borderBottomWidth: 1, color: textInputColor}}
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

    totalMilesFromOdometerInput = () => {
        if (this.state.odometerStart && this.state.odometerEnd) {
            return this.state.odometerEnd - this.state.odometerStart;
        }
        return 0;
    }

    renderCommentsSection = () => (
        <InputField
            title={'Comments'}
            titleStyle={styles.inputTitleStyle}
            keyboardType={'default'}
            onChangeText={(text) => this.setState({comments: text})}
            value={this.state.comments}
            style={{borderBottomColor: grayColor, borderBottomWidth: 1, color: textInputColor}}
            placeholderTextColor={grayColor}
            selectionColor={textInputColor}
        />
    );

    renderOdometerInputSection = () => (
        <View style={{marginBottom: 5}}>
            {
                this.getOdometerInputField('Odometer Start', this.state.odometerStart, text => this.setState({odometerStart: text}))
            }
            {
                this.getOdometerInputField('Odometer End', this.state.odometerEnd, text => this.setState({odometerEnd: text}))
            }
            <Text style={{fontSize: 12, color: PrimaryColor, textAlign: 'center'}}>
                    {`Total Miles : ${milesRenderString(this.totalMilesFromOdometerInput())} Mi`}
            </Text>
        </View>
    )

    // Component removed now. Need to figure out how to add this cleanly
    renderTotalMilesInputSection = () => (
        <View>
            <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                <InputField
                    title={'Total Miles'}
                    editable={!(this.state.odometerStart && this.state.odometerEnd)}
                    containerWidth={60}
                    keyboardType={'numeric'}
                    titleStyle={{...styles.inputTitleStyle, fontSize: 10}}
                    onChangeText={(text) => this.setState({totalMiles: text})}
                    value={this.state.totalMiles}
                    style={{borderBottomColor: grayColor, borderBottomWidth: 1, color: textInputColor}}
                    placeHolder={'00'}
                    placeholderTextColor={grayColor}
                    selectionColor={textInputColor}
                />
                <Text style={{fontSize: 12, color: blackColor, marginBottom: 10}}>
                    {' Mi'}
                </Text>
            </View>
        </View>
    )

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
                        this.renderOdometerInputSection()
                    }
                    {
                        this.renderCommentsSection()
                    }
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
                    title='Save'
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
