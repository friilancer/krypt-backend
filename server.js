const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();
const passport = require('passport')

require('./auth/passport-jwt')(passport)
//Parser Middleware
app.use(express.json());
app.use(express.urlencoded({extended : false}));


//Passport middleware
app.use(passport.initialize());


//DB options
const options = {
	useNewUrlParser : true,
	useUnifiedTopology : true,
	useCreateIndex : true
}

//Connect to Mongo database
mongoose.connect(process.env.DB_URI, options, () => {
	console.log(`Database connected`);
})


//Routes
app.use('/api/rooms', require('./routes/room/rooms'));
app.use('/api/guest/register', require('./routes/guest/register'));
app.use('/api/guest/booking', require('./routes/guest/bookings'));
app.use('/api/guest/login', require('./routes/guest/login'))

const port = process.env.PORT || 5000;

app.listen(port, () => {
	console.log(`Server started on port ${port}`)
})