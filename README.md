# MacAddress.io API client library in Node.js

Comprehensive and up-to-date data provided directly 
from the IEEE Standards Association

# Installing

```bash
npm install @codelinefi/maclookup
```

# Requirements

* Node 6 or higher


# Documentation

Full API documentation available [here](https://macaddress.io/api-documentation)


## Getting started

### Basic usage

```js

const ApiClient = require('@codelinefi/maclookup');
let client = new ApiClient('Your API key');

client.get('18810E', function (err, result) {
    if (err) {
        console.log(err);
    } else {
        console.log(result);
    }
});


client.getRawData('18810E', 'xml', function (err, result) {
    if (err) {
        console.log(err);
    } else {
        console.log(result);
    }
});

client.getVendor('18810E', function (err, result) {
    if (err) {
        console.log(err);
    } else {
        console.log(result);
    }
});


// Response
ResponseModel {
  vendorDetails: 
   { oui: '18810E',
     isPrivate: false,
     companyName: 'Apple, Inc',
     companyAddress: '1 Infinite Loop Cupertino  CA  95014 US',
     countryCode: 'US' },
  blockDetails: 
   { blockFound: true,
     borderLeft: '18810E0000000000',
     borderRight: '18810EFFFFFFFFFF',
     blockSize: 1099511627776,
     assignmentBlockSize: 'MA-L',
     dateCreated: '2018-06-28',
     dateUpdated: '2018-06-28' },
  macAddressDetails: 
   { searchTerm: '18810E',
     isValid: false,
     transmissionType: 'multicast',
     administrationType: 'LAA' 
   } 
}

<Response>
	<vendorDetails>
		<oui>18810E</oui>
		<isPrivate>false</isPrivate>
		<companyName>Apple, Inc</companyName>
		<companyAddress>1 Infinite Loop Cupertino  CA  95014 US</companyAddress>
		<countryCode>US</countryCode>
	</vendorDetails>
	<blockDetails>
		<blockFound>true</blockFound>
		<borderLeft>18810E0000000000</borderLeft>
		<borderRight>18810EFFFFFFFFFF</borderRight>
		<blockSize>1099511627776</blockSize>
		<assignmentBlockSize>MA-L</assignmentBlockSize>
		<dateCreated>2018-06-28</dateCreated>
		<dateUpdated>2018-06-28</dateUpdated>
	</blockDetails>
	<macAddressDetails>
		<searchTerm>18810E</searchTerm>
		<isValid>false</isValid>
		<transmissionType>multicast</transmissionType>
		<administrationType>LAA</administrationType>
	</macAddressDetails>
</Response>

Apple, Inc
```

## Running examples

To run examples, you need to specify the API_KEY environment variable:

```bash
export API_KEY='<your API KEY>'
node basic.js
...
```

## Classes

### ApiClient class

```js
/**
 *
 * @param {string} apiKey
 * @param {string} url
 */
constructor(apiKey, url)

/**
 *
 * @param {string} mac - MAC address or OUI
 * @param {callback} cb - The callback to run after API request has finished.
 */
get(mac, cb)

/**
 *
 * @param {string} mac - MAC address or OUI
 * @param {string} format - The response format
 * @param {callback} cb - The callback to run after API request has finished.
 */
getRawData(mac, format, cb)

/**
 *
 * @param {string} mac - MAC address or OUI
 * @param {callback} cb - The callback to run after API request has finished.
 */
getVendor(mac, cb)    
```
### Models

#### ResponseModel
Sample response object. Be careful, some fields could be **null**
```js
response = {
  vendorDetails: { 
     oui: '18810E',
     isPrivate: false,
     companyName: 'Apple, Inc',
     companyAddress: '1 Infinite Loop Cupertino  CA  95014 US',
     countryCode: 'US' 
  },
  blockDetails: { 
     blockFound: true,
     borderLeft: '18810E0000000000',
     borderRight: '18810EFFFFFFFFFF',
     blockSize: 1099511627776,
     assignmentBlockSize: 'MA-L',
     dateCreated: '2018-06-28',
     dateUpdated: '2018-06-28' 
  },
  macAddressDetails: { 
     searchTerm: '18810E',
     isValid: false,
     transmissionType: 'multicast',
     administrationType: 'LAA' 
  }
}
```


**Be careful! This library may emit a warning if the server responses with Deprecation Warning**

```bash
(node:3627) DeprecationWarning: 299 - "Deprecated API Version"
```

# Development

To run tests you need to execute the following commands:

```bash
npm install -D
export API_KEY='test'
npm test
```
