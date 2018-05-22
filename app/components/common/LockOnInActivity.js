import React, {Component} from 'react';
import {Text, View, PanResponder} from 'react-native';
import {screenNames} from '../../utils/constants';

const LockOnInActivity = (ScreenComponent) => {
	return (
		class CompositeClass extends Component {
			static navigatorButtons = ScreenComponent.navigatorButtons;
			constructor(props) {
				super(props);
				this.state = {
					show: false
				};
				this.resetTimer = this.resetTimer.bind(this);
				this.openLockScreenModal = this.openLockScreenModal.bind(this);
				this._panResponder = {};
				this.timer = 0;
				this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
			}

			// Todo: Move to screen did Appear from componentDidMount
			onNavigatorEvent(event) {
				console.log('==============================');
				console.log('Navigator Event received by LockOnInActivity');
				console.log('==============================');

				if (this.props.onNavigationEvent) {
                    this.props.onNavigationEvent(event);
                }

				if (event.id === 'didAppear') {
					console.log('==============================');
					console.log('Creating Pan Responder');
					console.log('==============================');
					this._panResponder = PanResponder.create({
						onStartShouldSetPanResponder: () => {
							this.resetTimer();
							return true;
						},
						onMoveShouldSetPanResponder: () => true,
						onStartShouldSetPanResponderCapture: () => { this.resetTimer(); return false; },
						onMoveShouldSetPanResponderCapture: () => false,
						onPanResponderTerminationRequest: () => true,
						onShouldBlockNativeResponder: () => false,
					});
					this.timer = setTimeout(() => this.setState({show: true}), 3000);
				}
				if (event.id === 'didDisappear') {
					clearTimeout(this.timer);
				}
			}

			openLockScreenModal() {
				this.props.navigator.showModal({
					screen: screenNames.passcodeVerificationScreen,
					backButtonHidden: true,
					passProps: {
						inactivity: true
					},
					overrideBackPress: true,
					animationType: 'none'
				});
			}

			resetTimer() {
				clearTimeout(this.timer);
				if (this.state.show) {
					console.log('Inverting this.state.show to false');
					this.setState({show: false});
				}
				console.log('Reset Timer to 3s. Set State show to true');
				this.timer = setTimeout(() => this.setState({show: true}), 3000);
			}

			render() {
				if (this.state.show) {
					console.log('======================');
					console.log('Show is: true');
					console.log('======================');
					this.openLockScreenModal();
				}
				return (
					<View style={{flex: 1}} {...this._panResponder.panHandlers}>
						<ScreenComponent 
							{...this.props} 
							onNavigatorEvent={this.onNavigatorEvent}
						/>
					</View>
				);
			}
		}
	);
};

export default LockOnInActivity;
