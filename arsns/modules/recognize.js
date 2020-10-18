const request = require('request');
const fs = require('fs');
const appid = "FHJEF7O455";
const groupid = "SMB2NA4ND0";
const got = require("got");
const PNG = require("png-js");
const https = require('https');

module.exports = {
    recognize: (image)=>{
        return new Promise((resolve, reject)=>{
            // console.log("5 image:", image);

            let formData = {
                'image' : fs.createReadStream(`${image}`)
            }
            // console.log(formData);

            let options = {
                'method' : 'POST',
                'url' : `https://stg-va.sktnugu.com/api/v1/face/recognize`, 
                'headers': {
                    'content-type': "image/jpeg",
                    'app-id' : `${appid}`,
                    'group-id' : `${groupid}`,
                },
                'formData' : formData,
                'json' : true
            };
            
            request(options, async (err, result)=>{
                console.log('얼굴인식결과 : ', result.body.subject_name);
                if(err) {
                    console.log('request err : ' + err);
                    reject(err)
                }
                else{
                    resolve(result.body.subject_name);
                } 
            })
        })
    }
};