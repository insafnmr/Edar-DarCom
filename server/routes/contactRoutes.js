const express = require('express');
const { addController,deleteController,displayAllController, updateReaded } = require('../controllers/contactController');
const { autorisationMiddleware } = require('../middlewares/autorisationMiddleware');
const router = express.Router()

router.post('/addMessage', addController);
router.put('/updateReaded/:id', autorisationMiddleware, updateReaded);
router.delete('/deleteMessage/:id',autorisationMiddleware, deleteController); 
router.get('/displayAll', autorisationMiddleware, displayAllController); 


module.exports = router;