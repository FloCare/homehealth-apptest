import React from 'react';
import {View, Dimensions, Image, TouchableHighlight, TouchableWithoutFeedback} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {VisitCard} from '../common/visitCard';
import {SortedVisitListContainer} from '../common/SortedVisitListContainer';
import {PrimaryColor} from '../../utils/constants';
import {Images} from '../../Images';
import StyledText from '../common/StyledText';

export function VisitSummary(props) {
    const primaryColor = PrimaryColor;
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
                <StyledText
                    style={{
                        fontSize: 24,
                        fontWeight: 'bold',
                        color: '#ffffff'
                    }}
                >
                    {`${props.remainingVisitsCount} of ${props.totalVisitsCount} visits remaining`}
                </StyledText>
            </View>
            <View style={{flex: 2}}>
                <StyledText
                    style={{
                        alignSelf: 'center',
                        fontSize: 12,
                        color: '#ffffff'
                    }}
                >
                    View visits on
                </StyledText>
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
                            source={Images.map}
                        />
                    </TouchableWithoutFeedback>


                    <TouchableWithoutFeedback onPress={props.navigateToVisitListScreen}>
                        <Image
                            style={{resizeMode: 'contain'}}
                            source={Images.list}
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
                <StyledText
                    style={{
                        fontSize: 14,
                        color: '#ffffff',
                    }}
                >
                    Next Visit
                </StyledText>
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
