import React, { Component } from 'react';
import { Text } from 'react-native';
import firebase from 'firebase';
//import Realm from 'realm';
import { Button, Card, CardSection, Input, Spinner } from './common';
//import { writeCredentialsToDB, getAllLocalCredentials } from '../daos/credentialsDao';
//import { CredentialSchema } from '../schemas';
import realm from './realm';

// const CredentialSchema = {
//     name: 'Credential',
//     properties: {
//         username: 'string',
//         pass: 'string'
//     }
//};

function writeCredentialsToDB(credential) {
	console.log('inside write function');
	//console.log(realm.objects('CredentialSchema'));
	// Realm.open({ schema: [CredentialSchema] })
	// .then(realm => {
	// 	realm.write(() => realm.create(CredentialSchema.name, credential));
	// });
	realm.write(() => {
		realm.create('CredentialSchema', credential);
	});
	console.log('leaving write function');
}

function getAllLocalCredentials() {
    // Realm.open({ schema: [CredentialSchema] })
    // .then(realm => {
    //     realm.objects('CredentialSchema');
    // });
    console.log('inside get function');
    console.log(realm.objects('CredentialSchema'));
    console.log('leaving get function');
    return realm.objects('CredentialSchema');
}

// Phone verification using Twilio
// https://www.npmjs.com/package/react-native-twilio

class LoginForm extends Component {
	state = { email: '', password: '', error: '', loading: false };

	onLoginSuccess() {
		const { email, password } = this.state;

		console.log('Writing credentials to DB ...');
		writeCredentialsToDB({ 
			username: email, 
			pass: password
		});

		this.setState({ 
			email: '',
			password: '',
			loading: false,
			error: ''
		});

		getAllLocalCredentials();
	}

	onLoginFail() {
		this.setState({ error: 'Authentication Failed.', loading: false });
	}

	onButtonPress() {
		const { email, password } = this.state;

		this.setState({ error: '', loading: true });

		firebase.auth().signInWithEmailAndPassword(email, password)
			.then(this.onLoginSuccess.bind(this))
			.catch(() => {
				firebase.auth().createUserWithEmailAndPassword(email, password)
					.then(this.onLoginSuccess.bind(this))
					.catch(this.onLoginFail.bind(this));
			});
	}

	renderButton() {
		if (this.state.loading) {
			return <Spinner size="small" />;
		}
		
		return (
			<Button onPress={this.onButtonPress.bind(this)}>
				Log In
			</Button>
		);
	}

	render() {
		return (
			<Card>
				<CardSection>
					<Input 
						label="Email"
						placeholder="user@email.com"
						value={this.state.email}
						onChangeText={(text) => this.setState({ email: text })}
					/>
				</CardSection>

				<CardSection>
					<Input 
						secureTextEntry
						label="Password"
						placeholder="password"
						value={this.state.password}
						onChangeText={(text) => this.setState({ password: text })}
					/>
				</CardSection>

				<Text style={styles.errorTextStyle}>
					{this.state.error}
				</Text>

				<CardSection>
					{this.renderButton()}
				</CardSection>
			</Card>
		);
	}
}

const styles = {
	errorTextStyle: {
		fontSize: 20,
		alignSelf: 'center',
		color: 'red'
	}
};


export { LoginForm };
