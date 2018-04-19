import React from 'react';
import {View, Image, FlatList} from 'react-native';
import {Text, Button, Divider} from 'react-native-elements';
import styles from './styles';
import {Icon} from 'react-native-elements'
import Badge from "react-native-elements/src/badge/badge";
import componentStyles from "../common/styles";

const renderDiagnosis = (item) => {
    return (
        <Text style={styles.itemStyle}>{item.key}</Text>
    );
};

const PatientDetailCard = (props) => {
    const {patientDetail} = props;
    //Handle name with navigator props
    const {name, streetAddress, primaryContact, emergencyContact, diagnosis, visits, notes} = patientDetail;
    return (
        <View style={styles.parentContainerStyle}>
            {/*

            <View>
                <Text>
                    Address show here on Map
                </Text>
            </View>

*/}
            <View style={styles.containerStyle}>
                <Icon name="phone" size={22} color="#999999" containerStyle={styles.iconStyle}/>
                <View style={{marginLeft: 14}}>
                    <Text style={styles.headerStyle}>
                        Primary Contact
                    </Text>
                    <Text style={{fontSize: 12, color: '#999999'}}>
                        +1 786 908 3467
                    </Text>
                </View>
                <Button
                    title="Call"
                    textStyle={{
                        fontSize: 18,
                        color: "#45ceb1"
                    }}
                    buttonStyle={styles.callButtonStyle}
                    containerViewStyle={{
                        position: 'absolute',
                        right: 0
                    }}
                />
            </View>
            <Divider style={styles.dividerStyle}/>
            <View style={styles.containerStyle}>
                <Icon name="phone" size={22} color="#999999" containerStyle={styles.iconStyle}/>
                <View style={{marginLeft: 14}}>
                    <Text style={styles.headerStyle}>
                        Diagnosis
                    </Text>
                    <FlatList
                        horizontal
                        style={componentStyles.listContainer}
                        data={[
                            '#COFG',
                            '#ADHD',
                            '#BLABLABLA',
                            '#COFG',
                            '#ADHD',
                            '#BLABLABLA'
                        ]}
                        renderItem={({item}) =>
                            <Badge
                                containerStyle={componentStyles.badgeContainerStyle}
                                textStyle={componentStyles.badgeTextStyle}
                                value={item}/>
                        }
                    />
                </View>
            </View>
            <Divider style={styles.dividerStyle}/>
            <View style={styles.containerStyle}>
                <Icon name="phone" size={22} color="#999999" containerStyle={styles.iconStyle}/>
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
            <Divider style={styles.dividerStyle}/>
            <View style={styles.containerStyle}>
                <Icon name="phone" size={22} color="#999999" containerStyle={styles.iconStyle}/>
                <View style={{marginLeft: 14}}>
                    <Text style={styles.headerStyle}>
                        Notes
                    </Text>
                    <Text style={styles.noteStyle}>
                        Door Passcode- 9008
                    </Text>
                </View>
            </View>
            <Divider style={styles.dividerStyle}/>
            <View style={styles.buttonContainerStyle}>
                <Button
                    title="Add Visit"
                    buttonStyle={styles.footerButtonStyle}
                />
                <Button
                    title="Add Notes"
                    buttonStyle={styles.footerButtonStyle}
                />
            </View>
        </View>
    );
};

export {PatientDetailCard};
