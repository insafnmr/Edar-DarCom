const Reservation = require('../models/reservationSchema')
const Houses = require('../models/houseSchema')
const dayjs = require('dayjs')
var isBetween = require('dayjs/plugin/isBetween')
dayjs.extend(isBetween)

const reservationVerification = async (req, res, next) => {


    try {

        const { arrivalDate, releaseDate, paymentMode, payed, house } = req.body;
        const reservations = await Reservation.find({ house: house });

        var reserved = false
        reservations.map((reservation) => {

            const test1 = (dayjs(arrivalDate + 1).isBetween(dayjs(reservation.arrivalDate), dayjs(reservation.releaseDate), null, [])) ||
                (dayjs(releaseDate + 1).isBetween(dayjs(reservation.arrivalDate), dayjs(reservation.releaseDate), null, []))
            //console.log(test1)

            const test2 = (dayjs(reservation.arrivalDate).isBetween(dayjs(arrivalDate + 1), dayjs(releaseDate + 1), null, [])) ||
                (dayjs(reservation.releaseDate).isBetween(dayjs(arrivalDate + 1), dayjs(releaseDate + 1), null, []))

            //console.log(test2)

            reserved = reserved || test1 || test2
            //console.log(reserved)

        })

        if (reserved) {
            res.status(200).json({ message: " unavailable house in this period", reserved });
        } else {
            next()
        }

    } catch (error) {

    }
};
const getAllHousesMiddleware = async (req, res, next) => {
    try {

        const houses = await Houses.find()

        req.houses = houses
        next();


    } catch (error) {

    }
}
const checkAvailableHousesMiddleware = async (req, res, next) => {
    try {

        const { arrivalDate, releaseDate } = req.body;

        const houses = req.houses

        houses.map(async (house) => {
            var reserved = false
            const reservations = await Reservation.find({ house: house._id });
            reservations.map((reservation) => {

                reserved = reserved || (dayjs(arrivalDate + 1).isBetween(dayjs(reservation.arrivalDate), dayjs(reservation.releaseDate), null, [])) ||
                    (dayjs(releaseDate + 1).isBetween(dayjs(reservation.arrivalDate), dayjs(reservation.releaseDate), null, []))

                    || (dayjs(reservation.arrivalDate).isBetween(dayjs(arrivalDate + 1), dayjs(releaseDate + 1), null, [])) ||
                    (dayjs(reservation.releaseDate).isBetween(dayjs(arrivalDate + 1), dayjs(releaseDate + 1), null, []))


            })
            house.reserved = reserved
            console.log(house.reserved)
            await house.save()

        })

        next()


    } catch (error) {

    }
}

/* const checkAvailabilityMiddleware = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.mapped() });
        } 
            const {houseId, arrivalDate, releaseDate} = req.body;
            const reservations = await Reservation.find({house: houseId});
        
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
                        
                        if(reserved){
                            res.status(200).json({message: " unavailable house in this period",reserved});
                        }else{
                            res.status(200).json({message: " available house in this period, you can, reserve",reserved});
                        }
                        
    } catch (error) {
 
    }

} 
*/
module.exports = { reservationVerification, checkAvailableHousesMiddleware, getAllHousesMiddleware };