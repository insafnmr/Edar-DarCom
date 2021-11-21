const express = require('express');
const { addController, deleteController, displayAllController , checkAvailabilityController,ReservationsByUser, ReservationsByHouse} = require('../controllers/reservationController');
const { autorisationMiddleware } = require('../middlewares/autorisationMiddleware');
const { reservationVerification } = require('../middlewares/reservationVerification');
const router = express.Router()
const isBanned = require('../middlewares/isBanned');

router.post('/addReservation', autorisationMiddleware, isBanned, reservationVerification, addController);
router.delete('/deleteReservation/:id',autorisationMiddleware,deleteController); 
router.get('/displayAll',autorisationMiddleware, displayAllController); 
router.post('/checkavailability/:id', checkAvailabilityController); 
router.get('/reservationsByUser', autorisationMiddleware, ReservationsByUser); 
router.get('/reservationsByHouse/:id', autorisationMiddleware, ReservationsByHouse); 

module.exports = router;