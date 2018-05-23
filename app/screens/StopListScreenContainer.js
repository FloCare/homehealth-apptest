import React, {Component} from 'react';
import {Platform} from 'react-native';
import {StopListScreen} from '../components/StopListScreen';
import {floDB, Place} from '../utils/data/schema';
import {createSectionedListFromRealmObject} from '../utils/collectionUtils';
import {screenNames} from '../utils/constants';
import {Images} from '../Images';

class StopListScreenContainer extends Component {
    static navigatorButtons = {
        rightButtons: [
            Platform.select({
                android: {
                    icon: Images.addButton, // for icon button, provide the local image asset name
                    id: 'add', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                },
                ios: {
                    id: 'add',
                    systemItem: 'add'
                }
            })

        ]
    };

    constructor(props) {
        super(props);
        this.state = {
            searchText: null,
            stopList: [],
            stopCount: 0
        };
        this.getSectionData = this.getSectionData.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        this.handleListUpdate = this.handleListUpdate.bind(this);
        this.onPressAddStop = this.onPressAddStop.bind(this);
    }

    componentDidMount() {
        this.getSectionData(null);
        floDB.addListener('change', this.handleListUpdate);
        firebase.analytics().setCurrentScreen(screenNames.stopList, screenNames.stopList);
    }

    onSearch(query) {
        this.setState({searchText: query});
        this.getSectionData(query);
    }

    onNavigatorEvent(event) {
        if (event.id === 'willAppear') {
            const title = `Saved Places (${this.state.stopCount})`;
            this.props.navigator.setTitle({
                title
            });
        }

        if (event.type === 'NavBarButtonPress') { // this is the event type for button presses
            if (event.id === 'add') {       // this is the same id field from the static navigatorButtons definition
                this.onPressAddStop();
            }
        }
    }

    onPressAddStop() {
        this.props.navigator.push({
            screen: screenNames.addStop,
            title: 'Add Stop',
            navigatorStyle: {
                tabBarHidden: true
            }
        });
    }

    getSectionData(query) {
        if (!query) {
            const stopList = floDB.objects(Place.schema.name);
            const sortedStopList = stopList.sorted('name');
            const stopCount = sortedStopList.length;
            const sectionedStopList = createSectionedListFromRealmObject(sortedStopList);
            this.setState({
                stopList: sectionedStopList,
                stopCount
            });
        } else {
            // Todo: Can improve querying Logic:
            // Todo: use higher weight for BEGINSWITH and lower for CONTAINS
            // Todo: Search on other fields ???
            const queryStr = `name CONTAINS[c] "${query.toString()}"`;
            const stopList = floDB.objects(Place.schema.name).filtered(queryStr);
            const sortedStopList = stopList.sorted('name');
            const sectionedStopList = createSectionedListFromRealmObject(sortedStopList);
            this.setState({stopList: sectionedStopList});
        }
    }

    componentWillUnMount() {
        floDB.addListener('change', this.handleListUpdate);
    }

    handleListUpdate() {
        // Todo: Don't query again
        this.getSectionData(null);
    }

    render() {
        const {selectedStop} = this.props;
        return (
            <StopListScreen
                stopList={this.state.stopList}
                stopCount={this.state.stopCount}
                searchText={this.state.searchText}
                onSearch={this.onSearch}
                selectedStop={selectedStop}
                onPressAddStop={this.onPressAddStop}
            />
        );
    }
}

export default StopListScreenContainer;
