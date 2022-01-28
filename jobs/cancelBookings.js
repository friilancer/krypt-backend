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


