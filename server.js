const express = require('express');
const mongoose = require('mongoose');

const app = express();


//Parser Middleware
app.use(express.json());
app.use(express.urlencoded({extended : false}));

//DB config 
const db = require('./config').mongoURI;

//DB options
const options = {
	useNewUrlParser : true,
	useUnifiedTopology : true,
	useCreateIndex : true
}

//Connect to Mongo database
mongoose.connect(db, options, () => {
	console.log(`Database connected`);
})


//Routes
app.use('/api/rooms', require('./routes/api/rooms'));

const port = process.env.PORT || 5000;

app.listen(port, () => {
	console.log(`Server started on port ${port}`)
})