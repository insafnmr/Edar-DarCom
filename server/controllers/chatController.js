const Chat = require('../models/chatSchema')
const Message = require('../models/messageSchema')

const newConversation = async (req, res) => {
    try {
        const sender = req.personId;
        const receiver = req.params.receiverId;
        const newConversation = await Chat.create({ members: [sender, receiver] });
        res.json(newConversation);
    } catch (error) {
        res.status(500).json(error);
    }
}

const newMessage = async (req, res) => {
    try {
        const { conversation, textMessage } = req.body;
        const newMessage = await Message.create({ textMessage, conversation, sender: req.personId })
        res.json({ newMessage, message: 'done' });

    }
    catch (error) {
        res.status(500).json(error);
    }
}

const displayMessages = async (req, res) => {
    try {
        const messages = await Message.find({ conversation: req.params.conversationId }).populate('conversation').populate('conversation.members').populate('sender');

        res.json(messages);

    } catch (err) {
        res.status(500).json(err);
    }
}

const conversationList = async (req, res) => {
    try {
        const conversation = await Chat.find({
            members: { $in: [req.personId] },
        }).populate('members').sort({ updatedAt: -1 })
        res.status(200).json(conversation);
    } catch (err) {
        res.status(500).json(err);
    }
}

const conversation = async (req, res) => {
    try {
        const conversation = await Chat.findOne({ _id: req.query.id }).populate('members');
        res.json(conversation);
    }
    catch (error) {
        res.status(500).json(error);
    }
}

const deleteConversation = async (req, res) => {

    try {
        const result = await Chat.findOneAndDelete({ _id: req.params.id }).exec();
        if (result) {
            const deletedMessages = await Message.deleteMany({ conversation: req.params.id }).exec();
        }
        res.json(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = { newConversation, newMessage, conversationList, conversation, deleteConversation, displayMessages }