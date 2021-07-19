const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
	userId:{
		type: mongoose.ObjectId,
		required: true
	},
	from:{
		type: Date,
		required: true
	},
	to:{
		type: Date,
		required: true
	},
	rooms:[{
		roomId : {
			type: mongoose.ObjectId,
			required: true
		}
	}],
	guestNumber:{
		type: Number,
		required: true
	},
	dateBooked: {
		type: Date,
		default: Date.now,
		required: true,
	}

})

module.exports = Booking = mongoose.model('Booking', BookingSchema)