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

    constructor(props) {
        super(props);
        this.orderIndexMovingCache = undefined;
        // this.orderIndexCache = undefined;

        this.state = this.getStateFromDate(props.date);
        // const orderObject = floDB.objectForPrimaryKey(VisitOrder, props.date.valueOf());
        // this.state = {
        //     date: props.date,
        //     renderWithCallback: this.renderRow(),
        //     orderedVisitListObject: orderObject,
        //     orderedVisitList: props.singleEntry?orderObject.visitList.slice(0, 1):orderObject.visitList
        // };
        //
        // if (props.singleEntry) {
        //     console.log(`cut2${orderObject.visitList.slice(0, 1).length}`);
        //     this.setState({orderedVisitList: orderObject.visitList.slice(0, 1)});
        // }
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
            orderedVisitList: this.props.singleEntry ? orderObject.visitList.slice(0, 1) : orderObject.visitList
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.date !== this.state.date) { this.setState(this.getStateFromDate(nextProps.date)); }
    }

    updateNewVisitOrderToDb(order, valid) {
        console.log('update to db');
        // if (valid) {
        //     this.orderIndexCache = this.orderIndexMovingCache;
        // }
        floDB.write(() => {
            this.state.orderedVisitListObject.visitList = order;
        });
        this.setState({orderedVisitList: this.props.singleEntry ? order.slice(0, 1) : order});
    }

    onOrderChange(newOrder) {
        this.orderIndexMovingCache = newOrder;
    }

    onReleaseRow() {
        console.log('release row called');
        if (this.orderIndexMovingCache) {
            let newOrderedVisitList = this.orderIndexMovingCache.map((index) => this.state.orderedVisitList[index]);
            // console.log('new list:')
            // console.log(newOrderedVisitList);
            if (SortedVisitListContainer.performValidityCheck(newOrderedVisitList)) {
                newOrderedVisitList = this.tweakVisitListOrder(newOrderedVisitList);
                console.log('here');
                // this.setState({orderedVisitList: newOrderedVisitList});
                console.log('here');
                floDB.write(() => {
                    this.state.orderedVisitListObject.orderedVisitList = newOrderedVisitList;
                });
                console.log('here');
            } else {
                //ensure rendering of old material
                this.updateNewVisitOrderToDb(Array.from(this.state.orderedVisitList, false));
                console.log('failed validity check');
            }
        }
        this.orderIndexMovingCache = undefined;
        if (this.props.onOrderChange) {
            this.props.onOrderChange();
        }
    }


    tweakVisitListOrder(visitList) {
        if (this.props.isCompletedHidden) {
            for (let i = 0; i < visitList.length; i++) {
                if (visitList[i].isDone) {
                    return visitList.slice(0, i);
                }
            }
        }
        // if (this.props.singleEntry) {
        //     console.log('cut');
        //     return visitList.slice(0, 1);
        // }
        return visitList;
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
        return this.props.renderWithCallback({isDoneToggle: this.isDoneToggle.bind(this)});
    }

    render() {
        console.log('whole container rendered');
        return (
            <SortableList
                data={this.state.orderedVisitList}
                renderRow={this.state.renderWithCallback}
                // order={this.orderIndexCache}
                onChangeOrder={this.onOrderChange}
                onReleaseRow={this.onReleaseRow}
                sortingEnabled={this.props.sortEnabled}
            />
        );
    }
}

export {SortedVisitListContainer};
