const Reservation = require('../models/reservationSchema')
const Houses = require('../models/houseSchema')

const housesToFilter = async (req, res,next) => {

    try {
        const { city, guest, room, priceInterval, country } = req.body;
const hostId=host._id ;
               const houses = await House.find({ hostId: { $ne: req.personId } } );

        next()
    } catch (error) { 
        res.status(500).json({ message: error });
    }
};

module.exports = {housesToFilter };