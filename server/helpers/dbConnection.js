const mongoose = require('mongoose');
const Pusher = require("pusher");

// pusher config
const pusher = new Pusher({
    appId: "1292079",
    key: "dff4d6fa624781b71843",
    secret: "d67b10d92c4ccbba3ff3",
    cluster: "eu",
    useTLS: true
  });
  
const dbConnection = () => {
    mongoose.connect(process.env.MONGO_URI,
        { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
        (err) => (err ? console.log(err) : console.log('connected to database')))

    mongoose.connection.once('open', () => {

        const changeStream = mongoose.connection.collection('conversations').watch()

        changeStream.on('change', (change) => {
            if (change.operationType === 'insert') {
                pusher.trigger('chats', 'newChat', {
                    'change': change
                })
            } else if (change.operationType === 'update') {
                pusher.trigger('messages', 'newMessage', {
                    'change': change
                })
            } else {
                console.log('Error triggering Pusher...')
            }
        })
    })
};

module.exports = dbConnection;