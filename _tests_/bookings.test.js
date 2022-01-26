const {getRoomTypes, getMaximumsGuests, validateRoomAvailability, isDateInvalid} = require('../controllers/bookingControllers')
const dayjs = require('dayjs');
const dayOfYear =  require('dayjs/plugin/dayOfYear');
dayjs.extend(dayOfYear);

describe('Calculate Maximum Guests', () => {
    test.each([
        {bookings: {doubleDeluxe:2, deluxe:1, single:1}, expected: 8},
        {bookings: {deluxe:1, single:1}, expected: 4},        
      ])('.Total Possible Bookings($bookings)', ({bookings, expected}) => {
        expect(getMaximumsGuests({doubleDeluxe:2, deluxe:1, single:1})).toBeDefined()
        expect(getMaximumsGuests({...bookings})).toEqual(expected)
      }, 3000);
    test('Total Possible Bookings', () => {
        expect(getMaximumsGuests({doubleDeluxe:2, deluxe:1, single:1})).not.toEqual(6)
    }, 5000)
})

describe('Validate Booking dates', () => {
    let yesterday = dayjs().subtract(1, 'd')
    let tomorrow = dayjs().add(1, 'd')
    let moreThanThreeMonthsFromToday = dayjs().add(3, 'd').add(3, 'M').format('YYYY-MM-DD')
    
    test.each([
        {a:tomorrow, b:yesterday, expected: {errorMessage: 'Date is invalid'}},
        {a:yesterday, b:tomorrow, expected: {errorMessage: 'Date is invalid'}}
    ])('.Date Validation($a, $b)', ({a, b, expected}) => {
        expect(isDateInvalid(a, b)).toBeDefined()
        expect(isDateInvalid(a, b)).toEqual(expected)
    }, 5000)
    test('To is More Than Three months from Today' , () => {
        expect(isDateInvalid(moreThanThreeMonthsFromToday, tomorrow)).toEqual({errorMessage: 'Booking has to be within three months'})
    }, 5000)
    test('To is More Than Three months from Today' , () => {
        expect(isDateInvalid(dayjs(moreThanThreeMonthsFromToday).add(1, 'd') ,moreThanThreeMonthsFromToday)).toEqual({errorMessage: 'Booking has to be within three months'})
    }, 5000)
    test('From is Before Today' , () => {
        expect(isDateInvalid(tomorrow, dayjs())).toBeFalsy()
    }, 5000)
})

describe('Get RoomTypes Function', () => {
    let booking = {
		doubleDeluxe: 0,
		deluxe: 1,
		single: 2
	}
    test('Test 1', async() => {
        let data = await getRoomTypes(booking)
        expect(data).toBeDefined()
        expect(data).toContain('Deluxe')
    }, 5000)

    test('Test 2', async() => { 
        await expect(getRoomTypes(booking)).resolves.not.toContain('Double Deluxe')
    }, 5000)
})


