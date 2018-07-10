const Realm = require('realm');

// Todo: Check if inverse relationship needed

// Address can belong to a 'patient' or a 'Place'
export class Address extends Realm.Object {

    static getSchemaName(){
        return 'Address';
    }

    get formattedAddressForGeocoding() {
        let addr = '';
        if (this.apartmentNo) {
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

    get formattedAddress() {
        let addr = this.formattedAddressForGeocoding;
        if (this.zipCode) {
            addr += ` ${this.zipCode}`;
        }
        if (this.state) {
            addr += `, ${this.state}`;
        }
        return addr;
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
}