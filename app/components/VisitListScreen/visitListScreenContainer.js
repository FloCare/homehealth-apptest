import React, {Component} from 'react';
import CalendarStrip from 'react-native-calendar-strip';
import firebase from 'react-native-firebase';
import {connect} from 'react-redux';
import {VisitListScreen} from './visitListScreen';
import {floDB, Visit, Patient, Episode, VisitOrder} from '../../utils/data/schema';
import {screenNames, eventNames, parameterValues} from '../../utils/constants';
import {Images} from '../../Images';
import {ScreenWithCalendarComponent} from '../common/screenWithCalendarComponent';
import {VisitService} from '../../data_services/VisitServices/VisitService';

class VisitListScreenContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: props.date,
            // showCalendar: false
        };

        this.navigateToAddVisitsScreen = this.navigateToAddVisitsScreen.bind(this);
        this.onOrderChange = this.onOrderChange.bind(this);
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

    onOrderChange(newOrder) {
        firebase.analytics().logEvent(eventNames.VISIT_ACTIONS, {
            type: parameterValues.DND
        });
        VisitService.getInstance().setVisitOrderForDate(newOrder, this.props.date);
    }

    render() {
        console.log('visitListScreenContainer rerendering');
        return (
            <VisitListScreen
                navigator={this.props.navigator}
                orderedVisitID={this.props.orderedVisitID}
                onAddVisitPress={this.navigateToAddVisitsScreen}
                onOrderChange={this.onOrderChange}
            />
        );
    }
}

function mapStateToProps(state) {
    // filtering visits which have information in visits store
    const filteredVisitOrder = state.visitOrder.filter((visitID) => state.visits[visitID]);
    return {
        date: state.date,
        orderedVisitID: filteredVisitOrder
    };
}

export default connect(mapStateToProps)(ScreenWithCalendarComponent(VisitListScreenContainer));
