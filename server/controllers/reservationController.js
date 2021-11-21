const Reservation = require('../models/reservationSchema')
const House = require('../models/houseSchema')
const { validationResult } = require('express-validator');
const dayjs = require('dayjs')
var isBetween = require('dayjs/plugin/isBetween')
dayjs.extend(isBetween)

const addController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.mapped() });
        }
            const { arrivalDate, releaseDate, paymentMode, payed,house, total_price,total_guests, nbr_nights } = req.body;
            const newReservation = await Reservation.create({ arrivalDate:dayjs(arrivalDate+1), releaseDate: dayjs(releaseDate+1), paymentMode, payed, client: req.personId, house,total_guests,total_price, nbr_nights });
            res.json(newReservation);
    } catch (error) {
        res.status(500).json({ message: error });
    }
};
const deleteController = async (req, res) => {

    try {

        const deletedReservation = await Reservation.findOneAndDelete({ _id: req.params.id }).exec();
        res.json(deletedReservation);

    } catch (error) {
        res.status(500).json(error);
    }
};


const displayAllController = async (req, res) => {

    try {
    /*   const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.mapped() });
        }else{ */
        var result = await Reservation.find().exec();
        res.send(result);
       // }
    } catch (error) {
        res.status(500).send(error);
    }
};
const checkAvailabilityController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.mapped() });
        } 
            const { arrivalDate, releaseDate} = req.body;
            const reservations = await Reservation.find({house: req.params.id});
        
        console.log(req.body)
        
                            var reserved=false
                        reservations.map(async (reservation) => {    
                                
                                    const test1= (dayjs(arrivalDate+1).isBetween(dayjs(reservation.arrivalDate), dayjs(reservation.releaseDate),null,[] ) )||
                                    (dayjs(releaseDate+1).isBetween(dayjs(reservation.arrivalDate), dayjs(reservation.releaseDate),null,[] ) ) 
                                    //console.log(test1)

                                    const test2= (dayjs(reservation.arrivalDate).isBetween(dayjs(arrivalDate+1), dayjs(releaseDate+1),null,[] ) ) || 
                                    (dayjs(reservation.releaseDate).isBetween(dayjs(arrivalDate+1), dayjs(releaseDate+1),null,[] ) )
                                    
                                    //console.log(test2)

                                    reserved= reserved || test1 || test2
                                    //console.log(reserved)

                        })
                        //console.log(reserved)
                        //reserved.save();
                        if(reserved){
                            res.status(200).json({message: " unavailable house in this period",reserved});
                        }else{
                            res.status(200).json({message: " available house in this period: you can reserve",reserved});
                        }
                        
    } catch (error) {

    }
};

const ReservationsByUser = async (req, res) => {

    try {
         const reservations = await Reservation.find({ client: req.personId })
            .populate("client", "-password -__v")
            .populate("house")
            .sort({ arrivalDate: -1 }) 
            
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

const ReservationsByHouse = async (req, res) => {

    try {
            const reservations = await Reservation.find({ house: req.params.id , isDone:false  })
                .populate("client", "-password -__v")
                .populate("house")
                .sort({ AddedAt: -1 })        
        
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: error });
    }
};
module.exports = { addController , deleteController, displayAllController, checkAvailabilityController,ReservationsByUser, ReservationsByHouse}