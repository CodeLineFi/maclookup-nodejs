const ApiClient = require('..');
let fs = require('fs');
const API_KEY = process.env.API_KEY;


let client = new ApiClient(API_KEY);


client.getRawData('18810E', 'csv', (err, result) => {
    if (err) {
        console.log(err);
    } else {
        fs.writeFile("result.csv", result, function(err) {
            if(err) {
                return console.log(err);
            }

            console.log("The file was saved!");
        });
    }
});