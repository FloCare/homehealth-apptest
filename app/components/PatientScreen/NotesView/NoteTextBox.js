import React, {Component} from 'react';
import {View, TextInput, Dimensions, Image, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import {SimpleButton} from '../../common/SimpleButton';
import {PrimaryColor} from '../../../utils/constants';
import {Images} from '../../../Images';

export class NoteTextBox extends Component {
    constructor(props) {
        super(props);
        this.state = {text: undefined};
        this.height = Dimensions.get('window').height;
        this.textBox = React.createRef();
    }


    storePicture(picturePath) {
        const xhr = new XMLHttpRequest();
        const presignedUrl = this.props.s3.getSignedUrl('putObject', {Bucket: 'health.flocare.notes', Key: 'yo', ContentType: 'image/jpeg'});
        console.log('presignedUrl', presignedUrl);
        xhr.open('PUT', presignedUrl);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    console.log('Image successfully uploaded to S3');
                } else {
                    console.log('Error while sending the image to S3');
                    console.log(xhr.responseText);
                }
            }
        };
        xhr.setRequestHeader('Content-Type', 'image/jpeg');
        xhr.send({uri: picturePath, type: 'image/jpeg', name: 'myimage.jpg'});
    }


    showCamera() {
        const options = {
            cameraType: 'back',
            quality: 0.5,
            mediaType: 'photo',
            allowsEditing: false
        };

        ImagePicker.launchCamera(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                console.log('submitting image from camera to app');
                this.props.onSubmit({imageData: response.data, imagePath: response.uri});
            }
        });
    }
    render() {
        return (
            <View
                style={{
                    // flex: 1,
                    flexDirection: 'column',
                    paddingHorizontal: 17.5,
                    borderTopWidth: 2.5,
                    borderColor: '#f1f1f1',
                    backgroundColor: 'white'
                }}
                behavior={'padding'}
                keyboardVerticalOffset={70}
            >
                <TextInput
                    style={{
                        paddingTop: 15,
                        maxHeight: 75,
                    }}
                    ref={this.textBox}
                    value={this.state.text}
                    onChangeText={text => { this.setState({text}); }}
                    multiline
                    placeholder={`Leave a note about ${this.props.patientName || 'patient'}`}
                />
                <View
                    style={{height: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}
                >
                    <TouchableOpacity
                        onPress={this.showCamera.bind(this)}
                    >
                        <Image
                            source={Images.camera}
                        />
                    </TouchableOpacity>
                    <TouchableWithoutFeedback
                        onPress={() => this.textBox.current.focus()}
                    >
                        <View
                            style={{height: 40, width: Dimensions.get('window').width * 0.5}}
                        />
                    </TouchableWithoutFeedback>
                    <SimpleButton
                        title={'Share'}
                        disabled={!this.state.text}
                        style={{
                            borderRadius: 15,
                            paddingHorizontal: 20,
                            opacity: this.state.text ? 1 : 0.6,
                            backgroundColor: 'transparent',
                            borderColor: PrimaryColor,
                            borderWidth: 2,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        textStyle={{
                            color: PrimaryColor
                        }}
                        onPress={() => {
                            if (this.state.text) {
                                this.props.onSubmit({text: this.state.text});
                                this.setState({text: undefined});
                            }
                        }}
                    />
                </View>
            </View>
        );
    }
}
