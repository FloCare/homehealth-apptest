import React, {Component} from 'react';
import moment from 'moment';
import {View, Image, ActivityIndicator, TouchableOpacity} from 'react-native';
import firebase from 'react-native-firebase';
import StyledText from '../../common/StyledText';
import {Images} from '../../../Images';
import {eventNames, noteMessageType, PrimaryColor, screenNames} from '../../../utils/constants';
import {ImageService} from '../../../data_services/ImageService';
import {Icon} from 'react-native-elements';

class S3Image extends Component {
    constructor(props) {
        super(props);

        this.imageServiceInstance = ImageService.getInstance();
        this.imageUpdateHandler = this.imageUpdateHandler.bind(this);

        this.state = {image64Data: undefined, blur: false};
        // if (props.imageS3Object && props.imageS3Object.Key && props.imageS3Object.Bucket) {
        //     const imageData = this.imageServiceInstance.getBase64DataForBucketAndKey(props.imageS3Object.Bucket, props.imageS3Object.Key);
        //     if (imageData) {
        //         this.state.image64Data = imageData;
        //     }
        // }
    }

    componentDidMount() {
        this.timeout = setTimeout(() => {
            if (this.propsHaveImage()) {
                this.imageListenerDestroyer = this.imageServiceInstance.getImageListener(
                    this.imageServiceInstance.getIDByBucketAndKey(this.props.imageS3Object.Bucket, this.props.imageS3Object.Key),
                    this.imageUpdateHandler
                );

                // this.imageUpdateHandler();
            }
        }, 500);
    }

    componentWillUnmount() {
        if (this.timeout) clearTimeout(this.timeout);
        if (this.imageListenerDestroyer) {
            this.imageListenerDestroyer();
        }
    }

    propsHaveImage() {
        return this.props.imageS3Object && this.props.imageS3Object.Key && this.props.imageS3Object.Bucket;
    }

    imageUpdateHandler() {
        console.log('image updated');
        if (this.propsHaveImage()) {
            const imageData = ImageService.getInstance().getBase64DataForBucketAndKey(this.props.imageS3Object.Bucket, this.props.imageS3Object.Key);
            if (imageData) {
                this.setState({image64Data: imageData});
            }
        }
    }

    render() {
        if (!this.state.image64Data && this.props.imageS3Object) {
            return (
                <ActivityIndicator size="large" color="#000000" style={{marginVertical: 20}} />
            );
        }

        { /*<Icon type="material-community" name="chevron-up" color={PrimaryColor} />}*/
        }

        return (
            <View
                style={{
                    borderRadius: 15,
                    height: 130,
                    width: 130,
                }}
            >
                <TouchableOpacity
                    style={{
                        borderRadius: 15,
                        height: 130,
                        width: 130,
                        flex: 1,
                    }}
                    onPress={() => {
                        firebase.analytics().logEvent(eventNames.FULLSCREEN_IMAGE, {
                            VALUE: 1
                        });
                        this.props.navigator.showLightBox({
                            screen: screenNames.imageLightBox,
                            style: {
                                backgroundBlur: 'dark',
                                backgroundColor: '#00000070',
                                tapBackgroundToDismiss: true
                            },
                            passProps: {
                                uri: this.state.image64Data,
                            },
                        });
                    }}
                >
                    <Image
                        style={{
                            borderRadius: 15,
                            flex: 1,
                            width: undefined,
                            height: undefined,
                            resizeMode: 'cover',
                        }}
                        source={{uri: this.state.image64Data}}
                    />
                </TouchableOpacity>
            </View>
        );
    }
}

function noteBody(note, navigator) {
    const getTextElement = text => (
        <StyledText
            style={{
                fontSize: 11,
                color: '#202020'
            }}
        >
            {text}
        </StyledText>
    );

    if (note.messageType === noteMessageType.NEW_NOTE) {
        return (
            <StyledText
                style={{
                    fontSize: 11,
                    color: '#202020'
                }}
            >
                {getTextElement(note.data)}
            </StyledText>
        );
    } else if (note.messageType === noteMessageType.RICH_NEW_NOTE) {
        const noteDataJson = JSON.parse(note.data);
        let image;
        if (noteDataJson.imageS3Object) {
            image = (<S3Image
                imageS3Object={noteDataJson.imageS3Object}
                navigator={navigator}
            />);
        }

        return (
            <View>
                {image}
                {getTextElement(noteDataJson.text)}
            </View>
        );
    }
}

export function NoteBubble(note, navigator) {
    return (
        <View
            style={{
                flex: 1,
                opacity: note.synced === 'true' ? 1 : 0.6,
                flexDirection: 'row',
                marginVertical: 17.5,
            }}
            behavior='padding'
        >
            <View
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center'
                }}
            >
                <Image source={Images.notesIcon} />
            </View>
            <View
                style={{
                    flex: 5,
                    flexDirection: 'column'
                }}
            >
                <View
                    style={{
                        width: '90%',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                        marginBottom: 10,
                    }}
                >
                    <StyledText
                        style={{
                            fontSize: 14,
                            fontWeight: 'bold',
                            color: PrimaryColor
                        }}
                    >
                        {`${note.user.lastName}, ${note.user.role}`}
                    </StyledText>
                    <StyledText
                        style={{
                            fontSize: 11,
                            color: '#b1b1b1'
                        }}
                    >
                        {moment(note.timetoken).format('hh:mm a')}
                    </StyledText>
                </View>
                <View>
                    {noteBody(note, navigator)}
                </View>
            </View>
        </View>
    );
}
