const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//New Guest
const GuestSchema = new Schema({
	name : {
		type : String,
		required : true
	},
	email : {
		type : String
		required : true,
		unique : true
	},
	phoneNumber : {
		type : Number,
		required : true,
		unique : true
	},
	registerDate : {
		type : Date,
		default : Date.now()
	}
})

module.exports = Guest = mongoose.model('Guest', GuestSchema);