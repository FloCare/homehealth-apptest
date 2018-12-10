const Realm = require('realm');

// Todo: Check if inverse relationship needed

// Address can belong to a 'patient' or a 'Place'
export class Address extends Realm.Object {

    static getSchemaName() {
        return 'Address';
    }

    getFormattedAddressForGeoCoding(includeApartmentNo = true) {
        let addr = '';
        if (includeApartmentNo && this.apartmentNo) {
            addr += `${this.apartmentNo}, `;
        }
        if (this.streetAddress) {
            addr += `${this.streetAddress}`;
        }
        if (this.city) {
            addr += `, ${this.city}`;
        }
        return addr;
    }

    get formattedAddressForGeocoding() {
        return this.getFormattedAddressForGeoCoding();
    }

    getFormattedAddress(includeApartmentNo = true) {
        let addr = this.getFormattedAddressForGeoCoding(includeApartmentNo);
        if (this.zipCode) {
            addr += ` ${this.zipCode}`;
        }
        if (this.state) {
            addr += `, ${this.state}`;
        }
        return addr;
    }

    get formattedAddress() {
        return this.getFormattedAddress();
    }

    get navigationAddress() {
        return this.getFormattedAddress(false);
    }

    get formattedCompleteAddress() {
        let addr = this.formattedAddress;
        if (this.country) {
            addr += `, ${this.country}`;
        }
        return addr;
    }

    get coordinates() {
        if (!(this.latitude && this.longitude)) { return null; }
        return {
            latitude: this.latitude,
            longitude: this.longitude
        };
    }

    set coordinates(coordinates) {
        this.latitude = coordinates.latitude;
        this.longitude = coordinates.longitude;
    }

    getCommaSeperatedCoordinates() {
        return `${this.latitude},${this.longitude}`;
    }

    hasCoordinates() {
        return !!((
            (this.latitude !== null) &&
            (this.longitude !== null)
        ));
    }

    static minifiedAddress = (addressString) => {
        const maxAddressCharacters = 17;
        if (addressString.length > maxAddressCharacters) {
            return `${addressString.substr(0, maxAddressCharacters)}...`;
        }
        return addressString;
    }
}