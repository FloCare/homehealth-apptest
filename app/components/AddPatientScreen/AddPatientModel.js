import t from 'tcomb-form-native';
import { PhoneNumber, zipCode } from '../../utils/lib';

const AddPatientModel = t.struct({
    name: t.String,
    streetAddress: t.maybe(t.String),
    zip: zipCode,
    city: t.maybe(t.String),
    primaryContact: PhoneNumber,
    emergencyContact: t.maybe(PhoneNumber),
    diagnosis: t.maybe(t.String),
    notes: t.maybe(t.String)
});

const options = {
    fields: {
        name: {
            label: 'Patient Name',
            error: 'Please enter a valid name for the patient',
        },
        zip: {
            label: 'Zip Code',
            error: 'Please enter a valid zipCode for the patient',
        },
        primaryContact: {
            label: 'Primary Contact',
            error: 'Please enter a valid primary contact number for the patient',
        },
        emergencyContact: {
            label: 'Emergency Contact',
        },
        diagnosis: {
            label: 'Diagnosis',
        },
        streetAddress: {
            label: 'Street Address',
        },
        city: {
            label: 'City, State',
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
