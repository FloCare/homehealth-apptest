import React from 'react';
import {Component} from 'react';
import {Case, MyRealm, Visit, Patient, CreateAndSaveDummies} from '../utils/data/schema';
import {VisitScreen} from '../components/visitsScreen';

class VisitsScreenContainer extends Component {
    static constructVisitItemFromVisit(visit) {
        //TODO check the results for length and error proof it

        const _case = MyRealm.objects(Case.schema.name).filtered('caseID==$0', visit.caseID)[0];
        const _patient = MyRealm.objects(Patient.schema.name).filtered('patientID==$0', _case.patientID)[0];

        return {
            patientName: _patient.name,
            diagnosis: _case.diagnosis,
            isDone: visit.isDone
        };
    }

    constructor(props) {
        super(props);
        // CreateAndSaveDummies();
        // CreateAndSaveDummies();
        // CreateAndSaveDummies();
        // CreateAndSaveDummies();
        console.log(`visits count ${MyRealm.objects(Visit.schema.name).length}`);
        // this.state = {midnightEpoch: this.props.midnightEpoch};
        this.visits = MyRealm.objects(Visit.schema.name);
                        // .filtered('midnightEpoch == 0');
                        // .filtered('midnightEpoch == $0', this.state.midnightEpoch);
                        // .sort('isDone');
    }

    onCheckboxClick(index) {
        this.visits[index].isDone = !this.visits[index].isDone;
    }

    render() {
        console.log(`here goes: ${this.visits}`);
        this.visits.map(item => console.log(item));
        return (<VisitScreen
            visitItems={this.visits.map(({item}) => VisitsScreenContainer.constructVisitItemFromVisit(item))}
        />);
    }
}

export {VisitsScreenContainer};
