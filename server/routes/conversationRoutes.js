const express = require('express');
const { addController,displayConversations, displayConversationsOfTwoUsers } = require('../controllers/conversationController');
const { autorisationMiddleware } = require('../middlewares/autorisationMiddleware');
const router = express.Router()

router.post('/addconversation', autorisationMiddleware, addController);
router.get('/conversation"', autorisationMiddleware, displayConversations); 
router.get('/find/:firstUserId/:secondUserId', autorisationMiddleware, displayConversationsOfTwoUsers); 


module.exports = router;