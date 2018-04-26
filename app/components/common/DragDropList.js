import React, {Component} from 'react';
import SortableList from 'react-native-sortable-list';
import {arrayToMap} from '../../utils/collectionUtils';

//props: orderedItemIDList, dataObjectList, dataObjectKey, onChangeOrder, renderRow
class DragDropList extends Component {
    static getDerivedStateFromProps(nextProps) {
        return DragDropList.getStateFromProps(nextProps);
    }

    static getUpdatedDataOrder(currentOrder, dataByKeyMap) {
        const orderedData = [];
        for (const id of currentOrder) {
            orderedData.push(dataByKeyMap.get(id));
        }
        return orderedData;
    }

    static getStateFromProps(props) {
        return {
            currentOrder: props.orderedItemIDList,
            dataByKeyMap: arrayToMap(props.dataObjectList, props.dataObjectKey),
            orderedData: DragDropList.getUpdatedDataOrder(props.orderedItemIDList, arrayToMap(props.dataObjectList, props.dataObjectKey))
        };
    }

    constructor(props) {
        // console.log('constructing ddl');
        super(props);
        //currentOrderCache keeps a local copy of rearranged order as set by onOrderUpdate
        //it is onReleaseRow that we actually want to enforce this reordering, so then we
        //make a callback to the parent informing them of changed order
        this.currentOrderCache = props.orderedItemIDList;

        this.state = DragDropList.getStateFromProps(props);

        this.onOrderUpdated = this.onOrderUpdated.bind(this);
        this.onReleaseRow = this.onReleaseRow.bind(this);
    }

    onOrderUpdated(newOrder) {
        // console.log('newOrder');
        // console.log(newOrder);
        this.currentOrderCache = newOrder;
    }

    onReleaseRow(key) {
        // console.log(key);
        this.props.onChangeOrder(this.currentOrderCache);
    }


    render() {
        return (
            <SortableList
                data={this.state.orderedData}
                renderRow={this.props.renderRow}
                onChangeOrder={this.onOrderUpdated}
                onReleaseRow={this.onReleaseRow}
            />
        );
    }
}

export {DragDropList};
