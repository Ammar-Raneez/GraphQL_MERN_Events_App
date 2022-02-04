const Event = require('../../models/event');
const User = require('../../models/user');

module.exports = {
  events: async () => {
    const events = await Event.find();
    return events.map(async (event) => {
      return {
        ...event._doc,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event._doc.creator),
      }
    });
  },
  createEvent: async (args) => {
    const creatorId = '61fceafbfa783b3601b6641b';
    const event = new Event({
      title: args.event.title,
      description: args.event.description,
      price: +args.event.price,
      date: new Date(args.event.date).toISOString(),
      creator: creatorId,
    });

    try {
      const creator = await User.findById(creatorId);
      creator.createdEvents.push(event);
      await creator.save();
      await event.save();
      return {
        ...event,
        creator: user.bind(this, event.creator)
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

const user = async (userId) => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      createdEvents: events.bind(this, user._doc.createdEvents)
    }
  } catch (err) {
    throw err;
  }
}

const events = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map(async (event) => {
      return {
        ...event._doc,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event._doc.creator),
      };
    });
  } catch (err) {
    throw err;
  }
}
