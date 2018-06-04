import React from 'react';
import {View} from 'react-native';
import {AddStopFormContainer} from '../AddStopForm';
import styles from './styles';

const AddStopScreen = (props) => {
    const {
        edit, placeID, addressID, streetAddress, lat, long, zip, city, 
        state, country, stopName, primaryContact
    } = props;
    return (
        <View style={styles.containerStyle}>
            <AddStopFormContainer
                onSubmit={props.onSubmit}
                edit={edit}
                placeID={placeID}
                addressID={addressID}
                streetAddress={streetAddress}
                lat={lat}
                long={long}
                zip={zip}
                city={city}
                state={state}
                country={country}
                stopName={stopName}
                primaryContact={primaryContact}
            />
        </View>
    );
};

export {AddStopScreen};
