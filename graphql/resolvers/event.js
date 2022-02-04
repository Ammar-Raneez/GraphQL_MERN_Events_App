const Event = require('../../models/event');
const User = require('../../models/user');
const { transformEvent } = require('./merge');
const { dateToString } = require('../../utils/util');

module.exports = {
  events: async () => {
    const events = await Event.find();
    return events.map(async (event) => {
      return transformEvent(event);
    });
  },
  createEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated');
    }

    const creatorId = req.userId;
    const event = new Event({
      title: args.event.title,
      description: args.event.description,
      price: +args.event.price,
      date: dateToString(args.event.date),
      creator: creatorId,
    });

    try {
      const creator = await User.findById(creatorId);
      creator.createdEvents.push(event);
      await creator.save();
      const savedEvent = await event.save();
      return transformEvent(savedEvent);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
