import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {Button} from 'react-native-elements';
import {InputField} from '../common/InputField';
import {
    ErrorMessageColor,
    PrimaryColor,
    PrimaryFontFamily,
} from '../../utils/constants';
import {Images} from '../../Images';
import {VisitService} from '../../data_services/VisitServices/VisitService';
import {grayColor, blackColor, styles} from './styles';
import {milesRenderString} from '../../utils/renderFormatUtils';

export default class AddOrEditMilesModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            odometerStart: typeof (props.odometerStart) === 'number' ? milesRenderString(props.odometerStart) : null,
            odometerEnd: typeof (props.odometerEnd) === 'number' ? milesRenderString(props.odometerEnd) : null,
            totalMiles: typeof (props.totalMiles) === 'number' ? milesRenderString(props.totalMiles) : null,
            comments: props.comments,
            showOdometerEndErrorMessage: false
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
                style={{borderBottomColor: grayColor, borderBottomWidth: 1, color: blackColor}}
                placeholderTextColor={grayColor}
                selectionColor={blackColor}
            />
        );
    }

    saveMilesDataAndDismissModal = () => {
        const {odometerStart, odometerEnd, totalMiles, comments} = this.state;
        VisitService.getInstance().updateMilesDataByVisitID(this.props.visitID,
            odometerStart, odometerEnd, totalMiles, comments);
        this.props.dismissMilesModal();
    }

    handleSaveClick = () => {
        const {odometerStart, odometerEnd} = this.state;
        if (odometerStart && odometerEnd) {
            if (parseFloat(odometerStart) <= parseFloat(odometerEnd)) {
                this.saveMilesDataAndDismissModal();
            } else {
                this.setState({showOdometerEndErrorMessage: true});
            }
        } else {
            this.saveMilesDataAndDismissModal();
        }
    }

    totalMilesFromOdometerInput = () => {
        if (this.state.odometerStart && this.state.odometerEnd) {
            return parseFloat(this.state.odometerEnd) - parseFloat(this.state.odometerStart);
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
            style={{borderBottomColor: grayColor, borderBottomWidth: 1, color: blackColor}}
            placeholderTextColor={grayColor}
            selectionColor={blackColor}
        />
    );

    // TODO - Restrict to one decimal after controlled text input is fixed
    // https://github.com/facebook/react-native/issues/5370
    handleOdometerStartInputChange = (text) => {
        this.setState({
            odometerStart: text,
            showOdometerEndErrorMessage: false
        });
    }

    handleOdometerEndInputChange = (text) => {
        this.setState({
            odometerEnd: text,
            showOdometerEndErrorMessage: false
        });
    }

    renderOdometerInputSection = () => (
        <View>
            {
                this.getOdometerInputField('Odometer Start', this.state.odometerStart, this.handleOdometerStartInputChange)
            }
            {
                this.getOdometerInputField('Odometer End', this.state.odometerEnd, this.handleOdometerEndInputChange)
            }
            {
                this.state.showOdometerEndErrorMessage &&
                    <Text style={{color: ErrorMessageColor, fontSize: 10, textAlign: 'center'}}>
                        End should be greater than start
                    </Text>
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
                    keyboardType={'decimal-pad'}
                    titleStyle={{...styles.inputTitleStyle, fontSize: 10}}
                    onChangeText={(text) => this.setState({totalMiles: text})}
                    value={this.state.totalMiles}
                    style={{borderBottomColor: grayColor, borderBottomWidth: 1, color: blackColor}}
                    placeHolder={'00'}
                    placeholderTextColor={grayColor}
                    selectionColor={blackColor}
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
                        <Text style={{...styles.milesDataStyle, fontSize: 15, marginTop: 10, marginBottom: 10}}>
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
                        this.handleSaveClick();
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
