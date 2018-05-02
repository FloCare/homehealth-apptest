import React from 'react';
import {View, Dimensions, Image, TouchableHighlight} from 'react-native';
import {Avatar, Button, Icon, Text} from 'react-native-elements';
import {VisitListContainer} from '../common/VisitList/visitListContainer';
import {VisitCard} from '../common/visitCard';
import {SortedVisitListContainer} from '../common/SortedVisitListContainer';

export function VisitSummary(props) {
    const primaryColor = '#45ceb1';
    return (
        <View
            style={{
                flex: 1,
                alignItems: 'center',
                backgroundColor: primaryColor,
                margin: 0,
                // marginTop: 60,
                paddingTop: 10,
                paddingBottom: 30
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
                    marginLeft: 100,
                    marginRight: 100
                }}
            >
                <TouchableHighlight onPress={props.navigateToVisitMapScreen} underlayColor={primaryColor}>
                    <Image
                        source={require('../../../resources/map.png')}
                    />
                </TouchableHighlight>


                <TouchableHighlight onPress={props.navigateToVisitListScreen} underlayColor={primaryColor}>
                    <Image
                        source={require('../../../resources/list.png')}
                    />
                </TouchableHighlight>
            </View>
            <View
                style={{
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
