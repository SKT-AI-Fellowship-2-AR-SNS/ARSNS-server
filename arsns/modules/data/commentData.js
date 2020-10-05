module.exports = 
    (rawCommentData) => {
        commentData = {
            "userIdx": rawCommentData.userIdx,
            "name": rawCommentData.name,
            "profileImage": rawCommentData.profileImage,
            "commentIdx": rawCommentData.commentIdx,
            "historyIdx": rawCommentData.historyIdx,
            "comment": rawCommentData.comment,
            "timestamp": rawCommentData.timestamp,

        };
        return commentData;
    };