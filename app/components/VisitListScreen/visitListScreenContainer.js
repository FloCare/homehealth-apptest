import React, {Component} from 'react';
import CalendarStrip from 'react-native-calendar-strip';
import {VisitListScreen} from './visitListScreen';
import {floDB, Visit, Patient, Episode, VisitOrder} from '../../utils/data/schema';
import {screenNames} from '../../utils/constants';

class VisitListScreenContainer extends Component {
    static navigatorButtons = {
        rightButtons: [
            {
                icon: require('../../../resources/mapView.png'),
                id: 'map-view', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                buttonColor: '#fffff'
            },
            {
                id: 'calendar-picker',
                icon: require('../../../resources/calendar.png'),
            }
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
                onDone: this.onOrderChange
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

    onOrderChange(newOrder) {
        // console.log('visitListScreen congainer callback');
        this.forceUpdate();
        this.props.onOrderChange(newOrder);
    }

    generateVisitResultObject(date) {
        return floDB.objects(Visit.schema.name).filtered('midnightEpochOfVisit==$0', this.state.date.valueOf()).sorted('isDone');//date);//.sorted('isDone');
    }

    render() {
        const obj = {}; obj[this.state.date.dateString] = {selected: true, selectedColor: 'blue'};
        console.log(this.props.onOrderChange);
        console.log('order c hange fn');
        return (
            <VisitListScreen
                navigator={this.props.navigator}
                date={this.state.date}
                // calendarComponent={<CalendarStrip
                //     style={{height: 100, paddingTop: 20, paddingBottom: 10}}
                //     calendarHeaderStyle={{fontWeight: 'bold', fontSize: 24}}
                //     // highlightDateNumberStyle={{fontWeight: '800'}}
                //     onDateSelected={this.onDayPress}
                //     selectedDate={this.state.date}
                // />}
                // showCalendar={this.state.showCalendar}
                // visitResultObject={this.generateVisitResultObject(this.state.date)}
                onAddVisitPress={this.navigateToAddVisitsScreen}
                onOrderChange={this.onOrderChange}
            />
        );
    }
}

export {VisitListScreenContainer};
