import React, {Component} from 'react';
import {View, PanResponder} from 'react-native';
import {screenNames, setInActivityTimer, clearInActivityTimer} from '../../utils/constants';

const LockOnInActivity = (ScreenComponent) => {
	return (
		class CompositeClass extends Component {
			static navigatorButtons = ScreenComponent.navigatorButtons;
			constructor(props) {
				super(props);
				this.state = {
					//show: false
				};
				this.onNavigatorEvent = this.onNavigatorEvent.bind(this);
				this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
				this.resetTimer = this.resetTimer.bind(this);
				this.openLockScreenModal = this.openLockScreenModal.bind(this);
				this._panResponder = {};
				this.timer = 0;
			}

			componentDidMount() {
				console.log('==============================');
				console.log('Creating Pan Responder');
				console.log('==============================');
				this._panResponder = PanResponder.create({
					onStartShouldSetPanResponder: () => {
						this.resetTimer();
						return true;
					},
					onMoveShouldSetPanResponder: () => {
						this.resetTimer();
						return true;
					},
					onStartShouldSetPanResponderCapture: () => { this.resetTimer(); return false; },
					onMoveShouldSetPanResponderCapture: () => false,
					onPanResponderTerminationRequest: () => true,
					onShouldBlockNativeResponder: () => false,
				});
				//this.timer = setTimeout(() => this.setState({show: true}), 3000);
				setInActivityTimer(this.openLockScreenModal);
			}

			onNavigatorEvent(event) {
				if (this.props.onNavigationEvent) {
                    this.props.onNavigationEvent(event);
                }

				// if (event.id === 'didAppear') {
				// 	//this.timer = setTimeout(() => this.setState({show: true}), 3000);
				// 	this.resetTimer();
				// }
				// if (event.id === 'didDisappear') {
				// 	clearTimeout(this.timer);
				// }
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
				console.log('Reset Timer to 3s.');
				clearInActivityTimer();
				//lastActiveTime = new Date();
				setInActivityTimer(this.openLockScreenModal);
			}

			// resetTimer() {
			// 	clearTimeout(this.timer);
			// 	if (this.state.show) {
			// 		console.log('Inverting this.state.show to false');
			// 		this.setState({show: false});
			// 	}
			// 	console.log('Reset Timer to 3s. Set State show to true');
			// 	this.timer = setTimeout(() => this.setState({show: true}), 3000);
			// }

			render() {
				return (
					<View style={{flex: 1}} {...this._panResponder.panHandlers}>
						<ScreenComponent 
							{...this.props} 
							onNavigatorEvent={this.onNavigatorEvent}
							resetTimer={this.resetTimer}
						/>
					</View>
				);
			}
		}
	);
};

export default LockOnInActivity;
