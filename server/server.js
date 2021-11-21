const express = require('express');
const mongoose = require('mongoose');
const dbConnection = require('./helpers/dbConnection')
const app = express();
const path = require('path');
require('dotenv').config();
const cors = require('cors')
app.use(express.json());

//setup cors
app.use(cors());

// connect to database
dbConnection();

const checkEndDate = require('./helpers/checkEndDate');
const check = setInterval(checkEndDate, 36000)

//routes
const userRoute = require('./routes/userRoutes');
app.use('/users', userRoute);

const houseRoute = require('./routes/houseRoutes');
app.use('/houses', houseRoute);

const reservationRoute = require('./routes/reservationRoutes');
app.use('/reservation', reservationRoute);

const reportRoute = require('./routes/reportRoutes');
app.use('/reports', reportRoute);

const contactRoute = require('./routes/contactRoutes');
app.use('/contact', contactRoute);

const favoritesRoute = require('./routes/favoriteRoutes');
app.use('/favorites', favoritesRoute);

const chatRoutes = require('./routes/chatRoutes');
app.use('/chat', chatRoutes);

//setup for deployment :
app.use(express.static(path.join(__dirname, '../', 'client', 'build')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'client', 'build', 'index.html'));
});

app.use('/uploads', express.static(path.join(__dirname, '../', 'uploads')));

app.listen(process.env.PORT, (err) =>
    err ? console.error(err) : console.log(`server is running on port ${process.env.PORT}`)
);
