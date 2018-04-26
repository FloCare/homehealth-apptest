import React, {Component} from 'react';

import {VisitList} from './visitList';
import {floDB, Visit} from '../../../utils/data/schema';

class VisitListContainer extends Component {
    constructor(props) {
        console.log('constructor called');
        super(props);
        //TODO fix this, shouldnt be needed
        this.visitResultObject = this.props.visitResultObject;

        this.state = {flatItems: this.createFlatVisitItems(this.props.visitResultObject)};

        this.flipDoneField = this.flipDoneField.bind(this);
        this.handleVisitResultObjectChange = this.handleVisitResultObjectChange.bind(this);
    }

    componentDidMount() {
        floDB.addListener('change', this.handleVisitResultObjectChange);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({flatItems: this.createFlatVisitItems(nextProps.visitResultObject)});
    }

    componentWillUnmount() {
        floDB.removeListener('change', this.handleVisitResultObjectChange);
    }

    flipDoneField(visitID) {
        const modifiedObject = this.visitResultObject.find(visit => visit.visitID === visitID);
        floDB.write(() => { modifiedObject.isDone = !modifiedObject.isDone; });
    }

    handleVisitResultObjectChange() {
        this.setState({flatItems: this.createFlatVisitItems(this.props.visitResultObject)});
    }

    createFlatVisitItems(visitResultObject) {
        if (this.props.onlyDisplayOne) {
            return [this.createFlatVisitItem(visitResultObject[0])];
        }
        return visitResultObject.map(
            (visit) => this.createFlatVisitItem(visit)
        );
    }

    createFlatVisitItem(visit) {
        const episode = visit.getEpisode();//episode[0]; //this.episodeByID.get(visit.episodeID);
        const patient = episode.getPatient(); //this.patientByID.get(episode.patientID);

        return {
            key: visit.visitID,
            patientName: patient.name,
            address: 'dummy for now',
            isDone: visit.isDone,
            diagnosis: patient.diagnosis
        };
    }

    render() {
        console.log(`render called at ${Date.now()}, ${this.state.flatItems.length}`);
        return (
            <VisitList
                visitItems={this.state.flatItems}
                onCheck={this.flipDoneField}
            />
        );
    }
}

export {VisitListContainer};
