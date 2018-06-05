import React, {Component} from 'react';
import CalendarStrip from 'react-native-calendar-strip';
import firebase from 'react-native-firebase';
import {connect} from 'react-redux';
import {VisitListScreen} from './visitListScreen';
import {floDB, Visit, Patient, Episode, VisitOrder} from '../../utils/data/schema';
import {screenNames, eventNames, parameterValues} from '../../utils/constants';
import {Images} from '../../Images';
import {ScreenWithCalendarComponent} from '../common/screenWithCalendarComponent';

class VisitListScreenContainer extends Component {
    static navigatorButtons = {
        rightButtons: [
            {
                id: 'map-view', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                icon: Images.mapView
            },
            // {
            //     id: 'calendar-picker',
            //     icon: Images.calendarSelected
            // }
        ]
    };

    constructor(props) {
        super(props);
        this.state = {
            date: props.date,
            // showCalendar: false
        };
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

        this.navigateToAddVisitsScreen = this.navigateToAddVisitsScreen.bind(this);
        // this.onOrderChange = this.onOrderChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        console.log('component received props');
        const orderedVisits = floDB.objectForPrimaryKey(VisitOrder, nextProps.date.valueOf());
        if (!orderedVisits || orderedVisits.visitList.length === 0) {
            console.log('component did 0');
            this.props.navigator.pop();
        } else this.setState({date: nextProps.date});
    }

    navigateToAddVisitsScreen() {
        this.props.navigator.push({
            screen: screenNames.addVisitScreen,
            passProps: {
                date: this.state.date,
                // onDone: this.onOrderChange
            },
            navigatorStyle: {
                tabBarHidden: true
            }
        });
    }

    onNavigatorEvent(event) {
        if (this.props.onNavigatorEvent) {
            this.props.onNavigatorEvent(event);
        }
    }

    // onOrderChange(newOrder) {
    //     // console.log('visitListScreen congainer callback');
    //     firebase.analytics().logEvent(eventNames.VISIT_ACTIONS, {
    //         'type': parameterValues.DND
    //     });
    //     // this.forceUpdate();
    //     // this.props.onOrderChange(newOrder);
    // }

    generateVisitResultObject(date) {
        return floDB.objects(Visit.schema.name).filtered('midnightEpochOfVisit==$0', this.state.date.valueOf()).sorted('isDone');//date);//.sorted('isDone');
    }

    render() {
        console.log('visitListScreenContainer rerendering');
        return (
            <VisitListScreen
                navigator={this.props.navigator}
                date={this.state.date}
                orderedVisitID={this.props.orderedVisitID}
                onAddVisitPress={this.navigateToAddVisitsScreen}
                // onOrderChange={this.onOrderChange}
            />
        );
    }
}

function mapStateToProps(state) {
    return {
        orderedVisitID: state.visitOrder,
    };
}

export default connect(mapStateToProps)(ScreenWithCalendarComponent(VisitListScreenContainer));
