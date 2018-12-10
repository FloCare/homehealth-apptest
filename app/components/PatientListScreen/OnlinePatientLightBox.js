import React, {Component} from 'react';
import {View, Dimensions, TouchableOpacity, ActivityIndicator, Alert, Image} from 'react-native';
import firebase from 'react-native-firebase';
import {
    eventNames,
    parameterValues,
    PrimaryColor,
} from '../../utils/constants';
import StyledText from '../common/StyledText';
import {PatientDataService} from '../../data_services/PatientDataService';
import {Images} from '../../Images';

class OnlinePatientLightBox extends Component {
    constructor(props) {
        super(props);
        this.state = {loading: false};
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit() {
        firebase.analytics().logEvent(eventNames.PATIENT_ACTIONS, {
            type: parameterValues.IMPORT_PATIENT
        });
        PatientDataService.getInstance().requestPatientAssignmentByID(this.props.patient.patientID)
            .then(() => {
                PatientDataService.getInstance().fetchAndSavePatientsByID([this.props.patient.patientID])
                    .then(response => {
                        this.setState({loading: false});
                        if (response.success && response.success.length > 0) {
                            this.props.navigator.dismissLightBox();
                        } else {
                            this.props.navigator.dismissLightBox();
                            setTimeout(() => Alert.alert('Import Failed', 'Please contact the admin.'), 500);
                        }
                    });
            });
        this.setState({loading: true});
    }

    render() {
        const {height, width} = Dimensions.get('window');
        return (
            <View
                style={{
                    height: height * 0.3,
                    width: width * 0.8,
                    backgroundColor: '#eeeeee',
                    borderRadius: 5,
                }}
            >
                <View
                    style={{flexDirection: 'row', flex: 3, alignItems: 'center'}}
                >
                    <View
                        style={{flex: 1, alignItems: 'center'}}
                    >
                        <Image source={Images.person_ic} style={{resizeMode: 'contain'}} />
                    </View>
                    <View
                        style={{
                            flex: 3,
                            justifyContent: 'center',
                        }}
                    >
                        <StyledText
                            style={{fontWeight: '400', fontSize: 20, color: 'black', bottomMargin: 10}}
                        >
                            {this.props.patient.name}
                        </StyledText>
                        <StyledText
                            style={{fontWeight: '300', fontSize: 13, color: 'grey', width: '75%'}}
                        >
                            {this.props.patient.address.formattedAddress}
                        </StyledText>
                    </View>
                </View>
                <TouchableOpacity
                    style={{
                        flex: 1,
                        width: '100%',
                        backgroundColor: PrimaryColor,
                        borderRadius: 5,
                        borderTopLeftRadius: 0,
                        borderTopRightRadius: 0,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    onPress={this.onSubmit}
                >
                    {
                        this.state.loading ?
                            <ActivityIndicator size="small" color="#ffffff" /> :
                            <StyledText
                                style={{color: 'white'}}
                            >
                                Add to My Patients
                            </StyledText>
                    }
                </TouchableOpacity>
            </View>
        );
    }
}

export default OnlinePatientLightBox;
