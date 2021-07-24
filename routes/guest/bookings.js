const Booking = require('../../Models/bookings');
const Rooms = require('../../Models/rooms');
const Router = require('express').Router();
const jwt_auth =  require('../../auth/passport-jwt-middleware');
const dayjs = require('dayjs');
const dayOfYear =  require('dayjs/plugin/dayOfYear');

dayjs.extend(dayOfYear);

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

const isDateInvalid = (to, from) => {
	let fromIsBeforeToday = dayjs().isAfter(from, 'd')
	if(fromIsBeforeToday) return {errorMessage: 'Date is invalid'};
	let toIsBeforeToday = dayjs().isAfter(to, 'd')
	if(toIsBeforeToday) return {errorMessage: 'Date is invalid'}
	let toisBeforefrom = dayjs(to).isBefore(from, 'd');
	if(toisBeforefrom) return {errorMessage: 'Date is invalid'}
	let fromIsWithinThreeMonths = dayjs(dayjs().add(1, 'd').add(3, 'M').format('YYYY-MM-DD')).isAfter(from, 'd');
	if(!fromIsWithinThreeMonths) return {errorMessage: 'Booking has to be within three months'}
	let toIsWithinThreeMonths = dayjs(dayjs().add(1, 'd').add(3, 'M').format('YYYY-MM-DD')).isAfter(to, 'd');
	if(!toIsWithinThreeMonths) return {errorMessage: 'Booking has to be within three months'}
	return false;
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

const checkBookingValidity = async(req, res, next) => {
	try{
		const {rooms, from, to, guestNumber} = req.body;
		let dateValidation = isDateInvalid(to, from);
		if(dateValidation){
			return res.status(400).json(dateValidation)
		}
		let maxGuests = getMaximumsGuests(rooms);
		let roomTypes = await getRoomTypes(rooms)
		let freeRooms = await getAvailableRooms(from, to, roomTypes);
		let roomStatus = validateRoomAvailability(freeRooms, rooms)
		
		if(guestNumber > maxGuests){
			return res.status(400).json({
				errorMessage: `Number of guests,${guestNumber} exceeded maximum,${maxGuests}`
			})
		}

		if(roomStatus) return res.status(400).json(roomStatus)
		next();
	}catch(e){
		res.status(500).json({
			errorMessage: "Booking could not be placed at this time"
		})
	}

}

Router.put('/', jwt_auth, (req, res) => {
	return res.json({e : 'done'})
})

Router.post('/', jwt_auth, checkBookingValidity, async(req, res) => {
	try{
		const {rooms, from, to, guestNumber} = req.body;
		const {user} = req;
		let roomTypes = await getRoomTypes(rooms)
		let freeRooms = await getAvailableRooms(from, to, roomTypes);
		let bookings = bookRooms(freeRooms, rooms);

	
		//Proceed to do booking
		let newBooking = new Booking({
			userId:user._id,
			from: dayjs(from).format('YYYY-MM-DD'),
			to: dayjs(to).format('YYYY-MM-DD'),
			rooms: bookings,
			guestNumber
		})

		newBooking.save().then(booking => {
			res.json(booking)
		}).catch(e => {
			res.status(500).json({
				errorMessage: "Booking could not be placed at this time"
			})
		})
	
	}catch(e){
		res.status(500).json({
			errorMessage: "Booking could not be placed at this time"
		})
	}
})
module.exports = Router;