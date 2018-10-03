import React, {Component} from 'react';
import moment from 'moment/moment';
import {
    View,
} from 'react-native';
import StyledText from '../common/StyledText';

export class DayCard extends Component {
    render() {
        return (
            <View
                style={{
                    alignItems: 'center',
                    width: '47%',
                    margin: 2.5,
                    padding: 10,
                    elevation: 1,
                    borderRadius: 2.5,
                    backgroundColor: '#ffffff',
                    shadowColor: 'rgba(0, 0, 0, 0.13)',
                    shadowOffset: {
                        width: 0,
                        height: 0
                    },
                    shadowRadius: 3,
                    shadowOpacity: 1,
                    borderStyle: 'solid',
                    borderWidth: 0.5,
                    borderColor: '#d9d9d9'
                }}
            >
                <StyledText
                    style={{
                        fontSize: 11,
                        fontWeight: '500',
                        paddingBottom: 20,
                    }}
                >
                    {`${moment(this.props.visitOrder.midnightEpoch).format('ddd MMM D')} (${this.props.visitOrder.visitList.length} ${this.props.visitOrder.visitList.length === 1 ? 'patient)' : 'patients)'}`}
                </StyledText>
                {
                    this.props.visitOrder.visitList.map(visit => (
                        <View
                            style={{
                                width: '100%',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}
                        >
                            <StyledText
                                style={{
                                    fontWeight: '500',
                                    fontSize: 10,
                                }}
                            >
                                {visit.getAssociatedName()}
                            </StyledText>
                            <StyledText
                                style={{
                                    fontWeight: '500',
                                    fontSize: 10,
                                }}
                            >
                                {visit.plannedStartTime ? moment(visit.plannedStartTime).format('hh:mm A') : '--:--'}
                            </StyledText>
                        </View>
                    ))
                }
            </View>
        );
    }
}
