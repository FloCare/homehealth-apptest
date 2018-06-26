import React, {Component} from 'react';
import firebase from 'react-native-firebase';
import {floDB, Patient} from '../../utils/data/schema';
import {AddNoteFormWithPatientTag} from './AddNoteFormWithPatientTag';
import {AddNoteFormWithoutPatientTag} from './AddNoteFormWithoutPatientTag';
import {screenNames, eventNames} from '../../utils/constants';
import {PatientDataService} from "../../data_services/PatientDataService";

class AddNoteFormContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            patientId: props.patientId,
            name: props.name,
            note: null,
            searching: false,
            searchText: null,
            patientList: null
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        this.fetchNotes = this.fetchNotes.bind(this);
        this.onChangeSearchText = this.onChangeSearchText.bind(this);
        this.onItemSelect = this.onItemSelect.bind(this);
        this.setSearchRef = this.setSearchRef.bind(this);
        this.setNoSearching = this.setNoSearching.bind(this);
    }

    componentDidMount() {
        this.fetchNotes();
    }

    onChangeText(note) {
        this.setState({
            note
        });
    }

    onChangeSearchText(query) {
        this.setState({searchText: query});
        if (query && query.toString().length > 0) {
            console.log(query);
            this.setState({searching: true});
            try {
                // Todo: Revisit query logic
                const filteredPatientList = this.patientDataService().getPatientsFilteredByName(query);
                const sortedPatientList = this.patientDataService().getPatientsSortedByName(filteredPatientList);
                this.setState({patientList: sortedPatientList});
            } catch (e) {
                console.log('Error in fetching patients:', e);
            }
        } else {
            console.log('No Patient Name Searched for');
            this.setState({
                patientList: null,
                searching: false
            });
        }
    }

    onItemSelect(patient) {
        try {
            //const queryStr = `patientID = "${patientId}"`;
            //const patients = floDB.objects(Patient.schema.name).filtered(queryStr);
            //const patient = patients[0];
            this.setState({
                patientList: null,
                note: patient.notes,
                patientId: patient.patientID,
                name: patient.name,
                searching: false,
                searchText: null
            });
            // Todo: Can be removed now?
            this.search.clearText();
        } catch (e) {
            console.log('Error in selecting Item:', e);
        }
    }

    setSearchRef(element) {
        this.search = element;
        return this.search;
    }

    setNoSearching() {
        this.setState({searching: false});
    }

    handleSubmit() {
        console.log('Saving the editted note to DB ...');
        // Save/Update note to DB
        floDB.write(() => {
            floDB.create(
                Patient.schema.name,
                {
                    patientID: this.state.patientId,
                    notes: this.state.note
                },
                true
            );
        });
        firebase.analytics().logEvent(eventNames.ADD_NOTE, {
            'length': this.state.note? this.state.note.length : 0
        });
        console.log('Saved ...');

        this.props.onSubmit();
    }

    fetchNotes() {
        if (this.state.patientId) {
            const patientDetails = floDB.objects(Patient.schema.name).filtered('patientID = $0', this.state.patientId);
            const note = patientDetails[0].notes;
            this.setState({
                note
            });
        } else {
            this.setState({
                note: null
            });
        }
    }

    render() {
        // Disable SearchBox if PatientID was passed in the Props
        if (this.props.patientId) {
            return (
                <AddNoteFormWithPatientTag
                    value={this.state.note}
                    name={this.props.name}
                    patientId={this.props.patientId}
                    onChangeText={this.onChangeText}
                    handleSubmit={this.handleSubmit}
                />
            );
        } else {
            return (
                <AddNoteFormWithoutPatientTag
                    searchRef={this.setSearchRef}
                    value={this.state.note}
                    searchText={this.state.searchText}
                    name={this.state.name}
                    patientId={this.state.patientId}
                    patientList={this.state.patientList}
                    onChangeText={this.onChangeText}
                    onChangeSearchText={this.onChangeSearchText}
                    onItemSelect={this.onItemSelect}
                    handleSubmit={this.handleSubmit}
                    searching={this.state.searching}
                    setNoSearching={this.setNoSearching}
                />
            );
        }
    }

    // External Services
    patientDataService = () => {
        return PatientDataService.getInstance();
    };

}

export {AddNoteFormContainer};
