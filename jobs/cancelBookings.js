const schedule = require('node-schedule');
const Booking = require('../Models/bookings');
const dayjs = require('dayjs');
const dayOfYear =  require('dayjs/plugin/dayOfYear');

dayjs.extend(dayOfYear);

const rule = new schedule.RecurrenceRule();
rule.hour = '11'
rule.second = '0'
rule.minute = '0'
rule.tz = 'Etc/UTC'

module.exports = () => schedule.scheduleJob(rule, async() => {
    try{
        let bookings = await Booking.find({
            to: {
                $lte: dayjs().format('YYYY-MM-DD')
            }
        }).select('expired')

       for(let i = 0; i < bookings.length; i++){
           bookings[i].expired = true;
           await bookings[i].save()
       }
        console.log('Expired Bookings have been cancelled')

    }catch(e){
        console.log(e)
        console.log('Cancelling of Bookings could not be done')
    }

})
