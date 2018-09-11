import moment from 'moment/moment';
import React, {Component} from 'react';
import {View, TouchableOpacity, SectionList} from 'react-native';
import {PrimaryColor} from '../../utils/constants';
import StyledText from '../common/StyledText';
import styles from '../common/SectionedList/styles';
import {NotificationService} from '../../data_services/MessagingServices/NotificationService';

function renderNotification({item}) {
    const daysDiff = moment().diff(item.createdAt, 'days');
    const hoursDiff = moment().diff(item.createdAt, 'hours');

    let timeSinceNotification;
    if (daysDiff === 0) {
        if (hoursDiff !== 0) {
            timeSinceNotification = `${hoursDiff} hours ago`;
        } else timeSinceNotification = 'Right now';
    } else {
        timeSinceNotification = `${daysDiff} days ago`;
    }

    return (
        <TouchableOpacity
            style={{
                marginVertical: 3,
                paddingRight: 20
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
                    <View
                        style={{
                            backgroundColor: item.isSeen ? 'clear' : PrimaryColor,
                            borderRadius: 7,
                            height: 7,
                            width: 7
                        }}
                    />
                </View>
                <View
                    style={{
                        flex: 6
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
        // props.navigator.setTabBadge({
        //     badge: 17, // badge value, null to remove badge
        //     badgeColor: '#006400', // (optional) if missing, the badge will use the default color
        // });
        NotificationService.getInstance().subscribeToNotification(this.onNotificationRefresh.bind(this));
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

        this.setState({notificationSections: [recent, earlier]});
    }

    onNavigatorEvent(event) {
        switch (event.id) {
            case 'willAppear':
                break;
            case 'didAppear':
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

    willDisappear() {

    }

    render() {
        if (this.state.notificationSections) {
            return (
                <SectionList
                    renderItem={renderNotification}
                    renderSectionHeader={renderSectionHeader}
                    sections={this.state.notificationSections}
                />
            );
        }

        return null;
    }
}
