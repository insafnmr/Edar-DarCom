const Contact = require('../models/contactSchema')

const addController = async (req, res) => {
    try {


        const { firstName, lastName, email, message } = req.body;

        const newMessage = await Contact.create({ firstName, lastName, email, message });
        res.json(newMessage);

    } catch (error) {

    }
};

const deleteController = async (req, res) => {

    try {
        const result = await Contact.findOneAndDelete({ _id: req.params.id }).exec();
        res.json(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const displayAllController = async (req, res) => {

    try {

        const result = await Contact.find({});
        res.json(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const updateReaded = async (req, res) => {
    try {
        const message = await Contact.findOne({ _id: req.params.id });
        const updatedReaded = await Contact.updateOne(
            {
                _id: req.params.id,
            },
            {
                $set: { readed: !message.readed },
            }
        );
        res.status(200).json(updatedReaded);


    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = { addController, deleteController, displayAllController, updateReaded }