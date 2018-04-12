import React, { Component } from 'react';
import { View } from 'react-native';
import firebase from 'firebase';
import { Spinner } from './components/common/index';
import { LoginForm } from './components/LoginForm';
import {VisitCard} from "./components/common/visitCard";
import {MyRealm, Patient, Visit, Case} from "./utils/data/schema";
import {VisitsScreenContainer} from './screens/visitsScreenContainer'

class App extends Component {
	state = { loggedIn: null };

	componentDidMount() {
		if (!firebase.apps.length) {
				firebase.initializeApp({
					apiKey: 'AIzaSyCaUACMlm1rLuvkx6dFbi4GbEN45571fOA',
					authDomain: 'auth-6d441.firebaseapp.com',
					databaseURL: 'https://auth-6d441.firebaseio.com',
					projectId: 'auth-6d441',
					storageBucket: 'auth-6d441.appspot.com',
					messagingSenderId: '210401492246'
				});
		}

		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				this.setState({ loggedIn: true });
			} else {
				this.setState({ loggedIn: false });
			}
		});
	}

	renderContent() {
		switch (this.state.loggedIn) {
			case true:
				return (
					<Card>
						<CardSection>
							<Button onPress={() => firebase.auth().signOut()}>
								Log Out!
							</Button>
						</CardSection>
					</Card>
				);
			case false:
				return <LoginForm />;
			default:
				return <Spinner size="large" />;
		}
	}

	render() {
		// MyRealm.write(()=>{MyRealm.create(Case.schema.name, {caseID: 'hsh', patientID: 'xyz', diagnosis: ['prick', 'bass']})});
		// MyRealm.write(()=>{MyRealm.create(Visit.schema.name, {visitID: 'blah', midnightEpoch:0, caseID: 'hsh', isDone: false});MyRealm.create(Patient.schema.name, {patientID:'xyz', name: 'Roger Waters', phoneNumber: 'whatever'})});
		return (
			<View>
				<VisitsScreenContainer midnightEpoch={0}/>
			</View>
		);
	}
}

export default App;
