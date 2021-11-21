const express = require('express');
const { addController, displayMessages } = require('../controllers/messageController');
const { autorisationMiddleware } = require('../middlewares/autorisationMiddleware');
const router = express.Router()

router.post('/addmessage', autorisationMiddleware, addController);
router.get('/messages/:conversationId"', autorisationMiddleware, displayMessages);


module.exports = router;