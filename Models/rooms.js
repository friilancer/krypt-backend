const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Rooms
const RoomSchema = new Schema({
	name : {
		type : String,
		required :  true,
		unique: true
	},
	price : {
		type : Number,
		required : true
	},
	roomType: {
		type: String,
		required: true,
		enum: ['Double Deluxe', 'Deluxe', 'Single']
	}
})

module.exports = Room = mongoose.model('Room', RoomSchema);