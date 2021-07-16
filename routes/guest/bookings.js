const Booking = require('../../Models/bookings');
const Rooms = require('../../Models/rooms');
const Router = require('express').Router();
const jwt_auth =  require('../../auth/passport-jwt-middleware');
const dayjs = require('dayjs');
const dayOfYear =  require('dayjs/plugin/dayOfYear');

dayjs.extend(dayOfYear);

//dayjs().add(1, 'd').add(3, 'M').format('YYYY-MM-DD')
const getUnavailableRooms = async(from, to, rooms) => {
	let unavailableRooms = [];
	let bookedRooms = await Booking.find({$or: [
		{
			from: {
				$gte: from,
				$lte: dayjs(to).subtract(1, 'd').format('YYYY-MM-DD')
			}
		},
		{
			to: {
				$gte: dayjs(from).add(1, 'd').format('YYYY-MM-DD'),
				$lte: to
			}
		}
	]}).select('rooms -__v -_id')
}

const validateAvailability = async(rooms) => {
	let roomTypes = []
	for(room of rooms){
		let type = await Rooms.findById(room.roomId).select('roomType -__v  -_id');
		roomTypes.push(type)
	}
}

Router.post('/', jwt_auth, (req, res) => {
	const {rooms, from, to, guests} = req.body;
	let maxGuests = rooms.length * 2;

	if(guests > maxGuests){
		return res.status(400).json({
			errorMessage: 'Number of guests exceeded for booked rooms'
		})
	}

	let roomStatus = getUnavailableRooms(from, to, rooms);

	if(!roomStatus){
		//Proceed to do booking
	}else{
		return res.status(400).json({
			errorMessage: roomStatus
		})
	}



})
module.exports = Router;
