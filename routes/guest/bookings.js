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
	return bookedRooms;
}

const validateAvailability = async(rooms) => {
	let roomTypes = []
	for(room of rooms){
		let type = await Rooms.findById(room.roomId).select('roomType -__v  -_id');
		roomTypes.push(type)
	}
}


const getMaximumsGuests  = (rooms) => {
	let roomsBooked = 0;
	for(let [room, guests] of Object.entries(rooms)){
		roomsBooked += guests;
	}
	return roomsBooked * 2;
} 


//Get room ids for booked room types
const getRoomIds = async(rooms) => {
	let types = {
		doubleDeluxe: 'Double Deluxe',
		deluxe: 'Deluxe',
		single: 'Single'
	}

	let roomTypes = []
	for(let [room, guests] of Object.entries(rooms)){
		guests > 0 && roomTypes.push(types[room]);
	}

	let ids = await Rooms.find({roomType : {
		$in: roomTypes
	}}).select('_id')

	return ids
}
Router.post('/', async(req, res) => {
	const {rooms, from, to, guestNumber} = req.body;
	let maxGuests = getMaximumsGuests(rooms);
	let roomIds =  await getRoomIds(rooms);
	console.log(roomIds)

	if(guestNumber > maxGuests){
		return res.status(400).json({
			errorMessage: `Number of guests,${guestNumber} exceeded maximum,${maxGuests}`
		})
	}

	let roomStatus = false;
	//let roomStatus = getUnavailableRooms(from, to, rooms);
	return res.json({maxGuests})
	if(!roomStatus){
		//Proceed to do booking
		let newBooking = new Booking({
			from: dayjs(format).format('YYYY-MM-DD'),
			to: dayjs(to).format('YYYY-MM-DD'),
			rooms,
			guestNumber
		})

		res.json({
			from: newBooking.from,
			to: newBooking.to,
			guestNumber: Booking.guestNumber
		})
	}else{
		return res.status(400).json({
			errorMessage: roomStatus
		})
	}



})
module.exports = Router;
