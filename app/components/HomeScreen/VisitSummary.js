import React from 'react';
import {View} from 'react-native';
import {Avatar, Button, Icon, Text} from 'react-native-elements';
import {VisitListContainer} from '../common/VisitList/visitListContainer';
import {VisitCard} from '../common/visitCard';
import {SortedVisitListContainer} from '../common/SortedVisitListContainer';

export function VisitSummary(props) {
    return (
        <View
            style={{
                flex: 1,
                alignItems: 'center',
                backgroundColor: '#45ceb1',
                margin: 0,
                // marginTop: 60,
                padding: 10
            }}
        >
            <Text
                style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    color: '#ffffff'
                }}
            >
                {'3 of 6 visits remaining'}
                {/*{`${props.remainingVisitCount} of ${props.totalVisitCount} Visits Remaining`}*/}
            </Text>
            <Text
                style={{
                    fontSize: 14,
                    color: '#ffffff'
                }}
            >
                {'Total Remaining Miles: 27'}
                {/*{`Total Remaining Miles: ${props.remainingMiles}`}*/}
            </Text>
            <Text
                style={{
                    fontSize: 12,
                    marginTop: 20,
                    color: '#ffffff'
                }}
            >
                View visits on
            </Text>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignSelf: 'stretch',
                    margin: 10,
                    marginLeft: 100,
                    marginRight: 100
                }}
            >
                <Icon
                    raised
                    size={30}
                    name='map'
                    type='font-awesome'
                    color='#45ceb1'
                    onPress={props.navigateToVisitMapScreen}
                />
                <Icon
                    raised
                    size={30}
                    name='list'
                    type='font-awesome'
                    color='#45ceb1'
                    onPress={props.navigateToVisitListScreen}
                />
            </View>
            <View
                style={{
                    flex: 1,
                    backgroundColor: 'blue',
                    // flexWrap: 'wrap'
                }}
            >
                <Text
                    style={{
                        fontSize: 14,
                        color: '#ffffff'
                    }}
                >
                    Next Visit
                </Text>
                {/*prefer to use VisitCard rather than VisitListContainer*/}
                <SortedVisitListContainer
                    // style={{flex: 1}}
                    date={props.date}
                    singleEntry
                    renderWithCallback={VisitCard}
                />
            </View>
        </View>
    );
}
