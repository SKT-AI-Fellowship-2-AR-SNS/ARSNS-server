const request = require('request');
const fs = require('fs');
const http = require("https");
module.exports = {
    sirvUpload: (image, token)=>{
        // return new Promise((resolve, reject)=>{
        //     console.log(image);

        //     // let formData = {
        //     //     'image' : fs.createReadStream(`${image}`)
        //     // }
        //     // console.log(formData);

        //     // let options = {
        //     //     "method": "POST",
        //     //     "uri" : `https://api.sirv.com/v2/files/upload?filename=%2F`+"test2.jpg", 
        //     //     "headers": {
        //     //         "content-type": "image/jpeg",
        //     //         "authorization": `Bearer ${token}`
        //     //     },
        //     //     "body" : formData,
        //     //     'json' : true
        //     // };
        //     ;
        //     let options = {
        //         method : 'POST',
        //         url : 'https://api.sirv.com/v2/files/upload?filename=%2F',
        //         qs : {
        //             'filename' : `${image}`
        //         },
        //         headers : {
        //             'content-type' : 'image/jpeg',
        //             'authorization': `Bearer ${token}`
        //         },
        //         'json' : true
        //     };

        //     request(options, async (err, result)=>{
        //         if(err) {
        //             console.log('request err : ' + err);
        //             reject(err)
        //         }
        //         else{
        //             resolve(result);
        //         } 
        //     })
        // })

        fs.readFile(image, (err, fileData) => {
            if (err) throw err;
        
            // console.log(image);
            var options = {
            "method": "POST",
            "hostname": "api.sirv.com",
            "port": null,
            "path": "/v2/files/upload?filename=%2F" + "temp6.jpg",
            "headers": {
                "content-type": "application/json",
                "authorization": `Bearer ${token}`
            }
            };
        
        var req = http.request(options, function (res) {
            var chunks = [];
            res.on("data", function (chunk) {
                chunks.push(chunk);
            });
        
            res.on("end", function () {
                var body = Buffer.concat(chunks);
                // console.log(body.toString());
            });
        });
        
        req.write(fileData);
            req.end();
        })
    }
};