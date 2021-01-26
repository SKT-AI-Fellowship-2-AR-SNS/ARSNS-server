var express = require('express');
var router = express.Router();
const historyController = require('../../controllers/history');
const upload = require('../../modules/multer');
// const multer = require('multer');
// const upload = multer({
//     dest: 'upload/'
// });

router.post('/v1/histories', upload.array('content',1), historyController.addHistory);
router.get('/v1/histories/:my-id/:your-id/:bssid1/:bssid2', historyController.getHistory);
router.get('/v1/histories/:my-id/:history-idx',historyController.detailHistory);
router.delete('/v1/histories/:user-idx/:history-idx', historyController.deleteHistory);
router.post('/v1/comments', historyController.addComment);
router.delete('/v1/comments/:user-idx/:comment-idx', historyController.deleteComment);
router.get('/v1/comments/:history-idx', historyController.getComment);
router.get('/v1/tags/:my-id', historyController.tagList);
router.put('/v1/likes/:user-idx/:history-idx', historyController.likeHistory);

module.exports = router;