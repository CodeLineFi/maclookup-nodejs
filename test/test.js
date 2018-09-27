"use strict";

const assert = require("assert");
const ApiClient = require("..");
const nock = require('nock');

const API_KEY = process.env.API_KEY;

describe("ApiClient", () => {
    describe("#verifyOptions()", () => {
        it("should throw an error if no API key is supplied", () => {
            assert.throws(() => { new ApiClient(); }, "API key required");
        });

        it("should throw an error if bad API key is supplied", () => {
            assert.throws(() => { new ApiClient(123); }, "API key must be a string");
        });

        it("should throw an error if bad url is supplied", () => {
            assert.throws(() => { new ApiClient("api key", 123); }, "url must be a string");
        });
    });

    describe("#get()", () => {
        it("should return an error if API key is invalid", (done) => {
            nock('https://api.macaddress.io',
                {
                    reqheaders: {
                        'X-Authentication-Token': 'invalidkey'
                    }
                })
                .get('/v1?search=18810E&output=json')
                .reply(403);

            let client = new ApiClient("invalidkey");

            client.get("18810E", (err, resp) => {
                assert(typeof err.message === "string");
                done();
            });
        });

        it("should return a response", (done) => {
            nock('https://api.macaddress.io',
                {
                    reqheaders: {
                        'X-Authentication-Token': '' + API_KEY
                    }
                })
                .get('/v1?search=18810E&output=json')
                .reply(200, {
                    "vendorDetails": {
                        "oui": "18810E",
                        "isPrivate": false,
                        "companyName": "Shenzhen Bilian Electronic Co，Ltd",
                        "companyAddress": "NO.268， Fuqian Rd, Jutang community, Guanlan Town, Longhua New district shenzhen  guangdong  518000 CN",
                        "countryCode": "CN"
                    },
                    "blockDetails": {
                        "blockFound": true,
                        "borderLeft": "08EA400000000000",
                        "borderRight": "08EA40FFFFFFFFFF",
                        "blockSize": 1099511627776,
                        "assignmentBlockSize": "MA-L",
                        "dateCreated": "",
                        "dateUpdated": ""
                    },
                    "macAddressDetails": {
                        "searchTerm": "18810E",
                        "isValid": true,
                        "transmissionType": "multicast",
                        "administrationType": "LAA"
                    }
                });

            let client = new ApiClient(API_KEY);

            client.get("18810E", (err, resp) => {
                assert.ifError(err);
                assert.equal(resp.macAddressDetails.searchTerm, "18810E");
                done();
            });
        });
        it("Should return an error if invalid MAC or OUI provided", (done) => {
            nock('https://api.macaddress.io',
                {
                    reqheaders: {
                        'X-Authentication-Token': API_KEY
                    }
                })
                .get('/v1?search=1881OE&output=json')
                .reply(422);

            let client = new ApiClient(API_KEY);

            client.get("1881OE", (err, resp) => {
                assert(err.message === "Invalid MAC address or OUI");
                done();
            });
        });
        it("Should return an error if not enough credits", (done) => {
            nock('https://api.macaddress.io',
                {
                    reqheaders: {
                        'X-Authentication-Token': API_KEY
                    }
                })
                .get('/v1?search=18810E&output=json')
                .reply(402);

            let client = new ApiClient(API_KEY);

            client.get("18810E", (err, resp) => {
                assert(err.message === "Not enough credits");
                done();
            });
        });
        it("Should return an error if there API problems", (done) => {
            nock('https://api.macaddress.io',
                {
                    reqheaders: {
                        'X-Authentication-Token': API_KEY
                    }
                })
                .get('/v1?search=18810E&output=json')
                .reply(500);

            let client = new ApiClient(API_KEY);

            client.get("18810E", (err, resp) => {
                assert(
                    err.message
                    ===
                    "There was an error when making the API request. "
                    + "Please try again."
                );
                done();
            });
        });
        it("Should return an error if server returns empty response",
            (done) => { nock('https://api.macaddress.io',
                {
                    reqheaders: {
                        'X-Authentication-Token': API_KEY
                    }
                })
                .get('/v1?search=18810E&output=json')
                .reply(200);

            let client = new ApiClient(API_KEY);

            client.get("18810E", (err, resp) => {
                assert(err.message === "Empty response");
                done();
            });
        });
    });
    describe("#getRawData()", () => {

        it("should return a response", (done) => {
            nock('https://api.macaddress.io',
                {
                    reqheaders: {
                        'X-Authentication-Token': API_KEY
                    }
                })
                .get('/v1?search=18810E&output=xml')
                .reply(200, '<Response> \
                    <vendorDetails> \
                    <oui>F40F24</oui> \
                    <isPrivate>false</isPrivate> \
                    <companyName>Apple, Inc</companyName> \
                    <companyAddress>1 Infinite Loop Cupertino  CA  95014 US</companyAddress> \
            <countryCode>US</countryCode> \
            </vendorDetails> \
            <blockDetails>\
            <blockFound>true</blockFound>\
            <borderLeft>F40F240000000000</borderLeft>\
            <borderRight>F40F24FFFFFFFFFF</borderRight>\
            <blockSize>1099511627776</blockSize>\
            <assignmentBlockSize>MA-L</assignmentBlockSize>\
            <dateCreated></dateCreated>\
            <dateUpdated></dateUpdated>\
            </blockDetails>\
            <macAddressDetails>\
            <searchTerm>F40F2436DA57</searchTerm>\
            <isValid>true</isValid>\
            <transmissionType>multicast</transmissionType>\
            <administrationType>LAA</administrationType>\
            </macAddressDetails>\
            </Response>\
            ');


            let client = new ApiClient(API_KEY);

            client.getRawData("18810E", "xml", (err, resp) => {
                assert.ifError(err);
                assert.ok(resp.length > 0);
                done();
            });
        });
        it("Should return an error if invalid unknown output type provided",
            (done) => { nock('https://api.macaddress.io',
                {
                    reqheaders: {
                        'X-Authentication-Token': API_KEY
                    }
                })
                .get('/v1?search=1881OE&output=JPEG')
                .reply(400);

            let client = new ApiClient(API_KEY);

            client.getRawData("1881OE", 'JPEG', (err, resp) => {
                assert(err.message === "Unsupported output format");
                done();
            });
        });
        it("Should return an error if server returns empty response",
            (done) => { nock('https://api.macaddress.io',
                {
                    reqheaders: {
                        'X-Authentication-Token': API_KEY
                    }
                })
                .get('/v1?search=18810E&output=json')
                .reply(200);

            let client = new ApiClient(API_KEY);

            client.getRawData("18810E", 'json', (err, resp) => {
                assert(err.message === "Empty response");
                done();
            });
        });
    });

    describe("#getVendor()", () => {

        it("should return a response", (done) => {

            nock('https://api.macaddress.io',
                {
                    reqheaders: {
                        'X-Authentication-Token': API_KEY
                    }
                })
                .get('/v1?search=18810E&output=vendor')
                .reply(200, 'Apple, Inc.');

            let client = new ApiClient(API_KEY);

            client.getVendor("18810E", (err, resp) => {
                assert.ifError(err);
                assert.ok(resp.length > 0);
                done();
            });
        });
        it("should return an error", (done) => {

            nock('https://api.macaddress.io',
                {
                    reqheaders: {
                        'X-Authentication-Token': API_KEY
                    }
                })
                .get('/v1?search=18810E&output=vendor')
                .reply(500);

            let client = new ApiClient(API_KEY);

            client.getVendor("18810E", (err, resp) => {
                assert.ok(err.message.length > 0);
                done();
            });
        });
    });
});

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}