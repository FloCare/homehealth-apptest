import t from 'tcomb-form-native';
import {PhoneNumber, zipCode} from '../../utils/lib';
import Autocompletetextbox from './Autocompletetextbox';
import DiagnosisMultiSelect from './DiagnosisMultiSelect';
import stylesheet from './formStyleSheet';

const AddPatientModel = t.struct({
    name: t.String,
    streetAddress: t.String,
    apartmentNo: t.maybe(t.String),
    zip: zipCode,
    city: t.maybe(t.String),
    primaryContact: PhoneNumber,
    emergencyContact: t.maybe(PhoneNumber),
    diagnosis: t.maybe(t.String),
    notes: t.maybe(t.String)
});

const nameError = (value) => {
    if (!value) {
        return 'Required';
    }
};

const options = {
    stylesheet,
    fields: {
        name: {
            label: 'Patient Name',
            error: nameError,
            placeholder: 'John Doe',
            returnKeyType: 'next',
            autoCapitalize: 'words'
        },
        zip: {
            label: 'Zip Code',
            error: 'Please enter a valid zipCode for the patient',
            placeholder: '123456'
        },
        primaryContact: {
            label: 'Primary Contact',
            placeholder: '9999988888',
        },
        emergencyContact: {
            label: 'Emergency Contact',
            placeholder: '9999988888'
        },
        diagnosis: {
            label: 'Diagnosis',
            placeholder: '#ADHD',
            template: DiagnosisMultiSelect      // Todo: Improve this
        },
        streetAddress: {
            label: 'Street Address',
            placeholder: '32, Private Drive',
            template: Autocompletetextbox       // Todo: Improve this
        },
        apartmentNo: {
            label: 'Apartment No.',
            placeholder: '#482'
        },
        city: {
            label: 'City, State',
            placeholder: 'Los Angeles, CA'
        },
        notes: {
            label: 'Quick Information'
        }
        /*birthDate: {
         mode: 'date',
         config: {
         format: (date) => moment(date).format('YYYY-MM-DD'),
         }
         }*/
    }
};

export { AddPatientModel, options };
