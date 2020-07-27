const request = require('request');

module.exports = {
    addPerson: ()=>{
        return new Promise((resolve, reject)=>{
            let options = {
                'method' : 'POST',
                'uri' : `https://stg-va.sktnugu.com/api/v1/face/subject`, 
                'headers': {
                    'app-id' : "FHJEF7O455",
                    'group-id' : "ICQ2WADNJ1",
                    'subject-name' : "phj"
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
                    // console.log(result.body.subject_name);
                    resolve(result.body.subject_name);
                } 
            })
        })
    }
};