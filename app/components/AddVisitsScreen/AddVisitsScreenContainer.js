import React, {Component} from 'react';
import {Map} from 'immutable';
import {AddVisitsScreen} from './AddVisitsScreen';
import {Address, MyRealm, Patient, Place} from '../../utils/data/schema';
import {ArrayToMap} from '../../utils/collectionUtils';

class AddVisitsScreenContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedItems: Map()
        };
        this.placeResultObject = MyRealm.objects(Place.schema.name);
        this.patientsResultObject = MyRealm.objects(Patient.schema.name);
        this.addressByID = ArrayToMap(MyRealm.objects(Address.schema.name), 'addressID');

        this.onChangeText = this.onChangeText.bind(this);
        this.onItemToggle = this.onItemToggle.bind(this);
        this.onTagPress = this.onTagPress.bind(this);
    }

    onChangeText(text) {
        this.placeResultObject = MyRealm.objects(Place.schema.name).filtered('name CONTAINS[c] $0', text).sorted('name');
        this.patientsResultObject = MyRealm.objects(Patient.schema.name).filtered('name CONTAINS[c] $0', text).sorted('name');

        this.setState({filterText: text});
    }

    getFlatListWithAllItems() {
        const placeIterator = this.placeResultObject.values();
        const patientIterator = this.patientsResultObject.values();

        const allItems = [];
        let nextPlace = placeIterator.next();
        let nextPatient = patientIterator.next();
        do {
            if (nextPlace.done === true && nextPatient.done === true) {
                break;
            } else if (nextPlace.done === true) {
                // console.log(`->${this.getFlatPatientItem(nextPatient.value)}`);
                allItems.push(this.getFlatPatientItem(nextPatient.value));
                nextPatient = patientIterator.next();
            } else if (nextPatient.done === true) {
                allItems.push(this.getFlatPlaceItem(nextPlace.value));
                nextPlace = placeIterator.next();
            } else if (nextPatient.value.name.toLowerCase().localeCompare(nextPlace.value.name.toLowerCase()) < 0) {
                    allItems.push(this.getFlatPatientItem(nextPatient.value));
                    nextPatient = patientIterator.next();
                } else {
                    allItems.push(this.getFlatPlaceItem(nextPlace.value));
                    nextPlace = placeIterator.next();
                }
        } while (!(nextPlace.done && nextPatient.done));
        return allItems;
    }

    getFlatPatientItem(patient) {
        const key = `patient_${patient.patientID}`;
        return {
            key,
            type: 'patient',
            id: patient.patientID,
            name: patient.name,
            address: this.addressByID.get(patient.addressID),
            isSelected: this.state.selectedItems.has(key)
        };
    }


    getFlatPlaceItem(place) {
        const key = `place_${place.placeID}`;
        return {
            key,
            type: 'place',
            id: place.placeID,
            name: place.name,
            address: this.addressByID.get(place.addressID),
            isSelected: this.state.selectedItems.has(key)
        };
    }

    onTagPress(item) {
        this.onItemToggle(item);
    }

    onItemToggle(item) {
        console.log('touchregistered');
        this.setState(
            (prevState) => {
                if (prevState.selectedItems.has(item.key)) {
                    console.log(`adding one${item.key}`);
                   return {selectedItems: prevState.selectedItems.delete(item.key)};
                }
                console.log('removing one');
                return {selectedItems: prevState.selectedItems.set(item.key, item)};
            }
        );
    }

    render() {
        return (
            <AddVisitsScreen
                onChangeText={this.onChangeText}
                onTagPress={this.onTagPress}
                onItemToggle={this.onItemToggle}
                selectedItems={Array.from(this.state.selectedItems.values())}
                listItems={this.getFlatListWithAllItems()}
                // listItems={[{type: 'patient', name: 'name', id: '12343', address: 'here, there, everywhere'}]}
            />
        );
    }
}

export {AddVisitsScreenContainer};
