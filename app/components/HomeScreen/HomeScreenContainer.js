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
        
        this.navigateToVisitsScreen = this.navigateToVisitsScreen.bind(this);
    }

    navigateToVisitsScreen() {
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

    render() {
        this.visitResultObject = floDB.objects(Visit.schema.name)
                                        .filtered('midnightEpoch==$0', this.state.date)
                                        .filtered('isDone==false');
        return (
            <HomeScreen visitResultObject={this.visitResultObject} navigateToVisitsScreen={this.navigateToVisitsScreen} />
        );
    }

}

export {HomeScreenContainer};
