const Booking = require('../../models/booking');
const Event = require('../../models/event');
const { transformBooking, transformEvent } = require('./merge');

module.exports = {
  bookings: async (_, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated');
    }

    try {
      const bookings = await Booking.find({ user: req.user.id });
      return bookings.map((booking) => transformBooking(booking));
    } catch (err) {
      throw err;
    }
  },
  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated');
    }

    try {
      const event = await Event.findById(args.eventId);
      const booking = new Booking({
        user: req.userId,
        event
      });

      const result = await booking.save();
      return transformBooking(result);
    } catch (err) {
      throw err;
    }
  },
  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated');
    }

    try {
      // populate gets the event data using the ref attribute in the model
      const booking = await Booking.findById(args.bookingId).populate('event');
      await Booking.deleteOne({ _id: args.bookingId });
      return transformEvent(booking._doc.event);
    } catch (err) {
      throw err;
    }
  }
}
