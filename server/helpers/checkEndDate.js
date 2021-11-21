const Reservation = require('../models/reservationSchema')
const dayjs = require('dayjs')


const checkEndDate = async () => {

    try {
        const reservations = await Reservation.find({ isDone: false })
        const today = dayjs(new Date())
        reservations.map(async (reserv) => {
            if (dayjs(reserv.releaseDate).isBefore(today)) {
                reserv.isDone = true
                await reserv.save()
            }
        })

    }
    catch (err) {
        console.error(err)
    }
}

module.exports = checkEndDate