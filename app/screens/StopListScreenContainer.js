import React, {Component} from 'react';
import {StopListScreen} from '../components/StopListScreen';
import {floDB, Place} from '../utils/data/schema';
import {createSectionedListFromRealmObject} from '../utils/collectionUtils';

class StopListScreenContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stopList: []
        };
        this.getSectionData = this.getSectionData.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.handleListUpdate = this.handleListUpdate.bind(this);
    }

    componentDidMount() {
        this.getSectionData(null);
        floDB.addListener('change', this.handleListUpdate);
    }

    onSearch(query) {
        this.getSectionData(query);
    }

    getSectionData(query) {
        if (!query) {
            const stopList = floDB.objects(Place.schema.name);
            const sortedStopList = stopList.sorted('name');
            const sectionedStopList = createSectionedListFromRealmObject(sortedStopList);
            this.setState({stopList: sectionedStopList});
        } else {
            // Todo: Can improve querying Logic:
            // Todo: use higher weight for BEGINSWITH and lower for CONTAINS
            // Todo: Search on other fields ???
            const queryStr = `name CONTAINS[c] "${query.toString()}"`;
            const stopList = floDB.objects(Place.schema.name).filtered(queryStr);
            const sortedStopList = stopList.sorted('name');
            console.log(sortedStopList);
            const sectionedStopList = createSectionedListFromRealmObject(sortedStopList);
            this.setState({stopList: sectionedStopList});
        }
    }

    componentWillUnMount() {
        floDB.addListener('change', this.handleListUpdate);
    }

    handleListUpdate() {
        this.getSectionData(null);
    }

    render() {
        const {selectedStop} = this.props;
        return (
            <StopListScreen
                stopList={this.state.stopList}
                onSearch={this.onSearch}
                selectedStop={selectedStop}
            />
        );
    }
}

export default StopListScreenContainer;
