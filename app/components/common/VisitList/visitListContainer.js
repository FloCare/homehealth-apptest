import React, {Component} from 'react';

import {VisitList} from './visitList';
import {floDB} from '../../../utils/data/schema';

class VisitListContainer extends Component {
    constructor(props) {
        super(props);
        this.visitResultObject = this.props.visitResultObject;

        this.state = {flatItems: this.createFlatVisitItems()};

        this.flipDoneField = this.flipDoneField.bind(this);
        this.handleVisitResultObjectChange = this.handleVisitResultObjectChange.bind(this);
    }

    componentDidMount() {
        floDB.addListener('change', this.handleVisitResultObjectChange);
    }

    componentWillUnmount() {
        floDB.removeListener('change', this.handleVisitResultObjectChange);
    }

    flipDoneField(visitID) {
        const modifiedObject = this.visitResultObject.find(visit => visit.visitID === visitID);
        floDB.write(() => { modifiedObject.isDone = !modifiedObject.isDone; });
    }

    handleVisitResultObjectChange() {
        this.setState({flatItems: this.createFlatVisitItems()});
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
        const episode = visit.episode[0]; //this.episodeByID.get(visit.episodeID);
        const patient = episode.patient[0]; //this.patientByID.get(episode.patientID);

        return {
            key: visit.visitID,
            patientName: patient.name,
            address: 'dummy for now',
            isDone: visit.isDone,
            diagnosis: patient.diagnosis
        };
    }

    render() {
        // console.log(`render called at ${Date.now()}`);
        return (
            <VisitList
                visitItems={this.state.flatItems}
                onCheck={this.flipDoneField}
            />
        );
    }
}

export {VisitListContainer};
