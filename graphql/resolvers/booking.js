const Booking = require('../../models/booking');
const Event = require('../../models/event'); 
const { user, singleEvent } = require('./helpers');

module.exports = {
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => ({
        ...booking._doc,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: new Date(booking._doc.createdAt).toISOString(),
        updatedAt: new Date(booking._doc.updatedAt).toISOString(),
      }));
    } catch (err) {
      throw err;
    }
  },
  bookEvent: async (args) => {
    const event = await Event.findById(args.eventId);
    const booking = new Booking({
      user: '61fceafbfa783b3601b6641b',
      event
    });

    const result = await booking.save();
    return {
      ...result._doc,
      user: user.bind(this, booking._doc.user),
      event: singleEvent.bind(this, booking._doc.event),
      createdAt: new Date(result._doc.createdAt).toISOString(),
      updatedAt: new Date(result._doc.updatedAt).toISOString(),
    }
  }
}
