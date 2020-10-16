const request = require('request');
const fs = require('fs');
const http = require("https");
module.exports = {
    sirvUpload: (image, token)=>{
        console.log("2 파일업로드");
        fs.readFile(image, (err, fileData) => {
            if (err) throw err;
            
            var options = {
            "method": "POST",
            "hostname": "api.sirv.com",
            "port": null,
            // "path": "/v2/files/upload?filename=%2F" + "test.jpg",
            "path": "/v2/files/upload?filename=%2F" + `${image}`,
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
        return image;
    }
};