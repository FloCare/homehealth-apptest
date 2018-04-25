import React, {Component} from 'react';
import {floDB, Visit} from '../../utils/data/schema';
import {HomeScreen} from './HomeScreen';
import {screenNames} from '../../utils/constants';

class HomeScreenContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: 0
        };
        
        this.navigateToVisitListScreen = this.navigateToVisitListScreen.bind(this);
        this.navigateToVisitMapScreen = this.navigateToVisitMapScreen.bind(this);
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
                                        .filtered('midnightEpoch==$0', this.state.date)
                                        .filtered('isDone==false');
        return (
            <HomeScreen
                visitResultObject={this.visitResultObject}
                navigateToVisitListScreen={this.navigateToVisitListScreen}
                navigateToVisitMapScreen={this.navigateToVisitMapScreen}
            />
        );
    }

}

export {HomeScreenContainer};
