import React from 'react';
import {View, Dimensions} from 'react-native';
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
                {`${props.remainingVisitsCount} of ${props.totalVisitsCount} visits remaining`}
            </Text>
            {/*<Text*/}
            {/*style={{*/}
            {/*fontSize: 14,*/}
            {/*color: '#ffffff'*/}
            {/*}}*/}
            {/*>*/}
            {/*{'Total Remaining Miles: 27'}*/}
            {/*/!*{`Total Remaining Miles: ${props.remainingMiles}`}*!/*/}
            {/*</Text>*/}
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
                    containerStyle={{marginLeft: 50}}
                    name='list'
                    type='font-awesome'
                    color='#45ceb1'
                    onPress={props.navigateToVisitListScreen}
                />
            </View>
            <View
                style={{
                    paddingBottom: 16,
                    width: Dimensions.get('screen').width,
                    justifyItems: 'center',
                    alignItems: 'center',
                }}
            >
                <Text
                    style={{
                        fontSize: 14,
                        color: '#ffffff',
                    }}
                >
                    Next Visit
                </Text>
                {/*prefer to use VisitCard rather than VisitListContainer*/}
            </View>
            <SortedVisitListContainer
                style={{width: Dimensions.get('screen').width * 0.95}}
                date={props.date}
                singleEntry
                scrollEnabled={false}
                sortingEnabled={false}
                renderWithCallback={VisitCard}
                onOrderChange={props.onOrderChange}
            />
        </View>
    );
}
