import React, {Component} from 'react';

import {VisitList} from './visitList';
import {MyRealm, Case, Patient} from '../../../utils/data/schema';
import * as Utils from '../../../utils/collectionUtils';

class VisitListContainer extends Component {
    constructor(props) {
        super(props);
        this.visitResultObject = this.props.visitResultObject;

        this.handleVisitResultObjectChange = this.handleVisitResultObjectChange.bind(this);
        this.flipDoneField = this.flipDoneField.bind(this);
        this.refreshDataMaps = this.refreshDataMaps.bind(this);

        this.refreshDataMaps();
    }

    componentDidMount() {
        MyRealm.addListener('change', this.handleVisitResultObjectChange);
    }

    componentWillUnmount() {
        MyRealm.removeListener('change', this.handleVisitResultObjectChange);
    }

    refreshDataMaps() {
        this.visitByID = Utils.ArrayToMap(this.visitResultObject, 'visitID');

        const caseResultObject = Utils.filterResultObjectByListMembership(
            MyRealm.objects(Case.schema.name), 'caseID', this.visitResultObject.map((visit) => visit.caseID));
        this.caseByID = Utils.ArrayToMap(caseResultObject, 'caseID');
        //TODO
        // this.caseByID = new Map([...Utils.ArrayToMap(caseResultObject, 'caseID'), ...this.caseByID]);

        const patientResultObject = Utils.filterResultObjectByListMembership(
            MyRealm.objects(Patient.schema.name), 'patientID', caseResultObject.map(case_ => case_.patientID));
        this.patientByID = Utils.ArrayToMap(patientResultObject, 'patientID');
    }

    flipDoneField(visitID) {
        MyRealm.write(() => { this.visitByID.get(visitID).isDone = !this.visitByID.get(visitID).isDone; });
    }

    handleVisitResultObjectChange() {
        this.refreshDataMaps();
        this.forceUpdate();
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
            key: visit.visitID,
            patientName: patient.name,
            address: 'dummy for now',
            isDone: visit.isDone,
            diagnosis: case_.diagnosis
        };
    }

    render() {
        console.log(`render called at ${Date.now()}`);
        return (
            <VisitList
                visitItems={this.createFlatVisitItems()}
                onCheck={this.flipDoneField}
            />
        );
    }
}

export {VisitListContainer};
