const express = require('express');
const { body } = require('express-validator');
const { addController, deleteController, displayAllController, displayRecentHouses, displayByIdController, updateHouse, displayByHost, updateHouseImages, addReview, filterController } = require('../controllers/houseController');
const { autorisationMiddleware } = require('../middlewares/autorisationMiddleware');
const { checkAvailableHousesMiddleware, getAllHousesMiddleware } = require('../middlewares/reservationVerification')

const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const router = express.Router()
const cloudinary = require('../helpers/cloudinary');
const isBanned = require('../middlewares/isBanned');

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'Houses',
    },
});
const upload = multer({ storage });

router.get('/', displayAllController);
router.get('/recenthouses', displayRecentHouses);
router.get('/displayHouseById/:id', displayByIdController);
router.get('/displayHouseByHost', autorisationMiddleware, displayByHost);

router.post('/addHouse', upload.array('picture'), autorisationMiddleware, isBanned, addController);

router.put('/updateHouse/:id', autorisationMiddleware, updateHouse)
router.put('/uploadimgs/:id', upload.array('picture'), autorisationMiddleware, updateHouseImages);
router.put('/review/:id', autorisationMiddleware, isBanned, addReview);
router.post('/filter', getAllHousesMiddleware, checkAvailableHousesMiddleware, filterController);

router.delete('/deleteHouse/:id', autorisationMiddleware, deleteController);

module.exports = router;