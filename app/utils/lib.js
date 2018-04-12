import t from 'tcomb-form-native';

const EmailField = t.refinement(t.String, (e) => {
    // Todo Add a proper email validation function

    // return a boolean representing true/false
    // true if string contains '@' and '.'
    if (e !== null && e !== '') {
        return (e.includes('@') && e.includes('.'));
    }
});

const PhoneNumber = t.refinement(t.Number, (n) => {
    // Todo Add a proper phone number validation function

    if (n !== null) {
        const s = n.toString();
        if (s.length === 10 &&
            (s.startsWith(6) || s.startsWith(7) || s.startsWith(8) || s.startsWith(9))) {
            return true;
        }
        return false;
    }
});

const zipCode = t.refinement(t.Number, (z) => {
   // Todo Add a proper zipCode validation function

    if (z !== null) {
        const s =  z.toString();
        if (s.length === 6) {
            return true;
        }
    }
    return false;
});

export { EmailField, PhoneNumber, zipCode };
