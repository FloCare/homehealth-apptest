import React, {Component} from 'react';
import {View, PanResponder} from 'react-native';
import {screenNames} from '../../utils/constants';

const LockOnInActivity = (ScreenComponent) => {
	return (
		class CompositeClass extends Component {
			constructor(props) {
				super(props);
				this.state = {
					locked: true
				};
				this.resetTimer = this.resetTimer.bind(this);
				this.openLockScreenModal = this.openLockScreenModal.bind(this);
				this._panResponder = {};
				this.timer = 0;
			}

			componentWillMount() {
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
				this.timer = setTimeout(() => this.setState({locked: false}), 3000);
			}

			componentWillUnMount() {
				this.resetTimer();
			}

			openLockScreenModal() {
				this.props.navigator.showModal({
					screen: screenNames.passcodeVerificationScreen,
					backButtonHidden: true,
					passProps: {
						inactivity: true
					}
				});
			}

			resetTimer() {
				clearTimeout(this.timer);
				if (!this.state.locked) {
					console.log('Inverting this.state.locked to true');
					this.setState({locked: true});
					this.openLockScreenModal();
				}
				console.log('Reset Timer to 3s. Set State locked to false');
				this.timer = setTimeout(() => this.setState({locked: false}), 3000);
			}

			render() {
				return (
					<View style={{flex: 1}} {...this._panResponder.panHandlers}>
						<ScreenComponent {...this.props} />
					</View>
				);
			}
		}
	);
};

export default LockOnInActivity;
