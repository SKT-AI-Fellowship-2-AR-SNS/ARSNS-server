module.exports = 
    (rawHistoryData) => {
        historyData = {
            "historyIdx": rawHistoryData.historyIdx,
            "video": rawHistoryData.video,
            "image": rawHistoryData.image,
            "timestamp": rawHistoryData.timestamp,
            "userIdx": rawHistoryData.userIdx,
            "location": rawHistoryData.location,
            "text": rawHistoryData.text,
            "datetime": rawHistoryData.datetime,
            "day": rawHistoryData.day,
            "name": rawHistoryData.name,
            "profileImage": rawHistoryData.profileImage,
            "contents_type": rawHistoryData.contents_type
        };
        return historyData;
    };