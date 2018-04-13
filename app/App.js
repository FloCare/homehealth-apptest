import {Navigation} from 'react-native-navigation';
import NewPatient from './components/NewPatient';

Navigation.registerComponent('name', () => NewPatient);

Navigation.startTabBasedApp({
	tabs: [
		{
			label: 'one',
			icon: require('../resources/ic_album_black_36px.svg'),
			screen: 'name'
		}
	]
});
