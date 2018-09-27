"use strict";

class ResponseModel {
    constructor(response) {
        this.vendorDetails = {
            oui: null,
            isPrivate: null,
            companyName: null,
            companyAddress: null,
            countryCode: null
        };

        this.blockDetails = {
            blockFound: null,
            borderLeft: null,
            borderRight: null,
            blockSize: null,
            assignmentBlockSize: null,
            dateCreated: null,
            dateUpdated: null
        };

        this.macAddressDetails = {
            searchTerm: null,
            isValid: null,
            transmissionType: null,
            administrationType: null
        };

        if (response.hasOwnProperty('vendorDetails')) {
            for (let key in response.vendorDetails) {
                if (this.vendorDetails.hasOwnProperty(key)) {
                    this.vendorDetails[key] = response.vendorDetails[key];
                }
            }
        }

        if (response.hasOwnProperty('blockDetails')) {
            for (let key in response.blockDetails) {
                if (this.blockDetails.hasOwnProperty(key)) {
                    this.blockDetails[key] = response.blockDetails[key];
                }
            }
        }

        if (response.hasOwnProperty('macAddressDetails')) {
            for (let key in response.macAddressDetails) {
                if (this.macAddressDetails.hasOwnProperty(key)) {
                    this.macAddressDetails[key] = response.macAddressDetails[key];
                }
            }
        }
    }
}

module.exports = ResponseModel;