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
                    margin: 3,
                    padding: 15,
                    elevation: 1,
                    borderRadius: 6,
                    backgroundColor: '#ffffff',
                    shadowColor: 'rgba(0, 0, 0)',
                    shadowOffset: {
                        width: 2,
                        height: 2
                    },
                    shadowRadius: 8,
                    shadowOpacity: 0.2,
                    borderStyle: 'solid',
                    borderWidth: 0.5,
                    borderColor: '#d9d9d9'
                }}
            >
                <StyledText
                    style={{
                        fontSize: 15,
                        fontWeight: '900',
                        paddingBottom: 10
                    }}
                >
                    {moment(this.props.visitOrder.midnightEpoch).format('ddd MMM D').toUpperCase()}
                </StyledText>
                {/*<StyledText*/}
                    {/*style={{*/}
                        {/*fontSize: 15,*/}
                        {/*fontWeight: '900',*/}
                        {/*paddingBottom: 10,*/}
                    {/*}}*/}
                {/*>*/}
                    {/*{`(${this.props.visitOrder.visitList.length} ${this.props.visitOrder.visitList.length === 1 ? 'patient)' : 'patients)'}`}*/}
                {/*</StyledText>*/}
                {
                    !this.props.visitOrder.visitList || this.props.visitOrder.visitList.length === 0 ?
                        <StyledText
                            style={{
                                fontWeight: '300',
                                fontSize: 13,
                                color: 'grey',
                            }}
                        >
                            No Visits
                        </StyledText>
                        :
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
                                    fontWeight: '300',
                                    fontSize: 13,
                                    flex: 1,
                                }}
                                numberOfLines={1}
                            >
                                {visit.getAssociatedAbbName()}
                            </StyledText>
                            <StyledText
                                style={{
                                    fontWeight: '500',
                                    fontSize: 13,
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
