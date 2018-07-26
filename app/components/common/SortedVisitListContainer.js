import React, {Component} from 'react';
import SortableList from 'react-native-sortable-list';
import firebase from 'react-native-firebase';
import PropTypes from 'prop-types';
import {TouchableHighlight, Text} from 'react-native';
import moment from 'moment/moment';
import {floDB, Visit, VisitOrder} from '../../utils/data/schema';
import {screenNames, eventNames, parameterValues} from '../../utils/constants';
import {VisitService} from '../../data_services/VisitServices/VisitService';

//props: date, onOrderChange, isCompletedHidden, renderWithCallback, sortEnabled, singleEntry
class SortedVisitListContainer extends Component {

    static propTypes = {
        orderedVisitID: PropTypes.arrayOf(PropTypes.string).isRequired,
        renderFunctionGenerator: PropTypes.func.isRequired,
    };

    // static performValidityCheck(orderedVisitList) {
    //     let doneFlag;
    //     for (const visit of orderedVisitList) {
    //         if (!visit.isDone) {
    //             if (doneFlag === undefined) {
    //                 doneFlag = false;
    //             } else if (doneFlag === true) {
    //                 return false;
    //             }
    //         } else doneFlag = true;
    //     }
    //     return true;
    // }

    constructor(props) {
        super(props);
        this.orderIndexMovingCache = undefined;
        // this.orderIndexCache = undefined;

        this.state = {
            visitData: this.plainVisitIDArrayToMap(props.orderedVisitID),
            order: props.orderedVisitID
        };

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

    plainVisitIDArrayToMap(visitList) {
        return visitList.reduce((accumulator, currentID) => { accumulator[currentID] = currentID; return accumulator; }, {});
    }

    componentWillReceiveProps(nextProps) {
        console.log('SortedVisitListHasReceivedProps');
        this.setState({visitData: this.plainVisitIDArrayToMap(nextProps.orderedVisitID), order: nextProps.orderedVisitID});
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

            if (this.props.onOrderChange) { this.props.onOrderChange(this.orderIndexMovingCache); }
        }
        this.orderIndexMovingCache = undefined;
    }

    getAugmentedRenderFunction(renderFunctionGenerator) {
        const RenderFunctionWithCallbacks = renderFunctionGenerator({
            onDoneTogglePress: this.onDoneTogglePress.bind(this),
            navigator: this.props.navigator
        });
        //TODO hackey
        if (this.props.singleEntry) {
            return ((props) => <RenderFunctionWithCallbacks {...props} />
            );
        }
        return RenderFunctionWithCallbacks;
    }


    onDoneTogglePress(visitID) {
        console.log(`${visitID} was changed`);
        VisitService.getInstance().toggleVisitDone(visitID);
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
                        patientId: visit.getPatient().patientID,
                        selectedVisitsDate: moment(visit.midnightEpochOfVisit)
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
                data={this.state.visitData}
                order={this.state.order}
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
