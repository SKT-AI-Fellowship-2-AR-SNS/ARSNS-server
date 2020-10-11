const request = require('request');
const fs = require('fs');
const http = require("https");
module.exports = {
    countFace: (filename)=>{
        return new Promise((resolve, reject)=>{
            console.log("2 얼굴크롭");
            let options = {
                'method' : 'GET',
                // 'url' : `https://agendent.sirv.com/test.jpg?crop.type=face&info`,
                'url' : "https://agendent.sirv.com/" + `${filename}` + "?crop.type=face&info",
                "headers": {
                    "content-type": "application/json",
                    "Transfer-Encoding" : "chunked",
                },
                'json' : true
            };
            
            request(options, async (err, result)=>{
                console.log(result.body.processingSettings.crop.faces.faces);
                if(err) {
                    console.log('request err : ' + err);
                    reject(err)
                }
                else{
                    resolve(result.body.processingSettings.crop.faces.faces);
                } 
            })
        })
    }
};