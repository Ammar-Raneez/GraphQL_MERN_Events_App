const Booking = require('../../models/booking');
const Event = require('../../models/event');
const { user, singleEvent, dateToString } = require('./helpers');

const transformBooking = (booking) => {
  return {
    ...booking._doc,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt),
  };
}

module.exports = {
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => transformBooking(booking));
    } catch (err) {
      throw err;
    }
  },
  bookEvent: async (args) => {
    try {
      const event = await Event.findById(args.eventId);
      const booking = new Booking({
        user: '61fceafbfa783b3601b6641b',
        event
      });

      const result = await booking.save();
      return transformBooking(result);
    } catch (err) {
      throw err;
    }
  },
  cancelBooking: async (args) => {
    try {
      // populate gets the event data using the ref attribute in the model
      const booking = await Booking.findById(args.bookingId).populate('event');
      const event = {
        ...booking._doc.event._doc,
        creator: user.bind(this, booking._doc.event._doc.creator)
      };

      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  }
}
