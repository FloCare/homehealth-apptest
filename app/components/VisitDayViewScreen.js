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
        console.log('got navigator event');
        if (event.type === 'NavBarButtonPress') {
            if (event.id === 'map-view') {
                this.setMapScreen();
            }
            if (event.id === 'list-view') {
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
                    icon: Images.mapView
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
                    icon: Images.listView,
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
