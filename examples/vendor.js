const ApiClient = require('..');
const API_KEY = process.env.API_KEY;


let client = new ApiClient(API_KEY);


client.getVendor('18810E', (err, result) => {
    if (err) {
        console.log(err);
    } else {
        console.log(result);
    }
});