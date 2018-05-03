import React, {Component} from 'react';
import {View} from 'react-native';
import {RenderIf} from '../../utils/data/syntacticHelpers';
import {CalendarStripStyled} from './CalendarStripStyled';

function ScreenWithCalendarComponent(BaseScreenComponent) {
    return (
        class CompositeClass extends Component {
            static navigatorButtons = BaseScreenComponent.navigatorButtons;
            constructor(props) {
                super(props);
                this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

                this.state = {
                    date: props.date,
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
                        this.props.navigator.setButtons({
                            ...BaseScreenComponent.navigatorButtons,
                            rightButtons: BaseScreenComponent.navigatorButtons.rightButtons.map(
                                                button => {
                                                    if (!(button.id === 'calendar-picker')) return button;
                                                    return {...button, buttonColor: this.state.shown === false ? 'rgba(255,255,255,0.9)' : 'white'};
                                                })
                        });
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

                if (this.props.onNavigationEvent) {
                    this.props.onNavigationEvent(event);
                }
            }

            broadcastDeepLinkForDateChange(date) {
                this.props.navigator.handleDeepLink({
                    link: 'date',
                    payload: date
                });
                this.setState({shown: false, date});
            }

            render() {
                // console.log(this.state.calendarStripHeight);
                // console.log(this.state);
                return (
                    <View style={{flex: 1}}>
                        {RenderIf(
                            <View style={{flex: 1}}>
                                <CalendarStripStyled
                                    padding={10}
                                    date={this.state.date}
                                    noRounding
                                    onDateSelected={this.broadcastDeepLinkForDateChange}
                                />
                            </View>,
                            this.state.shown)}
                        <View style={{flex: 4}}>
                            <BaseScreenComponent
                                {...this.props}
                                date={this.state.date}
                                onNavigatorEvent={this.onNavigatorEvent.bind(this)}
                            />
                        </View>
                    </View>
                );
            }
        }
    );
}

export {ScreenWithCalendarComponent};

