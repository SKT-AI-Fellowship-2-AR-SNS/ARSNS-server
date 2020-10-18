const request = require('request');

module.exports = {
    subjectList: (appid, groupid)=>{
        // console.log('subjectList 시작');
        return new Promise((resolve, reject)=>{
            let options = {
                'method' : 'GET',
                'uri' : `https://stg-va.sktnugu.com/api/v1/face/subject`, 
                'headers': {
                    'app-id' : `${appid}`,
                    'group-id' : `${groupid}`
                },
                'body': {
                    'mode': "raw",
					'raw': ""
                },
                'json' : true
            };
            
            request(options, async (err, result)=>{
                // console.log(result.body);
                if(err) {
                    console.log('request err : ' + err);
                    reject(err)
                }
                else{
                    // console.log(result.body.subject_name);
                    resolve(result.body);
                } 
            })
        })
    }
};