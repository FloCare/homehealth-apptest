import React, {Component} from 'react';
import {StopListScreen} from '../components/StopListScreen';
import {floDB, Place} from '../utils/data/schema';
import {createSectionedListFromRealmObject} from '../utils/collectionUtils';
import {screenNames} from '../utils/constants';

class StopListScreenContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
    }

    onSearch(query) {
        this.getSectionData(query);
    }

    onNavigatorEvent(event) {
        if (event.id === 'willAppear') {
            let title = `Saved Places (${this.state.stopCount})`;
            this.props.navigator.setTitle({
                title
            });
        }
    }

    onPressAddStop() {
        this.props.navigator.push({
            screen: screenNames.addStop,
            animated: true,
            animationType: 'fade',
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
                onSearch={this.onSearch}
                selectedStop={selectedStop}
                onPressAddStop={this.onPressAddStop}
            />
        );
    }
}

export default StopListScreenContainer;
