// import React, { Component } from 'react';
// import { View } from 'react-native';
// import firebase from 'firebase';
// import { Header, Button, Spinner, Card, CardSection } from './components/common/index';
// import { LoginForm } from './components/LoginForm';
// import NewPatient from "./components/NewPatient";
//
// class App extends Component {
// 	state = { loggedIn: null };
//
// 	componentDidMount() {
// 		if (!firebase.apps.length) {
// 				firebase.initializeApp({
// 					apiKey: 'AIzaSyCaUACMlm1rLuvkx6dFbi4GbEN45571fOA',
// 					authDomain: 'auth-6d441.firebaseapp.com',
// 					databaseURL: 'https://auth-6d441.firebaseio.com',
// 					projectId: 'auth-6d441',
// 					storageBucket: 'auth-6d441.appspot.com',
// 					messagingSenderId: '210401492246'
// 				});
// 		}
//
// 		firebase.auth().onAuthStateChanged((user) => {
// 			if (user) {
// 				this.setState({ loggedIn: true });
// 			} else {
// 				this.setState({ loggedIn: false });
// 			}
// 		});
// 	}
//
// 	renderContent() {
// 		switch (this.state.loggedIn) {
// 			case true:
// 				return (
// 					<Card>
// 						<CardSection>
// 							<Button onPress={() => firebase.auth().signOut()}>
// 								Log Out!
// 							</Button>
// 						</CardSection>
// 					</Card>
// 				);
// 			case false:
// 				return <LoginForm />;
// 			default:
// 				return <Spinner size="large" />;
// 		}
// 	}
//
// 	render() {
// 		return (
// 			<View>
// 				<Header headerText='New Patient' />
// 				<NewPatient />
// 			</View>
// 		);
// 	}
// }
//
// export default App;

import React from 'react';
import AddPatientScreenContainer from './screens/AddPatientScreenContainer';

const App = () => {
    return (
        <AddPatientScreenContainer />
    );
};

export default App;
