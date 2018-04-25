import React, {Component} from 'react';
import {Map} from 'immutable';
import {AddVisitsScreen} from './AddVisitsScreen';
import {ListItem} from 'react-native-elements';
import {Address, floDB, Patient, Place, Visit} from '../../utils/data/schema';
import {ArrayToMap} from '../../utils/collectionUtils';
import {visitType} from '../../utils/constants';
import {generateUUID} from '../../utils/utils';

class AddVisitsScreenContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: props.date,
            selectedItems: Map()
        };
        this.placeResultObject = floDB.objects(Place.schema.name);
        this.patientsResultObject = floDB.objects(Patient.schema.name);

        this.onChangeText = this.onChangeText.bind(this);
        this.onItemToggle = this.onItemToggle.bind(this);
        this.createListItemComponent = this.createListItemComponent.bind(this);
        this.onDone = this.onDone.bind(this);
        this.onTagPress = this.onTagPress.bind(this);
    }

    onChangeText(text) {
        this.placeResultObject = floDB.objects(Place.schema.name).filtered('name CONTAINS[c] $0', text).sorted('name');
        this.patientsResultObject = floDB.objects(Patient.schema.name).filtered('name CONTAINS[c] $0', text).sorted('name');

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

    getFlatAddress(addressObject) {
        //TODO create address from object
        return 'Placeholder Address, PlaceHoldington Street';
    }

    getFlatPatientItem(patient) {
        const key = `patient_${patient.patientID}`;
        return {
            key,
            type: visitType.patient,
            id: patient.patientID,
            name: patient.name,
            address: this.getFlatAddress(patient.address),
            isSelected: this.state.selectedItems.has(key)
        };
    }


    getFlatPlaceItem(place) {
        const key = `place_${place.placeID}`;
        return {
            key,
            type: visitType.place,
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

    createListItemComponent({item}) {
        const avatar = item.type === 'patient' ? require('../../../resources/ic_fiber_pin_2x.png') : require('../../../resources/ic_location_on_black_24dp.png');
        const rightIcon = item.isSelected ? {name: 'check'} : {name: 'ac-unit'};
        console.log(item);
        console.log([item.type + item.id, item.name, item.address, avatar, rightIcon].join(', '));
        return (
            <ListItem
                key={item.key}
                title={item.name}
                subtitle={item.address}
                avatar={avatar}
                rightIcon={rightIcon}
                onPressRightIcon={() => this.onItemToggle(item)}
            />
        );
    }

    onDone() {
        //TODO improve efficiency by not having to query for patient object
        floDB.write(() => {
            for (const selectedItem of this.state.selectedItems.values()) {
                if (selectedItem.type === visitType.patient) {
                    //TODO what happens when patients have multiple cases
                    const patient = floDB.objectForPrimaryKey(Patient, selectedItem.id);
                    //TODO add correct date and to correct episode
                    patient.episodes[0].visits.push({visitID: generateUUID(), midnightEpochOfVisit: 0});
                } else if (selectedItem.type === visitType.place) {
                    const place = floDB.objectForPrimaryKey(Place, selectedItem.id);
                    //TODO insert visit correctly
                    // place.visits.push({visitID: generateUUID(), midnightEpochOfVisit: 0});
                }
            }
        });
        if (this.props.onDone) {
            this.props.onDone(this.state.selectedItems);
        }
        this.props.navigator.pop();
    }

    render() {
        return (
            <AddVisitsScreen
                onChangeText={this.onChangeText}
                onTagPress={this.onTagPress}
                // onItemToggle={this.onItemToggle}
                selectedItems={Array.from(this.state.selectedItems.values())}
                //TODO is this costing us in terms of efficiency
                listItems={this.getFlatListWithAllItems()}
                renderItem={this.createListItemComponent}
                onDone={this.onDone}
            />
        );
    }
}

export {AddVisitsScreenContainer};
