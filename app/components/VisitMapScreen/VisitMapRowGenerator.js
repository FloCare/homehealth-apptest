import React, {PureComponent} from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-elements';
import {connect} from 'react-redux';
import moment from 'moment';
import StyledText from '../common/StyledText';

const mapStateToProps = (state, ownProps) => {
    const visitID = ownProps.data;
    const visit = state.visits[visitID];

    let visitSubject;
    if (visit.isPatientVisit) {
        const patientID = visit.patientID;
        visitSubject = state.patients[patientID];
    } else {
        const placeID = visit.placeID;
        visitSubject = state.places[placeID];
    }

    return {
        name: visitSubject.name,
        plannedStartTime: visit.plannedStartTime
    };
};

function VisitMapRowGenerator() {
    class RenderRow extends PureComponent {
        render() {
            const {index, name, sortingActive, active} = this.props;
            const visitTime = this.props.plannedStartTime ? moment(this.props.plannedStartTime).format('HH:mm A') : '--:-- ';
            const displayLabel = `${visitTime} ${name}`;
            return (
                <View
                    style={[
                        {flexDirection: 'row', marginLeft: 20, marginRight: 20, marginTop: 3.5, marginBottom: 3.5},
                        sortingActive && !active ? {opacity: 0.7} : {},
                        active ? {elevation: 6} : {}
                    ]}
                >
                    <View
                        style={{
                            alignContent: 'center',
                            justifyContent: 'center',
                            width: 28,
                            height: 28,
                            borderRadius: 14,
                            borderWidth: 1.5,
                            borderColor: 'white',
                        }}
                    >
                        {/*//TODO remove this hack*/}
                        <Text
                            style={{
                                color: 'white',
                                alignSelf: 'center',
                                alignItems: 'center'
                            }}
                        >{`${String.fromCharCode('A'.charCodeAt(0) + index)}`}</Text>
                    </View>
                    <View
                        style={[{
                            flex: 1,
                            flexDirection: 'row',
                            backgroundColor: 'rgba(255,255,255,0.35)',
                            marginLeft: 10,
                            alignItems: 'center'
                        }, active ? {elevation: 6, borderColor: 'white', borderWidth: 1} : {}
                        ]}
                    >
                        <View style={{flex: 1, marginLeft: 6, justifyContent: 'space-between'}}>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{height: 1, width: 1, borderColor: 'white', borderWidth: 1}} />
                                <View style={{height: 1, width: 1, marginLeft: 1, borderColor: 'white', borderWidth: 1}} />
                            </View>
                            <View style={{height: 1}} />
                            <View style={{flexDirection: 'row'}}>
                                <View style={{height: 1, width: 1, borderColor: 'white', borderWidth: 1}} />
                                <View style={{height: 1, width: 1, marginLeft: 1, borderColor: 'white', borderWidth: 1}} />
                            </View>
                            <View style={{height: 1}} />
                            <View style={{flexDirection: 'row'}}>
                                <View style={{height: 1, width: 1, borderColor: 'white', borderWidth: 1}} />
                                <View style={{height: 1, width: 1, marginLeft: 1, borderColor: 'white', borderWidth: 1}} />
                            </View>
                            <View style={{height: 1}} />
                            <View style={{flexDirection: 'row'}}>
                                <View style={{height: 1, width: 1, borderColor: 'white', borderWidth: 1}} />
                                <View style={{height: 1, width: 1, marginLeft: 1, borderColor: 'white', borderWidth: 1}} />
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', flex: 20}}>
                            <StyledText style={{width: 70, color: 'white', fontSize: 13}}>
                                {visitTime}
                            </StyledText>
                            <View style={{borderLeftWidth: 1, borderLeftColor: 'white'}}>
                                <StyledText style={{color: 'white', fontSize: 14, marginLeft: 10}}>
                                    {name}
                                </StyledText>
                            </View>
                        </View>
                    </View>
                </View>
            );
        }
    }

    return connect(mapStateToProps)(RenderRow);
}

export {VisitMapRowGenerator};
