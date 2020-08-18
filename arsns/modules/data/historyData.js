module.exports = 
    (rawHistoryData) => {
        historyData = {
            "historyIdx": rawHistoryData.historyIdx,
            "contents": rawHistoryData.contents,
            "timestamp": rawHistoryData.timestamp,
            "userIdx": rawHistoryData.userIdx,
            "location": rawHistoryData.location,
            "text": rawHistoryData.text,
            "datetime": rawHistoryData.datetime,
            "day": rawHistoryData.day
        
        };
        return historyData;
    };