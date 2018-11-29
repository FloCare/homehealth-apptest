import React from 'react';
import moment from 'moment';
import {View, Image} from 'react-native';
import StyledText from '../../common/StyledText';
import {Images} from '../../../Images';

export function NoteBubble(note) {
    return (
        <View
            style={{
                flex: 1,
                opacity: note.synced === 'true' ? 1 : 0.6,
                flexDirection: 'row',
                marginVertical: 17.5,
            }}
            behavior='padding'
        >
            <View
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center'
                }}
            >
                <Image source={Images.notesIcon} />
            </View>
            <View
                style={{
                    flex: 5,
                    flexDirection: 'column'
                }}
            >
                <View
                    style={{
                        width: '90%',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                        marginBottom: 10,
                    }}
                >
                    <StyledText
                        style={{
                            fontSize: 14,
                            fontWeight: 'bold',
                            color: '#262626'
                        }}
                    >
                        {`${note.user.lastName}, ${note.user.role}`}
                    </StyledText>
                    <StyledText
                        style={{
                            fontSize: 11,
                            color: '#b1b1b1'
                        }}
                    >
                        {moment(note.timetoken).format('hh:mm a')}
                    </StyledText>
                </View>
                <View>
                    <StyledText
                        style={{
                            fontSize: 11,
                            color: '#202020'
                        }}
                    >
                        {note.data}
                    </StyledText>
                </View>
            </View>
        </View>
    );
}
