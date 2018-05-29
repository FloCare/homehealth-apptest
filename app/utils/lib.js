import t from 'tcomb-form-native';

const EmailField = t.refinement(t.String, (e) => {
    // Todo Add a proper email validation function or
    // Todo Validate if the below regex works

    // return a boolean representing true/false
    const reg = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    return reg.test(e);
});

//const phoneValidationRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
const phoneValidationRegex = /^\d{10}$/;

const PhoneNumber = t.refinement(t.String, (n) => {
    // Todo Add a proper phone number validation function

    if (n !== null) {
        if (phoneValidationRegex.test(n)) {
            return true;
        } else {
            return false;
        }
    }
});

const parsePhoneNumber = (number) => {
    //return number.replace(phoneValidationRegex, '($1) $2-$3');
    return number;
};

PhoneNumber.getValidationErrorMessage = function (value) {
    if (!value) {
        return 'Required';
    }
    const s = value.toString();
    if (isNaN(s)) {
        return 'Contact Number can only contain numerics';
    }
    if (s.length < 10) {
        return 'Contact Number incomplete';
    }
    if (s.length > 10) {
        return 'Contact Number too long';
    }
};

const zipCode = t.refinement(t.String, (z) => {
    if (z !== null) {
        const isValid = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(z);
        return isValid;
    }
    return false;
});

export {EmailField, PhoneNumber, zipCode, parsePhoneNumber};
