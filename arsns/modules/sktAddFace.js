const request = require('request');
// const ak = '5a088102e812f22a3de266219a0ae54e';

module.exports = {
    addFace: ()=>{
        return new Promise((resolve, reject)=>{
            const options = {
                "url" : `https://stg-va.sktnugu.com/api/v1/face/subject`, 
                "headers": [
					{
						"key": "app-id",
						"value": "FHJEF7O455",
						"description": ""
					},
					{
						"key": "group-id",
						"value": "ICQ2WADNJ1",
						"description": ""
					},
					{
						"key": "subject-name",
						"value": "hyeonju",
						"description": ""
					}
                ],
                "body": {
					"mode": "raw",
					"raw": ""
				} 
            };
            
            request(options, async (err, result)=>{
                const jsonResult = JSON.parse(result.body);
                if(err) {
                    console.log('request err : ' + err);
                    reject(err)
                }
                else resolve(jsonResult);
            })
        })
    }
};