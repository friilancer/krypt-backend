const dayjs = require('dayjs');
const dayOfYear =  require('dayjs/plugin/dayOfYear');
dayjs.extend(dayOfYear);

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
	
		if(freeRooms[room].length > 0 && guests > freeRooms[room].length){
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
	for(let [room, selections] of Object.entries(rooms)){
		for(let i = 0; i < selections; i++){
			roomBooking.push({
				_id: freeRooms[room][i],
				roomType: types[room]
			})	
		}
	}

	return roomBooking;
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

module.exports = {
    bookRooms,
    validateRoomAvailability,
    getMaximumsGuests,
    getRoomTypes,
    isDateInvalid
}