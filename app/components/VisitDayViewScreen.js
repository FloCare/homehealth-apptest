import React, {Component} from 'react';
import firebase from 'react-native-firebase';
import {Images} from '../Images';
import VisitListScreenContainer from '../components/VisitListScreen/visitListScreenContainer';
import VisitMapScreenController from '../components/VisitMapScreen/VisitMapScreenController';
import {screenNames, eventNames, parameterValues} from '../utils/constants';

class VisitDayViewScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {selectedScreen: props.selectedScreen};
        switch (props.selectedScreen) {
            case 'map':
                this.setMapScreen();
                break;
            case 'list':
                this.setListScreen();
                break;
            default:
                this.setListScreen();
                break;
        }
        console.log('got navigator event');

        props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent(event) {
        if (event.id === 'didAppear') {
            if(this.state.selectedScreen === 'list') {
                firebase.analytics().setCurrentScreen(screenNames.visitList, screenNames.visitList);
            }
            else if(this.state.selectedScreen === 'map') {
                firebase.analytics().setCurrentScreen(screenNames.visitMap, screenNames.visitMap);
            }
        }
        if (event.type === 'NavBarButtonPress') {
            if (event.id === 'map-view') {
                firebase.analytics().setCurrentScreen(screenNames.visitMap, screenNames.visitMap);
                this.setMapScreen();
            }
            if (event.id === 'list-view') {
                firebase.analytics().setCurrentScreen(screenNames.visitList, screenNames.visitList);
                this.setListScreen();
            }
        }
    }

    setListScreen() {
        firebase.analytics().logEvent(eventNames.VISIT_VIEW, {
            type: parameterValues.LIST
        });
        this.props.navigator.setButtons({
            rightButtons: [
                {
                    id: 'map-view',
                    icon: Images.map
                },
            ]
        });
        this.setState({selectedScreen: 'list'});
    }

    setMapScreen() {
        firebase.analytics().logEvent(eventNames.VISIT_VIEW, {
            type: parameterValues.MAP
        });
        this.props.navigator.setButtons({
            rightButtons: [
                {
                    id: 'list-view',
                    icon: Images.list,
                },
            ]
        });
        this.setState({selectedScreen: 'map'});
    }


    render() {
        switch (this.state.selectedScreen) {
            case 'list':
                return (
                    <VisitListScreenContainer {...this.props} />
                );
            case 'map':
                return (
                    <VisitMapScreenController {...this.props} />
                );
            default:
                return null;
        }
    }
}

export {VisitDayViewScreen};
