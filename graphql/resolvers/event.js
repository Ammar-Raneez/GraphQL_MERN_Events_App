const Event = require('../../models/event');
const User = require('../../models/user');

module.exports = {
  events: async () => {
    const events = await Event.find();
    return events.map(async (event) => {
      const creator = await user(event.creator);
      return {
        ...event._doc,
        date: new Date(event._doc.date).toISOString(),
        creator
      }
    });
  },
  createEvent: async (args) => {
    const creator = '61fceafbfa783b3601b6641b';
    const event = new Event({
      title: args.event.title,
      description: args.event.description,
      price: +args.event.price,
      date: new Date(args.event.date).toISOString(),

      // mongoose automatically converts this to ObjectId
      creator
    });

    try {
      const user = await User.findById(creator);
      user.createdEvents.push(event);
      await user.save();
      return event.save();
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

const user = async (userId) => {
  try {
    const user = await User.findById(userId);
    const createdEvents = await events(user.createdEvents);
    return {
      ...user._doc,
      createdEvents
    }
  } catch (err) {
    throw err;
  }
}

const events = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map(async (event) => {
      const creator = await user(event.creator);
      return {
        ...event._doc,
        date: new Date(event._doc.date).toISOString(),
        creator,
      };
    });
  } catch (err) {
    throw err;
  }
}
