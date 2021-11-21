const Favorite = require('../models/favoritesSchema');
const House = require('../models/houseSchema');
const { validationResult } = require('express-validator');

const addController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.mapped() });
        }
        const existHouse = await House.findById(req.params.id);
        const existLike = await existHouse.likes.find((like) => like == req.personId);
        const existFavorite = await Favorite.findOne({ client: req.personId, house: req.params.id }).populate('client').populate('house');

        if (existFavorite) {
            if (existLike) {
                const updatedHouse = await House.findByIdAndUpdate(req.params.id, {
                    $pull: { likes: req.personId }
                },
                    { new: true },
                );
                const deletedFavorite = await Favorite.findOneAndDelete({ client: req.personId, house: req.params.id }).exec();

                res.json({ deletedFavorite, updatedHouse, message: "deleted" });
            }
        }
        else {

            const newFavorite = await Favorite.create({ client: req.personId, house: req.params.id, isLiked: true });

            if (!existLike) {
                const updatedHouse = await House.findByIdAndUpdate(req.params.id, {
                    $push: { likes: req.personId }
                },
                    { new: true },

                );
                res.json({ newFavorite, updatedHouse });
            }
        }

    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteController = async (req, res) => {

    try {
      /*   const existHouse = await House.findById(req.params.id);
        const existLike = await existHouse.likes.find((like) => like == req.personId);
        const existFavorite = await Favorite.findOne({ client: req.personId, house: req.params.id }).populate('client').populate('house');
 */
       
                const updatedHouse = await House.findByIdAndUpdate(req.params.id, {
                    $pull: { likes: req.personId }
                },
                    { new: true },
                );
                const deletedFavorite = await Favorite.findOneAndDelete({ client: req.personId, house: req.params.id }).exec();

                res.json({ deletedFavorite, updatedHouse, message: "deleted" });
            
     /*    const deletedFavorite = await Favorite.findOneAndDelete({ _id: req.params.id }).exec();
        res.json(deletedFavorite); */

    } catch (error) {
        res.status(500).json(error);
    }
};

const displayAllController = async (req, res) => {

    try {
        const favorite = await Favorite.find({ client: req.personId }).populate('client').populate('house');
        res.json(favorite);
        // }
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = { addController, deleteController, displayAllController }