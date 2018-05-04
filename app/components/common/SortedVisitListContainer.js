import React, {Component} from 'react';
import SortableList from 'react-native-sortable-list';
import {floDB, Visit, VisitOrder} from '../../utils/data/schema';

//props: date, onOrderChange, isCompletedHidden, renderWithCallback, sortEnabled, singleEntry
class SortedVisitListContainer extends Component {
    static performValidityCheck(orderedVisitList) {
        let doneFlag;
        for (const visit of orderedVisitList) {
            if (!visit.isDone) {
                if (doneFlag === undefined) {
                    doneFlag = false;
                } else if (doneFlag === true) {
                    return false;
                }
            } else doneFlag = true;
        }
        return true;
    }

    // refreshList() {
    //     console.log('refreshing');
    //     this.setState({orderedVisitList: this.state.orderedVisitIDListObject.visitList});
    //     console.log('refreshing');
    // }
    //
    // componentDidMount() {
    //     console.log('mountign');
    //     floDB.addListener('change', this.refreshList);
    // }
    //
    // componentWillUnmount() {
    //     console.log('unomunting');
    //
    //     floDB.removeListener('change', this.refreshList);
    // }

    constructor(props) {
        super(props);
        this.orderIndexMovingCache = undefined;
        // this.orderIndexCache = undefined;

        this.state = this.getStateFromDate(props.date);

        this.onOrderChange = this.onOrderChange.bind(this);
        this.onReleaseRow = this.onReleaseRow.bind(this);
        this.renderRow = this.renderRow.bind(this);
        this.isDoneToggle = this.isDoneToggle.bind(this);
        this.markVisitDone = this.markVisitDone.bind(this);
        this.markVisitUndone = this.markVisitUndone.bind(this);
    }

    getStateFromDate(date) {
        const orderObject = floDB.objectForPrimaryKey(VisitOrder, date.valueOf());
        return ({
            date,
            renderWithCallback: this.renderRow(),
            orderedVisitListObject: orderObject,
            orderedVisitList: this.tweakVisitListOrder(orderObject.visitList)
            // this.props.singleEntry ? orderObject.visitList.slice(0, 1) : orderObject.visitList
        });
    }

    componentWillReceiveProps(nextProps) {
        //TODO avoid this many rerenders
        // console.log('component received props bruv');
        const nextState = this.getStateFromDate(nextProps.date);
        // const currenctOrderedVisitList = this.state.orderedVisitList;
        // console.log(`${nextState.orderedVisitList.length},${currenctOrderedVisitList.length}`);
        // if (nextState.orderedVisitList.length !== currenctOrderedVisitList.length) {
        //     console.log('length changed');
            this.setState(nextState);
            this.forceUpdate();
        //     return;
        // }
        //
        // for (let i = 0; i < currenctOrderedVisitList.length; i++) {
        //     if (currenctOrderedVisitList[i].visitID !== nextState.orderedVisitList[i].visitID
        //             || currenctOrderedVisitList[i].isDone !== nextState.orderedVisitList[i].isDone) {
        //         console.log('order different');
        //         this.setState(nextState);
        //         this.forceUpdate();
        //         return;
        //     }
        // }
    }

    shouldComponentUpdate() {
        // return false;
    }

    updateNewVisitOrderToDb(order, valid) {
        console.log('update to db');
        // if (valid) {
        //     this.orderIndexCache = this.orderIndexMovingCache;
        // }
        floDB.write(() => {
            this.state.orderedVisitListObject.visitList = order;
        });
        this.setState({orderedVisitList: this.tweakVisitListOrder(order)});//this.props.singleEntry ? order.slice(0, 1) : order});

        if (this.props.onOrderChange) {
            this.props.onOrderChange(order);
        }
        this.forceUpdate();
    }

    onOrderChange(newOrder) {
        this.orderIndexMovingCache = newOrder;
    }

