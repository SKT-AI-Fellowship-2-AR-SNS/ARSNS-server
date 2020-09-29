var express = require('express');
var router = express.Router();
const historyController = require('../../controllers/history');
const upload = require('../../modules/multer');
// const multer = require('multer');
// const upload = multer({
//     dest: 'upload/'
// });

router.post('/addHistory', upload.array('content',1), historyController.addHistory);
router.get('/getHistory/:myid/:yourid/:bssid1/:bssid2', historyController.getHistory);
router.get('/getFriendHistory/:myId/:friendId', historyController.getFriendHistory);
router.put('/like/:userIdx/:historyIdx', historyController.likeHistory);
router.delete('/deleteHistory/:userIdx/:historyIdx', historyController.deleteHistory);
router.post('/addComment/:userIdx/:historyIdx', historyController.addComment);
router.delete('/deleteComment/:userIdx/:commentIdx', historyController.deleteComment);

module.exports = router;