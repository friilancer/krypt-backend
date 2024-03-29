const express = require('express');
const mongoose = require('mongoose');
const app = express();
if(process.env.NODE_ENV !== 'production'){
	require('dotenv').config();
}
const passport = require('passport');
const cors = require('cors');
require('./jobs/cancelBookings')()

require('./auth/passport-jwt')(passport)

//Parser Middleware
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cors({
	origin: 'https://axdville.netlify.app',
	optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }))

//Passport middleware
app.use(passport.initialize());


//DB options
const options = {
	useNewUrlParser : true,
	useUnifiedTopology : true,
	useCreateIndex : true
}

//Connect to Mongo database
const connectToDatabase = async() => {
	await mongoose.connect(process.env.DB_URI, options, (error) => {
	if(error){
		console.log(error);
		return error;
	}
	console.log(`Database connected`);
	})
}


//Routes
app.use('/api/rooms', require('./routes/room/rooms'));
app.use('/api/guest/register', require('./routes/guest/register'));
app.use('/api/guest/booking', require('./routes/guest/bookings'));
app.use('/api/guest/login', require('./routes/guest/login'))
app.use('/api/guest/verify', require('./routes/guest/verify'))
app.get('/', (_, res) => {res.send('Hello, from test route')})

const port = process.env.PORT || 5000;

app.listen(port, () => {
	console.log(`Server started on port ${port}`)
})

connectToDatabase()