    onReleaseRow() {
        console.log('release row called');
        if (this.orderIndexMovingCache) {
            const newOrderedVisitList = this.orderIndexMovingCache.map((index) => this.state.orderedVisitList[index]);
            // console.log('new list:')
            // console.log(newOrderedVisitList);
            if (SortedVisitListContainer.performValidityCheck(newOrderedVisitList)) {
                this.updateNewVisitOrderToDb(newOrderedVisitList, true);
            } else {
                //TODO ensure rendering of old material, not working right now
                this.updateNewVisitOrderToDb(Array.from(this.state.orderedVisitList), false);
                console.log('failed validity check');
            }
        }
        this.orderIndexMovingCache = undefined;
    }


    tweakVisitListOrder(visitList) {
        //TODO make this process cleaner
        let tweakedVisitList = [];
        console.log('tweaks');
        if (this.props.hideIncompleteAddress) {
            for (let i = 0; i < visitList.length; i++) {
                if (visitList[i].getAddress().coordinates) {
                    //TODO review this
                    tweakedVisitList.push(visitList[i]);
                    break;
                }
            }
        } else tweakedVisitList.push(...visitList);
        if (this.props.isCompletedHidden) {
            console.log('here');
            for (let i = 0; i < tweakedVisitList.length; i++) {
                if (tweakedVisitList[i].isDone) {
                    tweakedVisitList = tweakedVisitList.slice(0, i);
                    break;
                }
            }
        }
        tweakedVisitList = this.props.singleEntry ? tweakedVisitList.slice(0, 1) : tweakedVisitList;

        // if (this.props.onOrderChange) {
        //     this.props.onOrderChange(tweakedVisitList);
        // }

        return tweakedVisitList;
    }

    markVisitDone(visit) {
        console.log(`${visit.visitID} was changed`);
        const newOrderedVisitList = [];
        const currenctOrderedList = this.state.orderedVisitListObject.visitList;

        for (let i = 0; i < currenctOrderedList.length; i++) {
            if (visit.visitID === currenctOrderedList[i].visitID) {
                newOrderedVisitList.push(...currenctOrderedList.slice(0, i));
                if (currenctOrderedList.length !== i + 1) {
                    newOrderedVisitList.push(...currenctOrderedList.slice(i + 1, currenctOrderedList.length));
                }
                newOrderedVisitList.push(currenctOrderedList[i]);
            }
        }
        floDB.write(() => {
            visit.isDone = true;
        });
        this.updateNewVisitOrderToDb(newOrderedVisitList, true);
    }

    markVisitUndone(visit) {
        console.log(`${visit.visitID} was changed`);
        const newOrderedVisitList = [];
        const currenctOrderedList = this.state.orderedVisitList;

        let i;
        for (i = 0; i < currenctOrderedList.length; i++) {
            if (visit.isDone) {
                newOrderedVisitList.push(...currenctOrderedList.slice(0, i));
                newOrderedVisitList.push(visit);
                break;
            }
        }

        if (currenctOrderedList.length !== i + 1) {
            for (let j = i; j < currenctOrderedList.length; j++) {
                if (visit.visitID === currenctOrderedList[j].visitID) {
                    newOrderedVisitList.push(...currenctOrderedList.slice(i, j));
                    if (currenctOrderedList.length !== j + 1) {
                        newOrderedVisitList.push(...currenctOrderedList.slice(j + 1, currenctOrderedList.length));
                    }
                }
            }
        }
        floDB.write(() => {
            visit.isDone = false;
        });
        this.updateNewVisitOrderToDb(newOrderedVisitList, true);
    }

    isDoneToggle(visit) {
        console.log(`${visit.visitID} was changed`);
        // console.log(this);
        // console.log(this.state);
        if (!visit.isDone) {
            this.markVisitDone(visit);
        } else {
            this.markVisitUndone(visit);
        }
    }

    renderRow() {
        return this.props.renderWithCallback({isDoneToggle: this.isDoneToggle.bind(this), navigator: this.props.navigator});
    }

    render() {
        console.log(`sortedVisitList container rendered, length ${this.state.orderedVisitList.length}`);
        return (
            <SortableList
                style={this.props.style}
                data={this.state.orderedVisitList}
                renderRow={this.state.renderWithCallback}
                scrollEnabled={this.props.scrollEnabled}
                sortingEnabled={this.props.sortingEnabled}
                onChangeOrder={this.onOrderChange}
                onReleaseRow={this.onReleaseRow}
            />
        );
    }
}

export {SortedVisitListContainer};
