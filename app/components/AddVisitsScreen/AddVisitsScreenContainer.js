import React, {Component} from 'react';
import {Map} from 'immutable';
import {Platform, View, ActionSheetIOS} from 'react-native';
import {ListItem} from 'react-native-elements';
import {AddVisitsScreen} from './AddVisitsScreen';
import {floDB, Patient, Place, Visit, VisitOrder} from '../../utils/data/schema';
import {arrayToMap} from '../../utils/collectionUtils';
import {screenNames, visitType, PrimaryColor} from '../../utils/constants';
import {generateUUID} from '../../utils/utils';

const newStop = 'Add new Stop';
const newPatient = 'Add new Patient';

const newStopNavigatorArg = {
    screen: screenNames.addStop,
    title: 'Add Stop',
    navigatorStyle: {
        tabBarHidden: true
    }
};

const newPatientNavigatorArg = {
    screen: screenNames.addPatient,
    title: 'Add Patient',
    navigatorStyle: {
        tabBarHidden: true
    }
};

class AddVisitsScreenContainer extends Component {
    static navigatorButtons = {
        rightButtons: [
            ...Platform.select({
                ios: [{
                    id: 'ios-plus',
                    systemItem: 'add'
                }],
                android: [
                    {
                        id: 'new-patient',
                        title: newPatient,
                        showAsAction: 'never'
                    }, {
                        id: 'new-stop',
                        title: newStop,
                        showAsAction: 'never'
                    }]
            }),
            {
                id: 'calendar-picker',
                icon: require('../../../resources/calenderSelected.png'),
            }
        ]
    };

    constructor(props) {
        super(props);
        this.state = {
            date: props.date,
            selectedItems: Map()
        };
        this.placeResultObject = floDB.objects(Place.schema.name).sorted('name');
        this.patientsResultObject = floDB.objects(Patient.schema.name).sorted('name');

        this.onChangeText = this.onChangeText.bind(this);
        this.onItemToggle = this.onItemToggle.bind(this);
        this.createListItemComponent = this.createListItemComponent.bind(this);
        this.onDone = this.onDone.bind(this);
        this.onTagPress = this.onTagPress.bind(this);
        this.handleListUpdate = this.handleListUpdate.bind(this);

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    componentDidMount() {
        floDB.addListener('change', this.handleListUpdate);
    }

    componentWillUnMount() {
        floDB.addListener('change', this.handleListUpdate);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({date: nextProps.date});
    }

    handleListUpdate() {
        this.forceUpdate();
    }

    onNavigatorEvent(event) {
        if (event.type === 'NavBarButtonPress') {
            if (event.id === 'new-stop') {
                this.props.navigator.push(newStopNavigatorArg);
            } else if (event.id === 'new-patient') {
                this.props.navigator.push(newPatientNavigatorArg);
            } else if (event.id === 'ios-plus') {
                const options = [newPatient, newStop, 'Cancel'];

                ActionSheetIOS.showActionSheetWithOptions({
                    options,
                    cancelButtonIndex: options.length - 1
                }, (buttonIndex) => {
                    switch (buttonIndex) {
                        case 0:
                            this.props.navigator.push(newPatientNavigatorArg);
                            break;
                        case 1:
                            this.props.navigator.push(newStopNavigatorArg);
                            break;
                        default:
                            break;
                    }
                });
            }
        }
        if (this.props.onNavigatorEvent) {
            this.props.onNavigatorEvent(event);
        }
    }

    onChangeText(text) {
        this.placeResultObject = floDB.objects(Place.schema.name).filtered('name CONTAINS[c] $0', text).sorted('name');
        this.patientsResultObject = floDB.objects(Patient.schema.name).filtered('name CONTAINS[c] $0', text).sorted('name');

        this.setState({filterText: text});
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
        return addressObject.streetAddress;
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
            address: this.getFlatAddress(place.address),
            isSelected: this.state.selectedItems.has(key)
        };
    }

    createListItemComponent({item}) {
        const avatar = item.type === 'patient' ? require('../../../resources/person_ic.png') : require('../../../resources/location.png');
        const rightIcon = item.isSelected ? {name: 'check', color: PrimaryColor} : <View />;
        console.log(item);
        console.log([item.type + item.id, item.name, item.address, avatar, rightIcon].join(', '));
        return (
            <ListItem
                key={item.key}
                title={item.name}
                subtitle={item.address}
                avatar={avatar}
                avatarStyle={{resizeMode: 'contain'}}
                rightIcon={rightIcon}
                titleStyle={{fontSize: 17, color: '#222222'}}
                subtitleStyle={{fontSize: 12, color: '#666666', fontWeight: 'normal'}}
                avatarOverlayContainerStyle={{backgroundColor: 'transparent'}}
                onPress={() => this.onItemToggle(item)}
            />
        );
    }

    onDone() {
        //TODO improve efficiency by not having to query for patient object

        //This is the part where we create the new visit items
        floDB.write(() => {
            for (const selectedItem of this.state.selectedItems.values()) {
                if (selectedItem.type === visitType.patient) {
                    //TODO what happens when patients have multiple cases
                    const patient = floDB.objectForPrimaryKey(Patient, selectedItem.id);
                    patient.episodes[0].visits.push({
                        visitID: generateUUID(),
                        midnightEpochOfVisit: this.state.date.valueOf()
                    });
                } else if (selectedItem.type === visitType.place) {
                    const place = floDB.objectForPrimaryKey(Place, selectedItem.id);
                    place.visits.push({
                        visitID: generateUUID(),
                        midnightEpochOfVisit: this.state.date.valueOf()
                    });
                }
            }
        });

        //this is the part where we modify the day's visitOrderList
        const allVisits = floDB.objects(Visit).filtered('midnightEpochOfVisit=$0', this.state.date.valueOf());
        let visitOrderObject = floDB.objectForPrimaryKey(VisitOrder, this.state.date.valueOf());
        if (!visitOrderObject) {
            floDB.write(() => {
                visitOrderObject = floDB.create(VisitOrder, {midnightEpoch: this.state.date.valueOf(), visitList: []});
            });
        }
        const visitListByID = arrayToMap(visitOrderObject.visitList, 'visitID');

        let indexOfFirstDoneVisit;
        for (indexOfFirstDoneVisit = 0; indexOfFirstDoneVisit < visitOrderObject.visitList.length && !visitOrderObject.visitList[indexOfFirstDoneVisit].isDone; indexOfFirstDoneVisit++) {

        }

        const newVisitOrder = [];
        newVisitOrder.push(...visitOrderObject.visitList.slice(0, indexOfFirstDoneVisit));
        for (let j = 0; j < allVisits.length; j++) {
            if (!visitListByID.has(allVisits[j].visitID)) {
                newVisitOrder.push(allVisits[j]);
            }
        }
        newVisitOrder.push(...visitOrderObject.visitList.slice(indexOfFirstDoneVisit, visitOrderObject.visitList.length));

        console.log(`old visit lenght ${visitOrderObject.visitList.length}, new length ${newVisitOrder.length}`);
        floDB.write(() => {
            visitOrderObject.visitList = newVisitOrder;
        });

        if (this.props.onDone) {
            this.props.onDone(this.state.selectedItems);
        }
        this.props.navigator.pop();
    }

    render() {
        return (
            <AddVisitsScreen
                isZeroState={floDB.objects(Place.schema.name).length + floDB.objects(Patient.schema.name).length === 0}
                onChangeText={this.onChangeText}
                onTagPress={this.onTagPress}
                onPressAddPatient={(() => this.props.navigator.push(newPatientNavigatorArg))}
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
