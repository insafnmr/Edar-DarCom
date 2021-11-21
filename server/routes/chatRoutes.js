const express = require('express');
const { newConversation, newMessage, conversationList, conversation, displayMessages, deleteConversation } = require('../controllers/chatController');
const { autorisationMiddleware } = require('../middlewares/autorisationMiddleware');
const router = express.Router()

router.post('/new/conversation/:receiverId', autorisationMiddleware, newConversation);
router.post('/new/message', autorisationMiddleware, newMessage);
router.get('/conversationList', autorisationMiddleware, conversationList);
router.get('/conversation',autorisationMiddleware, conversation);
router.get('/messages/:conversationId', autorisationMiddleware, displayMessages);
router.delete('/deleteconversation/:id',autorisationMiddleware, deleteConversation); 

module.exports = router;