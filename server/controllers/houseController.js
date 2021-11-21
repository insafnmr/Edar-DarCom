const House = require('../models/houseSchema')
const { validationResult } = require('express-validator');
const cloudinary = require('../helpers/cloudinary');
const User = require('../models/userSchema')
const Reservation = require('../models/reservationSchema')

const dayjs = require('dayjs')
var isBetween = require('dayjs/plugin/isBetween')
dayjs.extend(isBetween)

const addController = async (req, res) => {
    try {
        const newBody = JSON.parse(req.body.info);
        const pictureFiles = req.files;
        const multiplePicturePromise = await pictureFiles.map((picture) =>
            cloudinary.uploader.upload(picture.path)
        );
        const imageResponses = await Promise.all(multiplePicturePromise);
        // const { title, description, nbr_room, nbr_bed, town, city, price, image, isValidated } = JSON.parse(req.body.info);
        const imgList = []
        await imageResponses.map(img => imgList.push({ imageURL: img.url, public_id: img.public_id }))

        const newHouse = await House.create({
            title: newBody.title,
            description: newBody.description,
            nbr_room: newBody.nbr_room,
            nbr_bed: newBody.nbr_bed,
            nbr_bathroom: newBody.nbr_bathroom,
            country: newBody.country,
            city: newBody.city,
            price: newBody.price,
            capacity: newBody.capacity,
            assets: newBody.assets,
            rating: newBody.rating,
            comments: newBody.comments,
            image: imgList,
            host: req.personId
        })
        res.json({ newHouse, message: "House added successfully" });
    } catch (error) {
    }
};

const deleteController = async (req, res) => {

    try {
        const result = await House.findOneAndDelete({ _id: req.params.id }).exec();
        if (result) {
            const deletedReservations = await Reservation.deleteMany({ house: req.params.id }).exec();
        }
        res.status(200).json({ result, message: "House has been deleted succefully" });

    } catch (error) {
        res.status(500).json(error);
    }
};

const displayAllController = async (req, res) => {

    try {
        const result = await House.find({}).populate("host", "-password -__v").populate('reviews.reviewOwner')
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

const displayByIdController = async (req, res) => {

    try {
        const result = await House.findById(req.params.id).populate("host", "-password -__v").populate('reviews.reviewOwner', '-password -__v');

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

const displayRecentHouses = async (req, res) => {

    try {
        const houses = await House.find({})
            .populate("host", "-password -__v")
            .populate('reviews.reviewOwner')
            .sort({ AddedAt: -1 })
            .limit(3);

        res.json(houses);
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

const displayByHost = async (req, res) => {

    try {
        const result = await House.find({ host: req.personId }).populate("host", "-password -__v");
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error });
    }
};
const updateHouse = async (req, res) => {
    try {
        const house = await House.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true });
        if (house)
            res.json({ message: 'house updated', house });
        else
            res.status(404).json({ message: 'House not found' });
    }
    catch (error) {
        res.status(500).json(error);
    }
};

const updateHouseImages = async (req, res) => {
    try {
        const pictureFiles = req.files;
        const multiplePicturePromise = await pictureFiles.map((picture) =>
            cloudinary.uploader.upload(picture.path)
        );
        const existHouse = await House.findById(req.params.id);
        cloudinary.uploader.destroy(existHouse.image.public_id);
        const imageResponses = await Promise.all(multiplePicturePromise);

        const imgList = []
        await imageResponses.map(img => imgList.push({ imageURL: img.url, public_id: img.public_id }))

        const updatedHouseImages = await House.findByIdAndUpdate(req.params.id, {
            image: imgList
        }, { new: true });
        res.json(updatedHouseImages);
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

const addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const newReview = await House.findById(req.params.id)
            .populate('host')
            .populate('reviews.reviewOwner', '-password -__v');

        if (newReview) {
            newReview.reviews.push({ reviewOwner: req.personId, comment, rating: Number(rating) });
            newReview.rating =
                newReview.reviews.reduce((acc, item) => item.rating + acc, 0) /
                newReview.reviews.length;
        }

        await newReview.save();
        res.status(201).json({ newReview });


    } catch (error) {
        res.status(500).json({ message: error });
    }
};

const filterController = async (req, res) => {

    try {
        const { city, guest, room, priceInterval, country } = req.body;

        const keyword = { city: { $regex: city, $options: 'i' }, capacity: { $gte: guest }, nbr_room: { $gte: room }, price: { $gte: priceInterval[0], $lte: priceInterval[1] }, country: { $regex: country, $options: 'i' } };
        const houses = await House.find({ reserved: false, ...keyword });
        const housess = await House.find({ ...keyword, reserved: false }).populate('host');
        console.log(housess.length)
        //console.log('house',houses.length)
        req.houses.map((house) => {
            console.log('controller:', house.reserved);
        })
        res.status(201).json({ housess });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};
/* const filterAuthController = async (req, res) => {

    try {console.log(req.personId)

        const { city, guest, room, priceInterval, country } = req.body;

        const keyword ={  city: { $regex: city, $options: 'i' }, capacity: { $gte: guest }, nbr_room: { $gte: room }, price: { $gte: priceInterval[0], $lte: priceInterval[1] }, country: { $regex: country, $options: 'i' } };
        const houses = await House.find({ reserved: false, ...keyword });
        const housess = await House.find({ ...keyword, reserved: false }).populate('host');
        console.log(housess.length)
        //console.log('house',houses.length)
        req.houses.map((house) => {
            console.log('controller:', house.reserved);
        })
        res.status(201).json({ housess });
    } catch (error) {
        res.status(500).json({ message: error });
    }
}; */

module.exports = { addController, deleteController, displayAllController, displayRecentHouses, displayByIdController, displayByHost, updateHouse, updateHouseImages, addReview, filterController }

