import React, {Component} from 'react';
import {View, Image, TouchableOpacity, Dimensions} from 'react-native';
import firebase from 'react-native-firebase';
import {screenNames} from '../../../utils/constants';
import {todayMomentInUTCMidnight} from '../../../utils/utils';
import {Images} from '../../../Images';
import {ImageService} from '../../../data_services/ImageService';

export class ImageLightBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: props.date || todayMomentInUTCMidnight(),
            uri: ImageService.getInstance().getBase64DataForBucketAndKey(this.props.imageS3Object.Bucket, this.props.imageS3Object.Key)
        };
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }

    onNavigatorEvent(event) {
        if (event.id === 'didAppear') {
            firebase.analytics().setCurrentScreen(screenNames.addVisitsForPatient, screenNames.addVisitsForPatient);
        }
    }

    render() {
        const {height, width} = Dimensions.get('window');
        return (
            <View
                style={{
                    height: height * 0.8,
                    width: width * 0.8,
                    backgroundColor: 'black',
                    borderRadius: 20,
                }}
            >
                <View style={{flexDirection: 'row', justifyContent: 'flex-end', padding: 10}}>
                    <TouchableOpacity
                        onPress={() => this.props.navigator.dismissLightBox()}
                        style={{
                            padding: 6,
                            paddingLeft: 20,
                            paddingBottom: 13
                        }}
                    >
                        <Image source={Images.close} />
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Image
                        style={{
                            height: height * 0.8,
                            width: width * 0.8,
                            resizeMode: 'contain'
                        }}
                        source={{uri: this.state.uri}}
                    />
                </View>
            </View>
        );
    }
}
