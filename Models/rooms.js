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
	occupied : {
		type : Boolean,
		default : false
	}
})

module.exports = Room = mongoose.model('Room', RoomSchema)