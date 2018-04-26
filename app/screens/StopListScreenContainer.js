import React, {Component} from 'react';
import {StopListScreen} from '../components/StopListScreen';
import {floDB, Place} from '../utils/data/schema';

class StopListScreenContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stopList: []
        };
        this.getSectionData = this.getSectionData.bind(this);
        this.createSectionListFromStopListData =
            this.createSectionListFromStopListData.bind(this);
        this.onSearch = this.onSearch.bind(this);
    }

    componentDidMount() {
        this.getSectionData(null);
        // Todo attach query listeners
    }

    onSearch(query) {
        this.getSectionData(query);
    }

    getSectionData(query) {
        if (!query) {
            const stopList = floDB.objects(Place.schema.name);
            const sortedStopList = stopList.sorted('name');
            const sectionedStopList = this.createSectionListFromStopListData(sortedStopList);
            this.setState({stopList: sectionedStopList});
        } else {
            // Todo: Can improve querying Logic:
            // Todo: use higher weight for BEGINSWITH and lower for CONTAINS
            // Todo: Search on other fields ???
            const queryStr = `name CONTAINS[c] "${query.toString()}"`;
            const stopList = floDB.objects(Place.schema.name).filtered(queryStr);
            const sortedStopList = stopList.sorted('name');
            console.log(sortedStopList);
            const sectionedStopList = this.createSectionListFromStopListData(sortedStopList);
            this.setState({stopList: sectionedStopList});
        }
    }

    createSectionListFromStopListData(stopList) {
        const sections = [];
        const sectionTitles = {};
        // Todo: Don't use for..in syntax
        for (const index in stopList) {
            const stop = stopList[index];
            const key = sectionTitles[stop.name[0]];

            if (key !== undefined) {
                sections[key].data.push(stop);
            } else {
                const ind = sections.length;
                sectionTitles[stop.name[0]] = ind;
                sections.push({title: stop.name[0], data: [stop]});
            }
        }
        return sections;
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
