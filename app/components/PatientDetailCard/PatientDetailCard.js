import React from 'react';
import {View, Image, FlatList} from 'react-native';
import {Text, Button} from 'react-native-elements';
import styles from './styles';

const renderDiagnosis = (item) => {
    return (
        <Text style={styles.itemStyle}>{item.key}</Text>
    );
};

const PatientDetailCard = ({primaryContact, diagnosis, visits, notes}) => {
    return (
        <View style={styles.parentContainerStyle}>
            <View>
                <Text>
                    Address show here on Map
                </Text>
            </View>
            <View>
                <Image
                    resizeMode="cover"
                />
                <Text h3>
                    Primary Contact
                </Text>
                <Text>
                    9964716595
                </Text>
                <Button
                    title="Call"
                    titleStyle={{
                        fontWeight: '700'
                    }}
                    buttonStyle={styles.callButtonStyle}
                    containerStyle={{
                        marginTop: 20,
                        color: 'rgba(92,216,10,1)'
                    }}
                />
            </View>
            <View>
                <Image
                    resizeMode="cover"
                />
                <Text>
                    Diagnosis
                </Text>
                <FlatList
                    style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        marginTop: 10,
                        marginBottom: 10
                    }}
                    data={[
                        {key: '#COFG'},
                        {key: '#ADHD'},
                        {key: '#BLABLABLA'}
                    ]}
                    renderItem={renderDiagnosis}
                />
            </View>
            <View>
                <Image
                    resizeMode="cover"
                />
                <Text h3>
                    Visits
                </Text>
                <Text>
                    Last Visit by You
                </Text>
                <Text>
                    Next Visit by You in X days. "Visit time".
                </Text>
            </View>
            <View>
                <Image
                    resizeMode='cover'
                />
                <Text h3>
                    Notes
                </Text>
                <Text>
                    Text inside notes
                </Text>
            </View>
            <View style={styles.buttonContainerStyle}>
                <Button
                    title="Add Visit"
                    buttonStyle={styles.footerButtonStyle}
                />
                <Button
                    title="Add Notes"
                    buttonStyle={styles.footerButtonStyle }
                />
            </View>
        </View>
    );
};

export {PatientDetailCard};
