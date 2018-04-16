import React, {Component} from 'react';

import {VisitList} from '../visitList';
import {MyRealm, Case, Patient, Visit, CreateAndSaveDummies} from '../../utils/data/schema';
import * as Utils from '../../utils/collectionUtils';


//TODO there exisits inefficiencies surrounding the re-rendering of all he objects when some state changes, work on it
//TODO one rerender coming from onClick and one from realm object change
class VisitListContainer extends Component {
    constructor(props) {
        super(props);
        this.visitResultObject = this.props.visitResultObject;
        // this.visitResultObject = MyRealm.objects(Visit.schema.name);//.sorted('isDone');

        this.handleVisitResultObjectChange = this.handleVisitResultObjectChange.bind(this);
        this.flipDoneField = this.flipDoneField.bind(this);
        this.setEpisodeAndPatientMap = this.setEpisodeAndPatientMap.bind(this);
    }

    componentWillMount() {
        this.visitResultObject.addListener(this.handleVisitResultObjectChange);

        this.visitsByID = Utils.ArrayToMap(this.visitResultObject, 'visitID');

        console.log(`keys: ${this.visitsByID.keys()}`);
        console.log(`print this: ${this.visitResultObject.map((visit) => visit.caseID)}`);

        this.setEpisodeAndPatientMap();
    }

    componentWillUnmount() {
        this.visitResultObject.removeListener(this.handleVisitResultObjectChange);
    }

    setEpisodeAndPatientMap() {
        const caseResultObject = Utils.filterResultObjectByListMembership(
            MyRealm.objects(Case.schema.name), 'caseID', this.visitResultObject.map((visit) => visit.caseID));
        this.caseByID = Utils.ArrayToMap(caseResultObject, 'caseID');

        const patientResultObject = Utils.filterResultObjectByListMembership(
            MyRealm.objects(Patient.schema.name), 'patientID', caseResultObject.map((case_) => case_.patientID));
        this.patientByID = Utils.ArrayToMap(patientResultObject, 'patientID');
    }

    flipDoneField(index) {
        console.log(`flipping ${index}`);
        MyRealm.write(() => { this.visitResultObject[index].isDone = !this.visitResultObject[index].isDone; });
        this.forceUpdate();
    }

    handleVisitResultObjectChange(collection, changes) {
        if (changes.insertions.length > 0) {
            console.log(`insertion indices: ${changes.insertions}`);
            this.setEpisodeAndPatientMap();
            this.forceUpdate();
        }

        if (changes.modifications.length > 0) {
            console.log(`modification indices: ${changes.modifications}`);
        }

        if (changes.deletions.length > 0) {
            console.log(`deletion indices: ${changes.deletions}`);
        }
    }

    createFlatVisitItems() {
        if (this.props.onlyDisplayOne) {
            return [this.createFlatVisitItem(this.visitResultObject[0])];
        }
        return this.visitResultObject.map(
            (visit) => this.createFlatVisitItem(visit)
        );
    }

    createFlatVisitItem(visit) {
        const case_ = this.caseByID.get(visit.caseID);
        const patient = this.patientByID.get(case_.patientID);

        return {
            patientName: patient.name,
            address: 'dummy for now',
            isDone: visit.isDone,
            diagnosis: case_.diagnosis
        };
    }

    render() {
        console.log(`render called at ${Date.now()}`);
        console.log(`length ${this.visitResultObject.length}`);
        return (
            <VisitList
                visitItems={
                    this.createFlatVisitItems()
                }
                onCheck={this.flipDoneField}
            />
        );
    }
}

export {VisitListContainer};
