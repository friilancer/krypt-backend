const Router = require('express').Router();
const Room = require('../../Models/rooms');
const jwt_auth =  require('../../auth/passport-jwt-middleware');


//Update rooms
//@access Admin
Router.get('/', async(req, res) => {
	let rooms = Room.find({});
	res.json(rooms);
})



Router.post('/', (req, res) => {
	const {name, price, roomType} = req.body;

	//Validate entries
	if(!name || !price || !roomType) return res.status(400).json({msg : "Please enter all fields"});

	//Check for rooms
	Room.findOne({ name }).then( room => {

		//Check for availability of name
		if(room) return res.status(400).json({msg : "Room already exists"});

		//Create new room
		const newRoom = new Room({
			name,
			price,
			roomType
		});

		newRoom.save().then( room => {
			res.json({room});
		}).catch(err => {
			res.status(400).json({
				errorMessage: 'Could not create new room'
			})
		})
	})
})


module.exports = Router;