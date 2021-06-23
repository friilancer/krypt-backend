const express = require('express');
const Router = express.Router();
const Room = require('../../Models/rooms');
const jwt_auth =  require('../../auth/passport-jwt-middleware');
//Update rooms
//@access Admin

Router.get('/', jwt_auth, (req, res) => {
	res.send('See rooms')
})

Router.post('/', (req, res) => {
	console.log(req.body.name);
	const {name, price} = req.body;

	console.log(name, price);

	//Validate entries
	if(!name || !price) return res.status(400).json({msg : "Please enter all fields"});

	//Check for rooms
	Room.findOne({ name }).then( room => {

		//Check for availability of name
		if(room) return res.status(400).json({msg : "Room already exists"});

		//Create new room
		const newRoom = new Room({
			name,
			price
		});

		newRoom.save().then( room => {
			res.json({room});
		})
	})
})

module.exports = Router;