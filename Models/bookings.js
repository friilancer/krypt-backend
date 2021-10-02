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
	reference: {
		type:String,
		required: true
	},
	transaction: {
		type:String,
		required:true
	},
	paymentDate: {
		type: Date,
		default: Date.now,
		required: true
	},
	amount: {
		type: Number,
		required: true
	},
	currency:{
		type:String,
		default:'Kobo',
		required:true,
		enum:['Kobo']
	},
	expired: {
		type: Boolean,
		default: false
	}
})

module.exports = Booking = mongoose.model('Booking', BookingSchema)