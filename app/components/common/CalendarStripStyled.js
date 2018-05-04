import React from 'react';
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment/moment';

function CalendarStripStyled(props) {
    const selectedDateRadius = 40;
    const radius = {
        borderRadius: undefined,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderTopLeftRadius: props.noRounding ? 0 : selectedDateRadius,
        borderTopRightRadius: props.noRounding ? 0 : selectedDateRadius
    };

    return (
        <CalendarStrip
            style={{flex: 1, paddingTop: props.paddingTop}}
            calendarHeaderViewStyle={{marginLeft: 40, marginBottom: 10}}
            calendarHeaderStyle={{fontSize: 24, alignSelf: 'flex-start'}}
            datesStripStyle={{alignItems: 'flex-end'}}
            dateNumberStyle={{fontSize: 18, fontWeight: undefined}}
            iconContainer={{flex: 1, opacity: 0.2}}
            calendarDatesStyle={{flex: 9}}
            dateNameStyle={{fontSize: 12, color: '#cccccc'}}
            onDateSelected={props.onDateSelected}
            selectedDate={props.date}
            startingDate={props.date}
            styleWeekend={false}
            calendarHeaderFormat='MMMM'
            customDatesStyles={[
                {
                    startDate: props.date.valueOf(),
                    dateContainerStyle: {backgroundColor: '#45ceb1', ...radius},
                    dateNameStyle: {color: 'white'},
                    dateNumberStyle: {color: 'white'},
                },
                {
                    startDate: moment().utc().startOf('day').valueOf(),
                    dateNameStyle: {color: '#45ceb1'},
                    dateNumberStyle: {color: '#45ceb1'},
                }
            ]}
        />
    );
}

export {CalendarStripStyled};

