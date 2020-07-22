const request = require('request');
// const ak = '5a088102e812f22a3de266219a0ae54e';

module.exports = {
    addPerson: ()=>{
        return new Promise((resolve, reject)=>{
            const options = {
                'method' : 'POST',
                'uri' : `https://stg-va.sktnugu.com/api/v1/face/subject`, 
                'headers': {
                    'app-id' : "FHJEF7O455",
                    'group-id' : "ICQ2WADNJ1",
                    'subject-name' : "test1"
                },
                'body': {
                    'mode': "raw",
					'raw': ""
                },
                'json' : true
            };
            
            request(options, async (err, result)=>{
                if(err) {
                    console.log('request err : ' + err);
                    reject(err)
                }
                else{
                    console.log(result.body);
                    resolve(result);
                } 
            })
        })
    }
};