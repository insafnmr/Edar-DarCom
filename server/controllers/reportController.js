const Report = require('../models/reportsSchema')
const User = require('../models/userSchema');

const addController = async (req, res) => {
    try {


        const { reportsDate, message, readed, hostId } = req.body;

        const newReport = await Report.create({ reportsDate, message, readed, client: req.personId, host: hostId });
        res.json(newReport);

    } catch (error) {

    }
};

const deleteController = async (req, res) => {

    try {

        const result = await Report.findOneAndDelete({ _id: req.params.id }).exec();
        res.json(result);

    } catch (error) {
        res.status(500).json(error);
    }
};

const displayAllController = async (req, res) => {

    try {

        const result = await Report.find({})
            .populate('client', '-password -__v')
            .populate('host', '-password -__v');

        res.json(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const updateReaded = async (req, res) => {
    try {
        const report = await Report.findOne({ _id: req.params.id });
        const updatedReaded = await Report.updateOne(
            {
                _id: req.params.id,
            },
            {
                $set: { readed: !report.readed },
            }
        );
        res.status(200).json(updatedReaded);


    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = { addController, deleteController, displayAllController, updateReaded }