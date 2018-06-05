import React, {Component} from 'react';
import SortableList from 'react-native-sortable-list';
import firebase from 'react-native-firebase';
import PropTypes from 'prop-types';
import {TouchableWithoutFeedback} from 'react-native';

import {floDB, Visit, VisitOrder} from '../../utils/data/schema';
import {screenNames, eventNames, parameterValues} from '../../utils/constants';
import {arrayToObjectByKey} from '../../utils/collectionUtils';
import {visitDataService} from '../../data_services/VisitDataService';

//props: date, onOrderChange, isCompletedHidden, renderWithCallback, sortEnabled, singleEntry
class SortedVisitListContainer extends Component {

    static propTypes = {
        orderedVisitID: PropTypes.arrayOf(PropTypes.string).isRequired,
        renderFunctionGenerator: PropTypes.func.isRequired,
    };

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

        // this.state = this.getStateFromDate(props.date);

        this.onOrderChange = this.onOrderChange.bind(this);
        this.onReleaseRow = this.onReleaseRow.bind(this);
        this.renderRow = this.getAugmentedRenderFunction(this.props.renderFunctionGenerator);

        this.onDoneTogglePress = this.onDoneTogglePress.bind(this);
    }
    //
    // getStateFromDate(date) {
    //     // const orderObject = floDB.objectForPrimaryKey(VisitOrder, date.valueOf());
    //     return ({
    //         date,
    //         renderWithCallback: this.getAugmentedRenderFunction(),
    //         // orderedVisitListObject: orderObject,
    //         // orderedVisitList: this.tweakVisitListOrder(orderObject.visitList)
    //         // this.props.singleEntry ? orderObject.visitList.slice(0, 1) : orderObject.visitList
    //     });
    // }

    componentWillReceiveProps(nextProps) {
        //TODO avoid this many rerenders

        this.orderedVisitID = nextProps.orderedVisitID.reduce((accumulator, currentID) => { accumulator[currentID] = currentID; return accumulator; }, {});

        console.log('SortedVisitListHasReceivedProps');
        console.log(nextProps.orderedVisitID);
        // const nextState = this.getStateFromDate(nextProps.date);
        // this.setState(nextState);
        this.forceUpdate();
    }

    // appendCompletedVisits(order) {
    //     //TODO instead of finding and appending missing visits, try to just rearrange ones we're dealing with after filtering
    //     const visitByID = arrayToMap(order, 'visitID');
    //     for (const visit of this.state.orderedVisitListObject.visitList) {
    //         if (!visitByID.has(visit.visitID)) { order.push(visit); }
    //     }
    // }

    // updateNewVisitOrderToDb(order, valid) {
    //     console.log('new visit order updated to DB');
    //     // if (valid) {
    //     //     this.orderIndexCache = this.orderIndexMovingCache;
    //     // }
    //
    //     this.appendCompletedVisits(order);
    //     floDB.write(() => {
    //         this.state.orderedVisitListObject.visitList = order;
    //     });
    //     this.setState({orderedVisitList: this.tweakVisitListOrder(order)});//this.props.singleEntry ? order.slice(0, 1) : order});
    //
    //     if (this.props.onOrderChange) {
    //         this.props.onOrderChange(order);
    //     }
    //     this.forceUpdate();
    // }

    onOrderChange(newOrder) {
        this.orderIndexMovingCache = newOrder;
    }

    onReleaseRow() {
        console.log('release row called');
        if (this.orderIndexMovingCache) {
            // const visitByKey = arrayToObjectByKey(this.state.orderedVisitListObject.visitList, 'visitID');
            // const newOrderedVisitList = this.orderIndexMovingCache.map((key) => visitByKey[key]);
            // this.updateNewVisitOrderToDb(newOrderedVisitList, true);

            // if (SortedVisitListContainer.performValidityCheck(newOrderedVisitList)) {
            //     this.updateNewVisitOrderToDb(newOrderedVisitList, true);
            // } else {
            //     //TODO ensure rendering of old material, not working right now
            //     this.updateNewVisitOrderToDb(Array.from(this.state.orderedVisitList), false);
            //     console.log('failed validity check');
            // }

            if (this.props.onOrderChange) { this.props.onOrderChange(this.orderIndexMovingCache.map(index => this.props.orderedVisitID[index])); }
        }
        this.orderIndexMovingCache = undefined;
    }

    tweakVisitListOrder(visitList) {
        //TODO make this process cleaner
        let tweakedVisitList = [];
        if (this.props.hideIncompleteAddress) {
            for (let i = 0; i < visitList.length; i++) {
                if (visitList[i].getAddress().coordinates) {
                    //TODO review this
                    tweakedVisitList.push(visitList[i]);
                }
            }
        } else tweakedVisitList.push(...visitList);
        //TODO delicate logic here, make it more robust
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


    getAugmentedRenderFunction(renderFunctionGenerator) {
        const renderFunctionWithCallbacks = renderFunctionGenerator({
            onDoneTogglePress: this.onDoneTogglePress.bind(this),
        });
        //TODO hackey
        // if (this.props.singleEntry) {
        //     return ((props) => <TouchableWithoutFeedback onPress={this.onPressRowSingleton.bind(this)}>
        //                 {renderFunctionWithCallbacks(props)}
        //             </TouchableWithoutFeedback>
        //     );
        // }
        return renderFunctionWithCallbacks;
    }


    onDoneTogglePress(visitID) {
        firebase.analytics().logEvent(eventNames.VISIT_ACTIONS, {
            type: parameterValues.TOGGLE
        });
        console.log(`${visitID} was changed`);
        visitDataService.toggleVisitDone(visitID);
    }

    onPressRowSingleton() {
        const visit = floDB.objectForPrimaryKey(VisitOrder, this.props.date.valueOf()).visitList[0];
        this.onPressRow(visit.visitID);
    }

    onPressRow(visitID) {
        firebase.analytics().logEvent(eventNames.PATIENT_ACTIONS, {
            type: parameterValues.DETAILS
        });
        if (this.props.tapForDetails) {
            const visit = floDB.objectForPrimaryKey(Visit, visitID);
            if (visit.getPatient() && !visit.getPatient().archived) {
                this.props.navigator.push({
                    screen: screenNames.patientDetails,
                    passProps: {
                        patientId: visit.getPatient().patientID
                    },
                    navigatorStyle: {
                        tabBarHidden: true
                    }
                });
            }
        }
    }

    render() {
        return (
            <SortableList
                style={this.props.style}
                data={this.props.orderedVisitID}
                onPressRow={this.onPressRow.bind(this)}
                renderRow={this.renderRow}
                scrollEnabled={this.props.scrollEnabled}
                sortingEnabled={this.props.sortingEnabled}
                onChangeOrder={this.onOrderChange}
                onReleaseRow={this.onReleaseRow}
            />
        );
    }
}

export {SortedVisitListContainer};
