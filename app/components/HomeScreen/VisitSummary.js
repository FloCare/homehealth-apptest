import React from 'react';
import {View, Dimensions, Image, TouchableHighlight, TouchableWithoutFeedback} from 'react-native';
import {Text} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import {VisitCard} from '../common/visitCard';
import {SortedVisitListContainer} from '../common/SortedVisitListContainer';

export function VisitSummary(props) {
    const primaryColor = '#45ceb1';
    const secondary = '#34da92';
    return (
        <LinearGradient
            colors={[primaryColor, secondary]}
            style={{
                flex: 1,
                alignItems: 'center',
                backgroundColor: primaryColor,
                margin: 0,
                // marginTop: 60,
                // paddingTop: 10,
                // paddingBottom: 30
            }}
        >
            <View style={{flex: 1, justifyContent: 'center'}}>
                <Text
                    style={{
                        fontSize: 24,
                        fontWeight: 'bold',
                        color: '#ffffff'
                    }}
                >
                    {`${props.remainingVisitsCount} of ${props.totalVisitsCount} visits remaining`}
                </Text>
            </View>
            <View style={{flex: 2}}>
                <Text
                    style={{
                        alignSelf: 'center',
                        fontSize: 12,
                        color: '#ffffff'
                    }}
                >
                    View visits on
                </Text>
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        // alignSelf: 'stretch',
                    }}
                >
                    <TouchableWithoutFeedback onPress={props.navigateToVisitMapScreen}>
                        {/*// underlayColor={primaryColor}>*/}
                        <Image
                            style={{resizeMode: 'contain'}}
                            source={require('../../../resources/map.png')}
                        />
                    </TouchableWithoutFeedback>


                    <TouchableWithoutFeedback onPress={props.navigateToVisitListScreen}>
                        <Image
                            style={{resizeMode: 'contain'}}
                            source={require('../../../resources/list.png')}
                        />
                    </TouchableWithoutFeedback>
                </View>
            </View>
            <View
                style={{
                    flex: 4,
                    width: Dimensions.get('screen').width,
                    justifyContent: 'center',
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
                <SortedVisitListContainer
                    navigator={props.navigator}
                    style={{width: Dimensions.get('screen').width * 0.95}}
                    date={props.date}
                    singleEntry
                    scrollEnabled={false}
                    sortingEnabled={false}
                    renderWithCallback={VisitCard}
                    tapForDetails
                    onOrderChange={props.onOrderChange}
                />
            </View>
        </LinearGradient>
    );
}
