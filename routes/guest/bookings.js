const Booking = require('../../Models/bookings');
const Rooms = require('../../Models/rooms');
const Router = require('express').Router();
const jwt_auth =  require('../../auth/passport-jwt-middleware');
const dayjs = require('dayjs');
const dayOfYear =  require('dayjs/plugin/dayOfYear');

dayjs.extend(dayOfYear);

//dayjs().add(1, 'd').add(3, 'M').format('YYYY-MM-DD')
const serialiseRooms = (i, obj) => {
	if(i.roomType === 'Double Deluxe'){
		obj.doubleDeluxe = obj.doubleDeluxe ?  [...obj.doubleDeluxe, i._id] : [i._id];
	}else if(i.roomType === 'Deluxe'){
		obj.deluxe = obj.deluxe ? [...obj.deluxe, i._id] : [i._id]
	} else{
		obj.single = obj.single  ? [...obj.single, i._id] : [i._id]
	}	
}

const getAvailableRooms = async(from, to, roomTypes) => {
	let bookings = await Booking.find({$or: [
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
	]}).select('rooms -_id');

	let roomIds = []
	for(booking of bookings){
		for(room of booking.rooms){
			roomIds.push(room._id);
		}
	}

	let ids = await Rooms.find({
		$and:[
			{_id :
				{ 
					$not: {
						$in: roomIds	
					}
				}
			},
			{roomType: {$in: roomTypes} }
		]
	}).select('_id roomType');

	let obj = {};
	for(let i of ids){
		serialiseRooms(i, obj)
	}
	return obj
}

const getRoomTypes = async(rooms) => {
	let types = {
		doubleDeluxe: 'Double Deluxe',
		deluxe: 'Deluxe',
		single: 'Single'
	}

	let roomTypes = []
	for(let [room, guests] of Object.entries(rooms)){
		guests > 0 && roomTypes.push(types[room]);
	}
	return roomTypes
}

const getMaximumsGuests  = (rooms) => {
	let roomsBooked = 0;
	for(let [room, guests] of Object.entries(rooms)){
		roomsBooked += guests;
	}
	return roomsBooked * 2;
} 

const validateRoomAvailability = (freeRooms, rooms) => {
	let types = {
		doubleDeluxe: 'Double Deluxe',
		deluxe: 'Deluxe',
		single: 'Single'
	}

	for(let [room, guests] of Object.entries(rooms)){
		if(guests > freeRooms[room].length){
			return {
				errorMessage: `Only ${freeRooms[room].length} ${types[room]} ${freeRooms[room].length > 1 ? 'rooms' : 'room'} available`}
		}
	}

	return false
}

const bookRooms = (freeRooms, rooms) => {
	let types = {
		doubleDeluxe: 'Double Deluxe',
		deluxe: 'Deluxe',
		single: 'Single'
	}

	let roomBooking = [];
	for(let [room, guests] of Object.entries(rooms)){
		for(let i = 0; i < guests; i++){
			roomBooking.push({
				_id: freeRooms[room][i],
				roomType: types[room]
			})	
		}
	}

	return roomBooking;
}
Router.post('/', async(req, res) => {
	const {rooms, from, to, guestNumber} = req.body;
	let maxGuests = getMaximumsGuests(rooms);
	let roomTypes = await getRoomTypes(rooms)
	let freeRooms = await getAvailableRooms(from, to, roomTypes);
	let roomStatus = validateRoomAvailability(freeRooms, rooms)
	let bookings = bookRooms(freeRooms, rooms);
	
	if(guestNumber > maxGuests){
		return res.status(400).json({
			errorMessage: `Number of guests,${guestNumber} exceeded maximum,${maxGuests}`
		})
	}

	//Determine availability of number of rooms
	
	if(!roomStatus){
		return res.json({bookings});
		//Proceed to do booking
		let newBooking = new Booking({
			from: dayjs(from).format('YYYY-MM-DD'),
			to: dayjs(to).format('YYYY-MM-DD'),
			rooms: roomIds[0],
			guestNumber
		})

		res.json({
			from: newBooking.from,
			to: newBooking.to,
			rooms: newBooking.rooms,
			guestNumber: Booking.guestNumber
		})
	}else{
		return res.status(400).json(roomStatus)
	}



})
module.exports = Router;
