import React, {Component} from 'react';
import CalendarStrip from 'react-native-calendar-strip';
import {VisitListScreen} from './visitListScreen';
import {floDB, Visit, Patient, Episode} from '../../utils/data/schema';
import {screenNames} from '../../utils/constants';

class VisitListScreenContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: props.date,
            showCalendar: false
        };
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

        this.onDayPress = this.onDayPress.bind(this);
        this.navigateToAddVisitsScreen = this.navigateToAddVisitsScreen.bind(this);
    }

    onNavigatorEvent(event) {
        console.log('here');
        if (event.type === 'NavBarButtonPress') {
            if (event.id === 'calendar-picker-visits') {
                this.setState((prevState) => ({showCalendar: !prevState.showCalendar}));
            }
        }
    }

    onDayPress(day) {
        console.log(`${day.timestamp} was pressed`);
        this.setState({date: day, showCalendar: false});
    }

    navigateToAddVisitsScreen() {
        this.props.navigator.push({
            screen: screenNames.addVisitScreen,
            passProps: {
                date: this.state.date
            },
            navigatorStyle: {
                tabBarHidden: true
            }
        });
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
                date={this.state.date}
                calendarComponent={<CalendarStrip
                    style={{height: 100, paddingTop: 20, paddingBottom: 10}}
                    calendarHeaderStyle={{fontWeight: 'bold', fontSize: 24}}
                    // highlightDateNumberStyle={{fontWeight: '800'}}
                    onDateSelected={this.onDayPress}
                    selectedDate={this.state.date}
                />}
                showCalendar={this.state.showCalendar}
                // visitResultObject={this.generateVisitResultObject(this.state.date)}
                onAddVisitPress={this.navigateToAddVisitsScreen}
                onOrderChange={this.props.onOrderChange}
            />
        );
    }
}

export {VisitListScreenContainer};
