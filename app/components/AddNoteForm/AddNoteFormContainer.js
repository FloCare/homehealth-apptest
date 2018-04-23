import React, {Component} from 'react';
import {View, Text, TextInput} from 'react-native';
import {Button} from 'react-native-elements';
import {floDB, Patient} from '../../utils/data/schema';
import styles from './styles';

class AddNoteFormContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            note: null
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        this.fetchNotes = this.fetchNotes.bind(this);
    }

    componentDidMount() {
        this.fetchNotes(this.props.patientId);
    }

    onChangeText(note) {
        this.setState({
            note
        });
    }

    handleSubmit(e, patientId, onSubmit) {
        console.log('Saving the editted note to DB ...');
        // Save/Update note to DB
        floDB.write(() => {
            floDB.create(
                Patient.schema.name,
                {
                    patientID: patientId,
                    notes: this.state.note
                },
                true
            );
        });
        console.log('Saved ...');

        onSubmit(patientId);
    }

    fetchNotes(patientId) {
        if (patientId) {
            const patientDetails = floDB.objects(Patient.schema.name).filtered('patientID = $0', patientId);
            const note = patientDetails[0].notes;
            this.setState({
                note
            });
        } else {
            this.setState({
                note: null
            });
        }
    }

    render() {
        const {onSubmit, patientId, name} = this.props;
        if (patientId) {
            // render form with patientName set
            return (
                <View>
                    <View><Text>{name}</Text></View>
                    <TextInput
                        multiline
                        numberOfLines={10}
                        onChangeText={this.onChangeText}
                        value={this.state.note}
                    />
                    <Button
                        buttonStyle={styles.buttonStyle}
                        title='Save'
                        onPress={(e) => this.handleSubmit(e, patientId, onSubmit)}
                    />
                </View>
            );
        } else {
            // render autocomplete for patient Search
            return (
               <View>
                   <Text>
                       To Be Implemented.
                       Allow for search patient with dropdown for autocomplete (selecting patient).
                   </Text>
               </View>
            );
        }
    }
}

export {AddNoteFormContainer};
