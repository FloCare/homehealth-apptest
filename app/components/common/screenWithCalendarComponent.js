import React, {Component} from 'react';
import {View, Platform} from 'react-native';
import {RenderIf} from '../../utils/data/syntacticHelpers';
import {CalendarStripStyled} from './CalendarStripStyled';

function ScreenWithCalendarComponent(BaseScreenComponent) {
    return (
        class CompositeClass extends Component {
            static navigatorButtons = BaseScreenComponent.navigatorButtons;
            constructor(props) {
                super(props);
                this.onNavigatorEvent = this.onNavigatorEvent.bind(this);
                this.getNavigatorButtons = this.getNavigatorButtons.bind(this);

                this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
                this.props.navigator.setTitle({title: props.date.format('MMMM Do')});

                this.state = {
                    date: props.date,
                    shown: false,
                    // calendarStripHeight: new Animated.Value(0)
                };

                this.broadcastDeepLinkForDateChange = this.broadcastDeepLinkForDateChange.bind(this);
            }

            //TODO unpredictable
            onNavigatorEvent(event) {
                console.log('Navigator Event received by ScreenWithCalendarComponent');
                if (event.type === 'NavBarButtonPress') {
                    if (event.id === 'calendar-picker') {
                        if (Platform.OS === 'android') { this.props.navigator.setStyle({topBarElevationShadowEnabled: this.state.shown}); }
                        this.props.navigator.setButtons(this.getNavigatorButtons());
                        this.setState((prevState) => ({shown: !prevState.shown}));
                        console.log('Date change triggered by calendar-picker');
                        // Animated.timing(
                        //     this.state.calendarStripHeight,
                        //     {
                        //         toValue: this.state.shown ? 0 : 200,
                        //         duration: 1000,
                        //     }
                        // ).start();
                    }
                }

                if (this.props.onNavigationEvent) {
                    this.props.onNavigationEvent(event);
                }
            }

            getNavigatorButtons() {
                return {
                    ...BaseScreenComponent.navigatorButtons,
                    rightButtons: BaseScreenComponent.navigatorButtons.rightButtons.map(
                        button => {
                            if (!(button.id === 'calendar-picker')) return button;
                            return {...button, buttonColor: this.state.shown === false ? 'rgba(255,255,255,0.6)' : 'white'};
                        })
                };
            }

            broadcastDeepLinkForDateChange(date) {
                this.props.navigator.handleDeepLink({
                    link: 'date',
                    payload: date
                });
                this.setState({shown: false, date});

                this.props.navigator.setButtons(this.getNavigatorButtons());
                this.props.navigator.setTitle({title: date.format('MMMM Do')});
            }

            render() {
                // console.log(this.state.calendarStripHeight);
                // console.log(this.state);
                return (
                    <View style={{flex: 1}}>
                        {RenderIf(
                            <View style={{flex: 1}}>
                                <CalendarStripStyled
                                    showMonth={false}
                                    style={{elevation: 10}}
                                    padding={10}
                                    date={this.state.date}
                                    noRounding
                                    onDateSelected={this.broadcastDeepLinkForDateChange}
                                />
                            </View>,
                            this.state.shown)}
                        <View style={{flex: 8}}>
                            <BaseScreenComponent
                                {...this.props}
                                date={this.state.date}
                                onNavigatorEvent={this.onNavigatorEvent}
                            />
                        </View>
                    </View>
                );
            }
        }
    );
}

export {ScreenWithCalendarComponent};

