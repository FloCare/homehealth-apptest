import React, {Component} from 'react';
import {Map} from 'immutable';
import firebase from 'react-native-firebase';
import {Platform, View, ActionSheetIOS, Alert} from 'react-native';
import {ListItem} from 'react-native-elements';
import RNSecureKeyStore from 'react-native-secure-key-store';
import {AddVisitsScreen} from './AddVisitsScreen';
import {floDB, Patient, Place} from '../../utils/data/schema';
import {screenNames, PrimaryColor} from '../../utils/constants';
import {Images} from '../../Images';
import {VisitService} from '../../data_services/VisitServices/VisitService';
import {PatientDataService} from '../../data_services/PatientDataService';

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
            // {
            //     id: 'calendar-picker',
            //     icon: Images.calendarSelected,
            // }
        ]
    };

    constructor(props) {
        super(props);
        this.state = {
            date: props.date,
            selectedItems: Map(),
            refreshing: false,
            isTeamVersion: undefined,
            searchText: undefined
        };
        RNSecureKeyStore.get('accessToken').then(() => this.setState({isTeamVersion: true}), () => this.setState({isTeamVersion: false}));
        this.placeResultObject = floDB.objects(Place.schema.name).filtered('archived = false').sorted('name');
        const patientList = this.patientDataService().getAllPatients();
        this.patientsResultObject = this.patientDataService().getPatientsSortedByName(patientList);

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

    componentWillUnmount() {
        floDB.removeListener('change', this.handleListUpdate);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({date: nextProps.date});
    }

    handleListUpdate() {
        this.updateResultObjects(this.state.searchText);
        this.forceUpdate();
    }

    onNavigatorEvent(event) {
        // STOP GAP solution. Will be removed when redux is used
        if(event.id === 'didAppear') {
            firebase.analytics().setCurrentScreen(screenNames.addVisit, screenNames.addVisit);
        }
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

    updateResultObjects(text) {
        this.placeResultObject = floDB.objects(Place.schema.name).filtered('archived = false').filtered('name CONTAINS[c] $0', text).sorted('name');
        const filteredPatientList = this.patientDataService().getPatientsFilteredByName(text);
        this.patientsResultObject = this.patientDataService().getPatientsSortedByName(filteredPatientList);
    }

    onChangeText(text) {
        this.updateResultObjects(text);
        this.setState({searchText: text});
    }


    onTagPress(object) {
        this.onItemToggle({key: object instanceof Patient ? object.patientID : object.placeID, object});
    }

    onItemToggle(item) {
        this.setState(
            (prevState) => {
                if (prevState.selectedItems.has(item.key)) {
                    return {selectedItems: prevState.selectedItems.delete(item.key)};
                }
                return {selectedItems: prevState.selectedItems.set(item.key, item.object)};
            }
        );
    }

    createItem(object) {
        const key = object instanceof Patient ? object.patientID : object.placeID;
        return {
            key,
            type: object instanceof Patient ? 'patient' : 'place',
            isSelected: this.state.selectedItems.has(key),
            object,
        };
    }

    getListWithAllItems() {
        const placeIterator = this.placeResultObject.values();
        let patientIteratorIndex = 0;
        const allItems = [];
        let nextPlace = placeIterator.next();
        let nextPatient = this.patientsResultObject[patientIteratorIndex];
        do {
            if (nextPlace.done === true && patientIteratorIndex >= this.patientsResultObject.length) {
                break;
            } else if (nextPlace.done === true) {
                allItems.push(this.createItem(nextPatient));
                nextPatient = this.patientsResultObject[++patientIteratorIndex];
            } else if (patientIteratorIndex >= this.patientsResultObject.length) {
                allItems.push(this.createItem(nextPlace.value));
                nextPlace = placeIterator.next();
            } else if (nextPatient.name.toLowerCase().localeCompare(nextPlace.value.name.toLowerCase()) < 0) {
                allItems.push(this.createItem(nextPatient));
                nextPatient = this.patientsResultObject[++patientIteratorIndex];
            } else {
                allItems.push(this.createItem(nextPlace.value));
                nextPlace = placeIterator.next();
            }
        } while (!nextPlace.done || patientIteratorIndex <= this.patientsResultObject.length);
        return allItems;
    }

    createListItemComponent({item}) {
        const avatar = item.type === 'patient' ? Images.person_ic : Images.location;
        const rightIcon = item.isSelected ? {name: 'check', color: PrimaryColor} : <View />;

        return (
            <ListItem
                key={item.key}
                title={item.object.name}
                subtitle={item.object.address.formattedAddress}
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
        VisitService.getInstance().createNewVisits(this.state.selectedItems.values(), this.state.date.valueOf());
        //This is the part where we create the new visit items
        // floDB.write(() => {
        //     for (const selectedItem of this.state.selectedItems.values()) {
        //         if (selectedItem.type === visitType.patient) {
        //             //TODO what happens when patients have multiple cases
        //             const patient = floDB.objectForPrimaryKey(Patient, selectedItem.id);
        //             patient.episodes[0].visits.push({
        //                 visitID: generateUUID(),
        //                 midnightEpochOfVisit: this.state.date.valueOf()
        //             });
        //         } else if (selectedItem.type === visitType.place) {
        //             const place = floDB.objectForPrimaryKey(Place, selectedItem.id);
        //             place.visits.push({
        //                 visitID: generateUUID(),
        //                 midnightEpochOfVisit: this.state.date.valueOf()
        //             });
        //         }
        //     }
        // });

        //this is the part where we modify the day's visitOrderList
        // const allVisits = floDB.objects(Visit).filtered('midnightEpochOfVisit=$0', this.state.date.valueOf());
        // let visitOrderObject = floDB.objectForPrimaryKey(VisitOrder, this.state.date.valueOf());
        // if (!visitOrderObject) {
        //     floDB.write(() => {
        //         visitOrderObject = floDB.create(VisitOrder, {midnightEpoch: this.state.date.valueOf(), visitList: []});
        //     });
        // }
        // const visitListByID = arrayToMap(visitOrderObject.visitList, 'visitID');
        //
        // let indexOfFirstDoneVisit;
        // for (indexOfFirstDoneVisit = 0; indexOfFirstDoneVisit < visitOrderObject.visitList.length && !visitOrderObject.visitList[indexOfFirstDoneVisit].isDone; indexOfFirstDoneVisit++) {
        //
        // }

        // const newVisitOrder = [];
        // newVisitOrder.push(...visitOrderObject.visitList.slice(0, indexOfFirstDoneVisit));
        // for (let j = 0; j < allVisits.length; j++) {
        //     if (!visitListByID.has(allVisits[j].visitID)) {
        //         newVisitOrder.push(allVisits[j]);
        //     }
        // }
        // newVisitOrder.push(...visitOrderObject.visitList.slice(indexOfFirstDoneVisit, visitOrderObject.visitList.length));

        //TODO put this analytics elsewhere
        // console.log(`Visit length list updated from length ${visitOrderObject.visitList.length} to new length ${newVisitOrder.length}`);
        // firebase.analytics().logEvent(eventNames.ADD_VISIT, {
        //     'VALUE': newVisitOrder.length
        // });
        // floDB.write(() => {
        //     visitOrderObject.visitList = newVisitOrder;
        // });

        console.log('add visits container calling onDone prop');
        if (this.props.onDone) {
            this.props.onDone(this.state.selectedItems);
        }
        this.props.navigator.pop();
        console.log('add visits container all done');
    }

    onRefresh() {
        this.patientDataService().updatePatientListFromServer()
            .then((result) => {
                this.setState({refreshing: false});

                const newPatientsCount = result.additions === 0 ? undefined : result.additions;
                const deletedPatientsCount = result.deletions === 0 ? undefined : result.deletions;

                let subtitle = (newPatientsCount ? `${newPatientsCount} new patients added` : '') + (deletedPatientsCount ? `${newPatientsCount ? ', and ' : ''}${deletedPatientsCount} existing patients removed` : '');
                if (!newPatientsCount && !deletedPatientsCount) {
                    subtitle = 'No new changes';
                }
                Alert.alert(
                    'Refresh Completed',
                    subtitle
                );
            })
            .catch(error => {
                this.setState({refreshing: false});
                console.log(error);
                Alert.alert(
                    'Refresh Failed',
                );
            });
        this.setState({refreshing: true});
    }

    render() {
        return (
            <AddVisitsScreen
                onRefresh={this.state.isTeamVersion ? this.onRefresh.bind(this) : undefined}
                refreshing={this.state.refreshing}
                isZeroState={floDB.objects(Place.schema.name).length + floDB.objects(Patient.schema.name).length === 0}
                onChangeText={this.onChangeText}
                searchText={this.state.searchText}
                onTagPress={this.onTagPress}
                onPressAddPatient={(() => this.props.navigator.push(newPatientNavigatorArg))}
                // onItemToggle={this.onItemToggle}
                selectedItems={Array.from(this.state.selectedItems.values())}
                //TODO is this costing us in terms of efficiency
                listItems={this.getListWithAllItems()}
                renderItem={this.createListItemComponent}
                onDone={this.onDone}
            />
        );
    }

    // External Services
    patientDataService = () => PatientDataService.getInstance();

}

export {AddVisitsScreenContainer};
