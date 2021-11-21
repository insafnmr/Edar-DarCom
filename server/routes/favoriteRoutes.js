const express = require('express');
const { addController, deleteController, displayAllController } = require('../controllers/favoriteController');
const { autorisationMiddleware } = require('../middlewares/autorisationMiddleware');
const router = express.Router()
const isBanned = require('../middlewares/isBanned');

router.put('/addFavorite/:id', autorisationMiddleware, isBanned, addController);
router.put('/deleteFavorite/:id', autorisationMiddleware, deleteController);
router.get('/displayAll', autorisationMiddleware, displayAllController);

module.exports = router;