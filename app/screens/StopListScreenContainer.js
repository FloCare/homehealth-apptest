import React, {Component} from 'react';
import firebase from 'react-native-firebase';
import {Platform, Alert} from 'react-native';
import {StopListScreen} from '../components/StopListScreen';
import {floDB, Place} from '../utils/data/schema';
import {createSectionedListByName} from '../utils/collectionUtils';
import {screenNames} from '../utils/constants';
import {Images} from '../Images';
import {PlaceDataService} from '../data_services/PlaceDataService';

class StopListScreenContainer extends Component {
    static navigatorButtons = {
        rightButtons: [
            Platform.select({
                android: {
                    icon: Images.addButton, // for icon button, provide the local image asset name
                    id: 'add', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                },
                ios: {
                    id: 'add',
                    systemItem: 'add'
                }
            })

        ]
    };

    constructor(props) {
        super(props);
        this.state = {
            searchText: null,
            stopList: [],
            stopCount: 0
        };
        this.getSectionData = this.getSectionData.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        this.handleListUpdate = this.handleListUpdate.bind(this);
        this.onPressAddStop = this.onPressAddStop.bind(this);
        this.onPressPopupButton = this.onPressPopupButton.bind(this);
        this.stopMoreMenu = [
            {id: 'Edit', title: 'Edit Stop'},
            {id: 'DeleteStop', title: 'Remove Stop'},
        ];
    }

    componentDidMount() {
        this.getSectionData(null);
        floDB.addListener('change', this.handleListUpdate);
    }

    onSearch(query) {
        this.setState({searchText: query});
        this.getSectionData(query);
    }

    onNavigatorEvent(event) {
        if (event.id === 'willAppear') {
            const title = `Saved Places (${this.state.stopCount})`;
            this.props.navigator.setTitle({
                title
            });
        }

        if (event.type === 'NavBarButtonPress') { // this is the event type for button presses
            if (event.id === 'add') {       // this is the same id field from the static navigatorButtons definition
                this.onPressAddStop();
            }
        }
        // STOP GAP solution. Will be removed when redux is used
        if (event.id === 'didAppear') {
            firebase.analytics().setCurrentScreen(screenNames.stopListScreen, screenNames.stopListScreen);
        }
    }

    onPressAddStop() {
        this.props.navigator.push({
            screen: screenNames.addStop,
            title: 'Add Stop',
            navigatorStyle: {
                tabBarHidden: true
            }
        });
    }

    onPressPopupButton(buttonPressed, item) {
        switch (buttonPressed) {
            case 'Edit': 
                this.props.navigator.push({
                    screen: screenNames.addStop,
                    title: 'Edit Stops',
                    navigatorStyle: {
                        tabBarHidden: true
                    },
                    passProps: {
                        values: {
                            placeID: item.key,
                            addressID: item.address.addressID,
                            streetAddress: item.address.streetAddress,
                            lat: item.address.lat,
                            long: item.address.long,
                            zipCode: item.address.zipCode,
                            city: item.address.city,
                            state: item.address.state,
                            country: item.address.country,
                            stopName: item.name,
                            primaryContact: item.primaryContact,
                        },
                        edit: true
                    }
                });
                break;
            case 'DeleteStop':
                const archiveStop = (id) => {
                    console.log('Archiving Stop');
                    try {
                        PlaceDataService.getInstance().archivePlace(id);
                        Alert.alert('Success', 'Stop deleted successfully');
                    } catch (err) {
                        console.log('ERROR while archiving place:', err);
                        Alert.alert('Error', 'Unable to delete stop. Please try again later');
                    }
                };
                Alert.alert(
                    'Caution',
                    'All your stops related data will be deleted. Do you wish to continue?',
                    [
                        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                        {text: 'OK', onPress: () => archiveStop(item.placeID)},
                    ]
                );
                break;
            default:
                console.log('Invalid option pressed');
                break;
        }
    }

    getSectionData(query) {
        if (!query) {
            const stopList = floDB.objects(Place.schema.name).filtered('archived = false');
            const sortedStopList = stopList.sorted('name');
            const stopCount = sortedStopList.length;
            const sectionedStopList = createSectionedListByName(sortedStopList);
            this.setState({
                stopList: sectionedStopList,
                stopCount
            });
        } else {
            // Todo: Can improve querying Logic:
            // Todo: use higher weight for BEGINSWITH and lower for CONTAINS
            // Todo: Search on other fields ???
            const queryStr = `name CONTAINS[c] "${query.toString()}"`;
            const stopList = floDB.objects(Place.schema.name).filtered('archived = false').filtered(queryStr);
            const sortedStopList = stopList.sorted('name');
            const sectionedStopList = createSectionedListByName(sortedStopList);
            this.setState({stopList: sectionedStopList});
        }
    }

    componentWillUnmount() {
        floDB.addListener('change', this.handleListUpdate);
    }

    handleListUpdate() {
        // Todo: Don't query again
        this.getSectionData(null);
    }

    render() {
        const {selectedStop} = this.props;
        return (
            <StopListScreen
                stopList={this.state.stopList}
                stopCount={this.state.stopCount}
                searchText={this.state.searchText}
                onSearch={this.onSearch}
                selectedStop={selectedStop}
                onPressAddStop={this.onPressAddStop}
                menu={this.stopMoreMenu}
                onPressPopupButton={this.onPressPopupButton}
            />
        );
    }
}

export default StopListScreenContainer;
