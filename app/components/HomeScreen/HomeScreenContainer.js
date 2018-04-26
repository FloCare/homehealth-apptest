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
                date: this.state.date
            },
            navigatorStyle: {
                tabBarHidden: true
            },
            navigatorButtons: {
                rightButtons: [{
                    id: 'calendar-picker-visits',
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
                date: this.state.date
            },
            navigatorStyle: {
                tabBarHidden: true
            },
            navigatorButtons: {
                rightButtons: [{
                    id: 'calendar-picker-visits',
                    title: 'pick',
                    // component: 'CalendarPickerButton',
                    // passProps: {
                    //     currentDate: this.state.date
                    // }
                }]
            }
        });
    }

    render() {
        this.visitResultObject = floDB.objects(Visit.schema.name)
            .filtered('midnightEpochOfVisit==$0', this.state.date.valueOf())
            .filtered('isDone==false');
        console.log(`vobject length${this.visitResultObject.length}`);
        return (
            <HomeScreen
                visitResultObject={this.visitResultObject}
                navigateToVisitMapScreen={this.navigateToVisitMapScreen}
                navigateToVisitListScreen={this.navigateToVisitListScreen}
                date={this.state.date}
                onDateSelected={this.onDateSelected}
            />
        );
    }
}

export {HomeScreenContainer};
