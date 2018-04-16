import React, {Component} from 'react';
import {Case, MyRealm, Visit, Patient, CreateAndSaveDummies} from '../utils/data/schema';
import {VisitScreen} from '../components/visitsScreen';
//TODO understand this
import * as Realm from 'realm';
import update from 'immutability-helper';

class VisitsScreenContainer extends Component {
    static constructVisitItemFromVisit(visit) {
        //TODO check the results for length and error proof it

        console.log(`received visit is: ${visit}`);
        const _case = MyRealm.objects(Case.schema.name).filtered('caseID==$0', visit.caseID)[0];
        const _patient = MyRealm.objects(Patient.schema.name).filtered('patientID==$0', _case.patientID)[0];

        console.log(`${_case}, ${_case.length}`);
        console.log(`${_patient}, ${_patient.length}`);
        return {
            patientName: _patient.name,
            diagnosis: _case.diagnosis,
            isDone: visit.isDone
        };
    }

    constructor(props) {
        super(props);
        CreateAndSaveDummies();
        CreateAndSaveDummies();
        CreateAndSaveDummies();
        CreateAndSaveDummies();
        console.log(`visits count ${MyRealm.objects(Visit.schema.name).length}`);
        // this.state = {midnightEpoch: this.props.midnightEpoch};
        this.onCheckboxClick = this.onCheckboxClick.bind(this);
        // .sort('isDone');
        // .filtered('midnightEpoch == 0');
        // .filtered('midnightEpoch == $0', this.state.midnightEpoch);
        this.visits = MyRealm.objects(Visit.schema.name);
        this.state = {visitItems: this.visits.map(visit => VisitsScreenContainer.constructVisitItemFromVisit(visit))};
    }

    onCheckboxClick(index) {
        MyRealm.write(() => {
            this.visits[index].isDone = !this.visits[index].isDone;
        });

        // const modifiedVisitItem = Object.assign({}, this.state.visitItems[index], {isDone: !this.state.visitItems[index].isDone});
        // console.log("1: "+this.state.visitItems[index] + modifiedVisitItem)
        // const modifiedVisitItems = Object.assign([], this.state.visitItems, {index: modifiedVisitItem});
        this.setState((prevState) => {
            const visitItemsCopy = prevState.visitItems.slice();
            visitItemsCopy[index].isDone = !visitItemsCopy[index].isDone;
            return {visitItems: visitItemsCopy};
        });
    }

    render() {
        // console.log(`here goes: ${this.state.visits}`);
        // this.visits.map(item => console.log(item));
        return (<VisitScreen
            onCheck={this.onCheckboxClick}
            visitItems={this.state.visitItems}
                // .map(item => {
                // const temp = VisitsScreenContainer.constructVisitItemFromVisit(item);
                // console.log(temp);
                // return temp;
            // })}
        />);
    }
}

export {VisitsScreenContainer};
