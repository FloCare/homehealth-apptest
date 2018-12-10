import React from 'react';
import {Icon} from 'react-native-elements';
import CalendarStrip from 'react-native-calendar-strip';
import {PrimaryColor, PrimaryFontFamily} from '../../utils/constants';
import {todayMomentInUTCMidnight} from '../../utils/utils';

const CalendarStripStyled = React.forwardRef((props, ref) => {
    const selectedDateRadius = 10;
    const radius = {
        borderRadius: props.noRounding ? 0 : selectedDateRadius,
        // borderBottomLeftRadius: props.noRounding ? 0 : selectedDateRadius,
        // borderBottomRightRadius: props.noRounding ? 0 : selectedDateRadius,
        // borderTopLeftRadius: props.noRounding ? 0 : selectedDateRadius,
        // borderTopRightRadius: props.noRounding ? 0 : selectedDateRadius
    };

    return (
        <CalendarStrip
            ref={ref}
            swipeEnabled
            onModeChange={props.onModeChange}
            onWeekChanged={props.onWeekChanged}
            style={[{paddingTop: props.paddingTop, backgroundColor: 'white'}, props.dateRowAtBottom ? {justifyContent: 'flex-end'} : {justifyContent: 'center'}, props.style]}
            innerStyle={{flex: undefined}}
            calendarHeaderViewStyle={{marginLeft: 40, marginVertical: 5}}
            calendarHeaderStyle={{fontSize: 18, alignSelf: 'flex-start', fontFamily: PrimaryFontFamily}}
            datesStripStyle={[{flex: undefined}, props.dateRowAtBottom ? {alignItems: 'flex-end'} : null]}
            dateNumberStyle={{fontSize: 18, fontWeight: undefined}}
            iconStyle={{tintColor: PrimaryColor}}
            iconContainer={{flex: 1, flexDirection: 'row'}}
            iconContainerLeft={{justifyContent: 'flex-end'}}
            iconContainerRight={{justifyContent: 'flex-start'}}
            modeSelectorArrow={() => <Icon type="material-community" name="chevron-up" color={PrimaryColor} />}
            primaryColor={PrimaryColor}
            calendarDatesStyle={{flex: 8, paddingHorizontal: 30}}
            swiperContainerStyle={{flex: 2}}
            dateNameStyle={{fontSize: 12, color: '#cccccc'}}
            onDateSelected={props.onDateSelected}
            selectedDate={props.date}
            showMonth={props.showMonth}
            styleWeekend={false}
            calendarHeaderFormat='MMMM'
            customDatesStyles={[
                {
                    startDate: props.date.valueOf(),
                    dateContainerStyle: {backgroundColor: PrimaryColor, ...radius},
                    dateNameStyle: {color: 'white'},
                    dateNumberStyle: {color: 'white'},
                },
                {
                    startDate: todayMomentInUTCMidnight(),
                    dateNameStyle: {color: PrimaryColor},
                    dateNumberStyle: {color: PrimaryColor},
                }
            ]}
        />
    );
});

export {CalendarStripStyled};

