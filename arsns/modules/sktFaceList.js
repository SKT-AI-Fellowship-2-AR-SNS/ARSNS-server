const request = require('request');

module.exports = {
    faceList: (appid, groupid, subjectid)=>{
        // console.log('faceList 시작');
        return new Promise((resolve, reject)=>{
            let options = {
                'method' : 'GET',
                'uri' : `https://stg-va.sktnugu.com/api/v1/face/face`, 
                'headers': {
                    // 'app-id' : "FHJEF7O455",
                    // 'group-id' : "SMB2NA4ND0",
                    // 'subject-name' : "phj"
                    'app-id' : `${appid}`,
                    'group-id' : `${groupid}`,
                    'subject-id' : `${subjectid}`
                },
                'body': {
                    'mode': "raw",
					'raw': ""
                },
                'json' : true
            };
            
            request(options, async (err, result)=>{
                // console.log(result.body[0].face_id);
                if(err) {
                    console.log('request err : ' + err);
                    reject(err)
                }
                else{
                    // console.log(result.body.subject_name);
                    resolve(result.body[0].face_id);
                } 
            })
        })
    }
};