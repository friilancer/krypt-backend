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
		_id : {
			type: mongoose.ObjectId,
			required: true
		},
		roomType: {
			type : String,
			required: true,
			enum: ['Double Deluxe', 'Deluxe', 'Single']
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
	},
	expired: {
		type: Boolean,
		default: false
	}
})

module.exports = Booking = mongoose.model('Booking', BookingSchema)