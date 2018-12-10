import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import firebase from 'react-native-firebase';
import {Button, Divider} from 'react-native-elements';
import {InputField} from '../common/InputField';
import {eventNames, PrimaryColor, PrimaryFontFamily} from '../../utils/constants';
import {Images} from '../../Images';
import {VisitService} from '../../data_services/VisitServices/VisitService';
import {grayColor, blackColor, styles} from './styles';
import {milesRenderString} from '../../utils/renderFormatUtils';
import {VisitMiles} from '../../utils/data/schema';

export default class AddOrEditMilesModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            odometerStart: typeof (props.odometerStart) === 'number' ? milesRenderString(props.odometerStart) : null,
            odometerEnd: typeof (props.odometerEnd) === 'number' ? milesRenderString(props.odometerEnd) : null,
            computedMiles: typeof (props.computedMiles) === 'number' ? milesRenderString(props.computedMiles) : null,
            extraMiles: typeof (props.extraMiles) === 'number' ? milesRenderString(props.extraMiles) : null,
            comments: props.comments,
            showOdometerEndErrorMessage: false
        };
    }

    getMilesInputField(value) {
        return (
            <InputField
                title={'Extra Miles'}
                titleStyle={styles.inputTitleStyle}
                keyboardType={'numeric'}
                autoFocus={false}
                fontSize={15}
                onChangeText={(extraMiles) => this.setState({extraMiles})}
                value={value}
                style={{borderBottomColor: grayColor, borderBottomWidth: 1, color: blackColor}}
                placeholderTextColor={grayColor}
                selectionColor={blackColor}
            />
        );
    }

    saveMilesDataAndDismissModal = () => {
        const {odometerStart, odometerEnd, computedMiles, extraMiles, comments} = this.state;
        VisitService.getInstance().updateMilesDataByVisitID(this.props.visitID, odometerStart, odometerEnd, computedMiles, extraMiles, comments);
        this.props.dismissMilesModal();
    };

    handleSaveClick = () => {
        let totalMiles = 0;
        totalMiles += this.state.computedMiles ? this.state.computedMiles : 0;
        totalMiles += this.state.extraMiles ? this.state.extraMiles : 0;
        firebase.analytics().logEvent(eventNames.ADD_EDIT_MILES, {
            VALUE: totalMiles
        });
        this.saveMilesDataAndDismissModal();
    };

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

    renderExtraMilesSection = () => (
        this.getMilesInputField(this.state.extraMiles)
    );

    renderComputedMilesSection = () => (
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text>
                Total Miles
            </Text>
            <Text>
                {
                    VisitMiles.getComputedMilesString(this.state.computedMiles)
                }
            </Text>
        </View>
    );

    renderMilesSection = () => (
        <View>
            {
                this.renderComputedMilesSection()
            }
            {
                this.renderExtraMilesSection()
            }
        </View>
    );


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
                    {/*TODO Add from and to address*/}
                    <Divider style={{...styles.dividerStyle, marginBottom: 10}} />
                    {
                        this.renderMilesSection()
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
