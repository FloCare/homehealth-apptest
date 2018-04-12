import t from 'tcomb-form-native';

const EmailField = t.refinement(t.String, (e) => {
    // Todo Add a proper email validation function or
    // Todo Validate if the below regex works

    // return a boolean representing true/false
    const reg = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    return reg.test(e);
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

PhoneNumber.getValidationErrorMessage = function (value) {
    if (!value) {
        return 'Required';
    }
    const s = value.toString();
    if (!(s.startsWith(6) || s.startsWith(7) || s.startsWith(8) || s.startsWith(9))) {
        return 'Mobile Number should start with 6/7/8/9';
    }
    if (s.length <= 10) {
        return 'Too small my friend';
    }
}

const zipCode = t.refinement(t.Number, (z) => {
   // Todo Add a proper zipCode validation function

    if (z !== null) {
        const s = z.toString();
        if (s.length === 6) {
            return true;
        }
    }
    return false;
});

export { EmailField, PhoneNumber, zipCode };
