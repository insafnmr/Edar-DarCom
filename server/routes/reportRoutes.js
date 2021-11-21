const express = require('express');
const { addController,deleteController,displayAllController, updateReaded } = require('../controllers/reportController');
const { autorisationMiddleware } = require('../middlewares/autorisationMiddleware');
const router = express.Router()
const isBanned = require('../middlewares/isBanned');

router.post('/addReport', autorisationMiddleware, isBanned, addController);
router.put('/updateReaded/:id', autorisationMiddleware, updateReaded);
router.delete('/deleteReport/:id',autorisationMiddleware, deleteController); 
router.get('/displayAll', autorisationMiddleware, displayAllController); 


module.exports = router;