const ApiClient = require('..');
const API_KEY = process.env.API_KEY;


let client = new ApiClient(API_KEY);

client.get('18810E', (err, result) => {
    if (err) {
        console.log(err);
    } else {
        console.log("oui: " + result.vendorDetails.oui);
    }
});
