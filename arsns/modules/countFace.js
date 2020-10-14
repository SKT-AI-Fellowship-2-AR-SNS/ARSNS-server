const request = require('request');
const fs = require('fs');
const http = require("https");
module.exports = {
    countFace: (filename)=>{
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                // console.log("3-1 얼굴만 크롭");
                // console.log("filename: ", filename);
                let path = filename.substring(7);
                // console.log(path);
                let options = {
                    'method' : 'GET',
                    // 'url' : `https://agendent.sirv.com/test.jpg?crop.type=face&info`,
                    'url' : "https://agendent.sirv.com/upload%5C" + `${path}` + "?crop.type=face&info",
                    "headers": {
                        "content-type": "application/json",
                        "Transfer-Encoding" : "chunked",
                    },
                    'json' : true
                };
                
                request(options, async (err, result)=>{
                    // console.log(result);
                    console.log('3-2 얼굴개수: ', result.body.processingSettings.crop.faces.faces.length);
                    if(err) {
                        console.log('request err : ' + err);
                        reject(err)
                    }
                    else{
                        resolve(result.body.processingSettings.crop.faces.faces.length);
                    } 
                })
            },3000)
        })
    }
};