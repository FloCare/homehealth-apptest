import moment from 'moment/moment';
import React, {Component} from 'react';
import {View, TouchableOpacity, SectionList, AsyncStorage, Alert, Image} from 'react-native';
import {notificationType} from '../../utils/constants';
import StyledText from '../common/StyledText';
import styles from '../common/SectionedList/styles';
import {NotificationService} from '../../data_services/MessagingServices/NotificationService';
import {dateService} from '../../data_services/DateService';
import {PatientDataService} from '../../data_services/PatientDataService';
import {VisitService} from '../../data_services/VisitServices/VisitService';
import {Images} from '../../Images';

function renderSectionHeader({section}) {
    return (
        <StyledText style={styles.sectionHeader}>{section.title}</StyledText>
    );
}

export class NotificationScreen extends Component {
    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        this.state = {};
        AsyncStorage.getItem('lastSeenNotificationTimestamp').then(lastSeenNotificationTimestamp => {
            this.setState({lastSeenNotificationTimestamp: lastSeenNotificationTimestamp ? parseInt(lastSeenNotificationTimestamp) : 0});
        });

        NotificationService.getInstance().subscribeToNotification(this.onNotificationRefresh.bind(this));
    }

    componentDidMount() {
        this.refreshTabBadge();
    }

    componentDidUpdate() {
        this.refreshTabBadge();
    }

    onNotificationRefresh(notifications) {
        const recent = {
            title: 'Recent',
            data: []
        };
        const earlier = {
            title: 'Earlier',
            data: []
        };

        notifications.forEach(notification => {
            const ageInDays = moment().diff(notification.createdTime / 10000, 'days');
            if (ageInDays === 0) {
                recent.data.push(notification);
            } else earlier.data.push(notification);
        });

        this.setState({notificationSections: [recent, earlier].filter(section => section.data.length)});
    }

    onNavigatorEvent(event) {
        switch (event.id) {
            case 'willAppear':
                break;
            case 'didAppear':
                this.didAppear();
                break;
            case 'willDisappear':
                this.willDisappear();
                break;
            case 'didDisappear':
                break;
            case 'willCommitPreview':
                break;
        }
    }

    refreshTabBadge() {
        const notificationSections = this.state.notificationSections;
        let freshCount = 0;
        if (notificationSections) {
            notificationSections.forEach(notificationSection => {
                notificationSection.data.forEach(notification => {
                    if (notification.createdTime > this.state.lastSeenNotificationTimestamp) {
                        freshCount++;
                    }
                });
            });
        }

        this.props.navigator.setTabBadge({
            badge: freshCount !== 0 ? freshCount : null, // badge value, null to remove badge
            badgeColor: '#006400', // (optional) if missing, the badge will use the default color
        });
    }

    didAppear() {
        // this.appDateStateCache = dateService.getDate();
        // console.log(`recorded date as ${this.appDateStateCache}`);
    }

    willDisappear() {
        if (this.state.notificationSections && this.state.notificationSections.length > 0) {
            const mostRecentNotification = this.state.notificationSections[0].data[0] || this.state.notificationSections[0].data[1];
            AsyncStorage.setItem('lastSeenNotificationTimestamp', mostRecentNotification.createdTime.toString());
            this.setState({lastSeenNotificationTimestamp: mostRecentNotification.createdTime});
        }
    }

    renderNotification({item}) {
        const daysDiff = moment().diff(item.createdTime / 10000, 'days');
        const hoursDiff = moment().diff(item.createdTime / 10000, 'hours');

        let timeSinceNotification;
        if (daysDiff === 0) {
            if (hoursDiff !== 0) {
                timeSinceNotification = `${hoursDiff} hour${hoursDiff > 1 ? 's' : ''} ago`;
            } else timeSinceNotification = 'Right now';
        } else {
            timeSinceNotification = `${daysDiff} day${daysDiff > 1 ? 's' : ''} ago`;
        }

        let leftIcon;
        switch (item.type) {
            case notificationType.NEW_NOTE:
                leftIcon = Images.notificationAddNote;
                break;
            case notificationType.NEW_PATIENT:
                leftIcon = Images.notificationAddPatient;
                break;
            case notificationType.VISIT_COLLISION:
                leftIcon = Images.notificationVisitCollision;
                break;
            default:
                break;
        }

        return (
            <TouchableOpacity
                style={{
                    marginVertical: 3,
                    paddingRight: 20
                }}
                onPress={() => {
                    if (item.metadata) {
                        const metadata = JSON.parse(item.metadata);
                        if (metadata.patientID) {
                            const patient = PatientDataService.getInstance().getPatientByID(metadata.patientID);
                            if (!patient || patient.archived) {
                                Alert.alert('The patient doesn\'t exist. Please contact the admin');
                                return;
                            }
                        }
                        if (metadata.visitID) {
                            const visit = VisitService.getInstance().visitRealmService.getVisitByID(metadata.visitID);
                            if (!visit) {
                                Alert.alert('The visit is deleted from your schedule.');
                                return;
                            }
                        }
                    }
                    const passProps = JSON.parse(item.passProps);
                    if (passProps.midnightEpoch && passProps.midnightEpoch !== dateService.getDate()) dateService.setDate(passProps.midnightEpoch);

                    this.props.navigator.push({
                        screen: item.screenName,
                        passProps,
                        navigatorStyle: JSON.parse(item.navigatorStyle)
                    });
                }}
            >
                <View
                    style={{
                        flexDirection: 'row'
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'space-around'
                        }}
                    >
                        <Image
                            source={leftIcon}
                            style={{
                                width: '40%',
                                resizeMode: 'contain',
                                tintColor: (item.createdTime <= this.state.lastSeenNotificationTimestamp ? '#cccccc' : undefined)
                            }}
                        />
                    </View>
                    <View
                        style={{
                            flex: 5
                        }}
                    >
                        <StyledText
                            style={{
                                fontSize: 15,
                                color: 'black',
                                marginVertical: 5
                            }}
                        >
                            {item.body}
                        </StyledText>
                        <StyledText
                            style={{
                                fontSize: 11,
                                color: 'grey',
                                marginVertical: 3
                            }}
                        >
                            {timeSinceNotification}
                        </StyledText>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    renderSeparator() {
        return (
            <View style={{...styles.seperatorStyle, marginLeft: undefined}} />
        );
    }

    render() {
        if (this.state.notificationSections && this.state.notificationSections.length > 0) {
            return (
                <SectionList
                    renderItem={this.renderNotification.bind(this)}
                    renderSectionHeader={renderSectionHeader}
                    sections={this.state.notificationSections}
                    ItemSeparatorComponent={this.renderSeparator}

                />
            );
        }

        return (
            <View
                style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
            >
                <StyledText
                    style={{
                        color: 'grey'
                    }}
                >
                    No Notifications
                </StyledText>
                <StyledText
                    style={{
                        color: '#eeeeee'
                    }}
                >
                    ...Yet
                </StyledText>
            </View>
        );
    }
}
