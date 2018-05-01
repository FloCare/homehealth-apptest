import React, {Component} from 'react';
import {Animated, View} from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import {RenderIf} from '../../utils/data/syntacticHelpers';
import moment from 'moment/moment';

function ScreenWithCalendarComponent(BaseScreenComponent) {
    return (
        class CompositeClass extends Component {
            constructor(props) {
                super(props);
                this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

                this.state = {
                    shown: false,
                    // calendarStripHeight: new Animated.Value(0)
                };

                this.broadcastDeepLinkForDateChange = this.broadcastDeepLinkForDateChange.bind(this);
            }

            //TODO unpredictable
            onNavigatorEvent(event) {
                console.log('state changed');
                if (event.type === 'NavBarButtonPress') {
                    if (event.id === 'calendar-picker') {
                        this.setState((prevState) => ({shown: !prevState.shown}));
                        console.log('state changed');
                        // Animated.timing(
                        //     this.state.calendarStripHeight,
                        //     {
                        //         toValue: this.state.shown ? 0 : 200,
                        //         duration: 1000,
                        //     }
                        // ).start();
                    }
                }
            }

            broadcastDeepLinkForDateChange(date) {
                this.props.navigator.handleDeepLink({
                    link: 'date',
                    payload: date
                });
                this.setState({shown: false});
            }

            render() {
                // console.log(this.state.calendarStripHeight);
                // console.log(this.state);
                return (
                        <View style={{flex: 1}}>
                            {RenderIf(
                                <CalendarStrip
                                    style={{height: 75}}
                                    styleWeekend={false}
                                    calendarHeaderFormat='MMMM'
                                    calendarHeaderStyle={{fontWeight: 'bold', fontSize: 24}}
                                    onDateSelected={this.broadcastDeepLinkForDateChange}
                                    selectedDate={this.state.date}
                                    customDatesStyles={[
                                        {
                                            startDate: this.props.date.valueOf(),
                                            dateContainerStyle: {backgroundColor: '#45ceb1', borderRadius: 0},
                                            dateNameStyle: {color: 'white'},
                                            dateNumberStyle: {color: 'white'},
                                        },
                                        {
                                            startDate: moment().utc().startOf('day').valueOf(),
                                            dateContainerStyle: {borderColor: '#45ceb1', borderRadius: 0},
                                        }
                                    ]}
                                />,
                                this.state.shown)}
                            <BaseScreenComponent {...this.props} onNavigatorEvent={this.onNavigatorEvent.bind(this)} />
                        </View>
                );
            }
        }
    );
}

export {ScreenWithCalendarComponent};

