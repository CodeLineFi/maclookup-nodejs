"use strict";

const request = require("request");
const querystring = require('querystring');
const ResponseModel = require('./models/responseModel');

const VERSION = require("./package.json").version;
const BASE_URL = "https://api.macaddress.io/v1";
const USER_AGENT = "Node.js client library/" + VERSION;
const AUTH_HEADER = "X-Authentication-Token";
const SEARCH_PARAMETER = "search";
const OUTPUT_PARAMETER = "output";
const DEFAULT_OUTPUT = "json";
const VENDOR_NAME_OUTPUT = 'vendor';
const DEPRECATED_HEADER = 'Warning';

const errorsMapping = {
    400: "Unsupported output format",
    401: "Authorization required",
    402: "Not enough credits",
    403: "Access denied",
    422: "Invalid MAC address or OUI"
};


class ApiClient {

    /**
     *
     * @param {string} apiKey
     * @param {string} url
     */
    constructor(apiKey, url) {
        this.apiKey = apiKey;
        this.url = url || BASE_URL;

        this.verifyOptions();
    }

    verifyOptions() {
        if (! this.apiKey) {
            throw new Error("API key required");
        } else if (typeof this.apiKey !== "string") {
            throw new Error("API key must be a string");
        } else if (! this.url || typeof this.url !== "string") {
            throw new Error("url must be a string");
        }
    }

    /**
     *
     * @param {string} mac - MAC address or OUI
     * @param {callback} cb - The callback to run after API request has finished.
     */
    get(mac, cb) {
        let options = {
            url: this.url,
            qs: this._getParameters(mac, DEFAULT_OUTPUT),
            headers: this._getHeaders()
        };

        let handler = this._handleErrorCode;

        request(options, function (err, response, body) {
            if (err) {
                cb(err, null);
            }

            let code = response.statusCode;

            if (handler(code, response.headers, cb))
                return;

            if (! body || body.length <= 0) {
                cb(new Error('Empty response'));
                return;
            }

            cb(null, new ResponseModel(JSON.parse(body)));
        });
    }

    /**
     *
     * @param {string} mac - MAC address or OUI
     * @param {string} format - The response format
     * @param {callback} cb - The callback to run after API request has finished.
     */
    getRawData(mac, format, cb) {
        let options = {
            url: this.url,
            qs: this._getParameters(mac, format),
            headers: this._getHeaders()
        };

        let handler = this._handleErrorCode;

        request(options, function (err, response, body) {
            if (err) {
                cb(err, null);
            }

            let code = response.statusCode;

            if (handler(code, response.headers, cb))
                return;

            if (! body || body.length <= 0) {
                cb(new Error('Empty response'));
                return;
            }

            cb(null, body);
        });
    }

    /**
     *
     * @param {string} mac - MAC address or OUI
     * @param {callback} cb - The callback to run after API request has finished.
     */
    getVendor(mac, cb) {
        let options = {
            url: this.url,
            qs: this._getParameters(mac, VENDOR_NAME_OUTPUT),
            headers: this._getHeaders()
        };

        let handler = this._handleErrorCode;

        request(options, function (err, response, body) {
            if (err) {
                cb(err, null);
            }

            let code = response.statusCode;

            if (handler(code, response.headers, cb))
                return;

            cb(null, body);
        });
    }

    _handleErrorCode(code, headers, cb) {
        if (errorsMapping.hasOwnProperty(code)) {
            cb(new Error(errorsMapping[code]));
            return true;
        }

        if (code < 200 || code > 299) {
            cb(new Error("There was an error when making the API request. Please try again."));
            return true;
        }

        if (headers.hasOwnProperty(DEPRECATED_HEADER.toLowerCase())) {
            process.emitWarning(
                headers[DEPRECATED_HEADER.toLowerCase()],
                'DeprecationWarning'
            );
        }

        return false;
    }

    _getHeaders() {
        let headers = {};
        headers['User-Agent'] = USER_AGENT;
        headers[AUTH_HEADER] = this.apiKey;

        return headers;
    }

    _getParameters(mac, format) {
        let parameters = {};
        parameters[SEARCH_PARAMETER] = mac;
        parameters[OUTPUT_PARAMETER] = format;
        return parameters;
    }
}

module.exports = ApiClient;