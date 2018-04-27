import React, {Component} from 'react';
import moment from 'moment';
import {floDB, Visit} from '../../utils/data/schema';
import {HomeScreen} from './HomeScreen';
import {screenNames} from '../../utils/constants';

class HomeScreenContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: moment().utc().startOf('day')
        };

        this.navigateToVisitListScreen = this.navigateToVisitListScreen.bind(this);
        this.navigateToVisitMapScreen = this.navigateToVisitMapScreen.bind(this);
        this.onDateSelected = this.onDateSelected.bind(this);
        this.onOrderChange = this.onOrderChange.bind(this);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent(event) {
        if (event.type === 'DeepLink') {
            if (event.link === 'date') {
                this.setState({date: event.payload});
            }
        }
    }
    
    onDateSelected(date) {
        if (!date.isSame(this.state.date, 'day')) {
            this.setState({date});
        }
        console.log(date.format());
    }

    navigateToVisitListScreen() {
        this.props.navigator.push({
            screen: screenNames.visitListScreen,
            passProps: {
                date: this.state.date,
                onOrderChange: this.onOrderChange.bind(this)
            },
            navigatorStyle: {
                tabBarHidden: true
            },
            navigatorButtons: {
                rightButtons: [{
                    id: 'calendar-picker',
                    title: 'pick',
                    // component: 'CalendarPickerButton',
                    // passProps: {
                    //     currentDate: this.state.date
                    // }
                }]
            }
        });
    }

    navigateToVisitMapScreen() {
        this.props.navigator.push({
            screen: screenNames.visitMapScreen,
            passProps: {
                date: this.state.date,
                onOrderChange: this.onOrderChange.bind(this)
            },
            navigatorStyle: {
                tabBarHidden: true
            },
            navigatorButtons: {
                rightButtons: [{
                    id: 'calendar-picker',
                    title: 'pick',
                    // component: 'CalendarPickerButton',
                    // passProps: {
                    //     currentDate: this.state.date
                    // }
                }]
            }
        });
    }

    onOrderChange() {
        this.forceUpdate();
        console.log('was called');
    }

    render() {
        const visitResultObject = floDB.objects(Visit.schema.name)
            .filtered('midnightEpochOfVisit==$0', this.state.date.valueOf());
        return (
            <HomeScreen
                navigateToVisitMapScreen={this.navigateToVisitMapScreen}
                navigateToVisitListScreen={this.navigateToVisitListScreen}
                date={this.state.date}
                totalVisitsCount={visitResultObject.length}
                remainingVisitsCount={visitResultObject.filtered('isDone==false').length}
                onDateSelected={this.onDateSelected}
                onOrderChange={this.onOrderChange}
            />
        );
    }
}

export {HomeScreenContainer};
