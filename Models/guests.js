const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//New Guest
const GuestSchema = new Schema({
	firstName : {
		type : String,
		required : true
	},
	lastName : {
		type : String,
		required: true
	},
	email : {
		type : String,
		required : true,
		unique : true
	},
	phoneNumber : {
		type : Number
	},
	password : {
		type: String,
	},
	registerDate : {
		type : Date,
		default : Date.now()
	}
})

module.exports = Guest = mongoose.model('Guest', GuestSchema);