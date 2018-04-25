import React from 'react';
import {View, FlatList, Linking} from 'react-native';
import {Text, Button, Divider, Icon} from 'react-native-elements';
import Badge from 'react-native-elements/src/badge/badge';
import styles from './styles';
import componentStyles from '../common/styles';
import {PatientDetailMapComponent} from './PatientDetailMapComponent';

const PatientDetailCard = (props) => {
    const {patientDetail, onPressAddVisit, onPressAddNotes} = props;
    //Handle name with navigator props
    const {
        primaryContact,
        emergencyContact,
        diagnosis,
        notes,
        address
    } = patientDetail;

    let coordinates = null;
    if (address) {
        coordinates = address.coordinates;
    }
    console.log(coordinates)
    return (
        <View style={styles.parentContainerStyle}>
            {coordinates &&
            <PatientDetailMapComponent
                patientCoordinates={coordinates}
                patientAddress={address.streetAddress}
            />
            }
            <View style={styles.containerStyle}>
                <Icon name="phone" size={22} color="#999999" containerStyle={styles.iconStyle} />
                <View style={{marginLeft: 14}}>
                    <Text style={styles.headerStyle}>
                        Primary Contact
                    </Text>
                    <Text style={{fontSize: 12, color: '#999999'}}>
                        {primaryContact}
                    </Text>
                </View>
                <Button
                    title="Call"
                    textStyle={{
                        fontSize: 18,
                        color: '#45ceb1'
                    }}
                    buttonStyle={styles.callButtonStyle}
                    containerViewStyle={{
                        position: 'absolute',
                        right: 0
                    }}
                    onPress={() => Linking.openURL(`tel:${primaryContact}`).catch(err => console.error('An error occurred', err))}
                />
            </View>

            <Divider style={styles.dividerStyle} />

            {emergencyContact !== '' && emergencyContact && 
            <View style={styles.containerStyle}>
                <Icon name="phone" size={22} color="#999999" containerStyle={styles.iconStyle} />
                <View style={{marginLeft: 14}}>
                    <Text style={styles.headerStyle}>
                        Emergency Contact
                    </Text>
                    <Text style={{fontSize: 12, color: '#999999'}}>
                        {emergencyContact}
                    </Text>
                </View>
                <Button
                    title="Call"
                    textStyle={{
                        fontSize: 18,
                        color: '#45ceb1'
                    }}
                    buttonStyle={styles.callButtonStyle}
                    containerViewStyle={{
                        position: 'absolute',
                        right: 0
                    }}
                    onPress={() => Linking.openURL(`tel:${primaryContact}`).catch(err => console.error('An error occurred', err))}
                />
            </View>
            }

            <Divider style={styles.dividerStyle} />

            <View style={styles.containerStyle}>
                <Icon name="phone" size={22} color="#999999" containerStyle={styles.iconStyle} />
                <View style={{marginLeft: 14}}>
                    <Text style={styles.headerStyle}>
                        Diagnosis
                    </Text>
                    <FlatList
                        horizontal
                        style={componentStyles.listContainer}
                        data={[
                            '#ABC',
                            '#XYZ',
                            '#PQR',
                            '#MNO'
                        ]}
                        renderItem={({item}) =>
                            <Badge
                                containerStyle={componentStyles.badgeContainerStyle}
                                textStyle={componentStyles.badgeTextStyle}
                                value={item}
                            />
                        }
                    />
                </View>
            </View>

            <Divider style={styles.dividerStyle} />

            <View style={styles.containerStyle}>
                <Icon name="phone" size={22} color="#999999" containerStyle={styles.iconStyle} />
                <View style={{marginLeft: 14}}>
                    <Text style={styles.headerStyle}>
                        Visits
                    </Text>
                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        horizontal
                        style={componentStyles.listContainer}
                        data={[
                            'Revent visit by Mirium (SN) On 03/22/2018, 3:30 PM - 4:45 PM',
                            'Next Visit by You in X days. "Visit time".',
                        ]}
                        show
                        renderItem={({item}) =>
                            /*Use nested texts for spannable*/
                            <Text style={styles.visitStyle}>
                                {item}
                            </Text>
                        }
                    />
                </View>
            </View>

            <Divider style={styles.dividerStyle} />

            <View style={styles.containerStyle}>
                <Icon name="phone" size={22} color="#999999" containerStyle={styles.iconStyle} />
                <View style={{marginLeft: 14}}>
                    <Text style={styles.headerStyle}>
                        Notes
                    </Text>
                    <Text style={styles.noteStyle}>
                        {notes}
                    </Text>
                </View>
            </View>

            <Divider style={styles.dividerStyle} />

            <View style={styles.buttonContainerStyle}>
                <Button
                    title="Add Visit"
                    buttonStyle={styles.footerButtonStyle}
                    onPress={onPressAddVisit}
                />
                <Button
                    title="Add Notes"
                    buttonStyle={styles.footerButtonStyle}
                    onPress={onPressAddNotes}
                />
            </View>
        </View>
    );
};

export {PatientDetailCard};
