const DataLoader = require('dataloader');
const Event = require('../../models/event');
const User = require('../../models/user');
const { dateToString } = require('../../utils/util');

const eventLoader = new DataLoader((eventIds) => events(eventIds));
const userLoader = new DataLoader((userIds) => User.find({ _id: { $in: userIds } }))

const events = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map((event) => {
      return transformEvent(event);
    });
  } catch (err) {
    throw err;
  }
}

const user = async (userId) => {
  try {
    const user = await userLoader.load(userId.toString());
    return {
      ...user._doc,
      createdEvents: () => eventLoader.loadMany(user._doc.createdEvents)
    }
  } catch (err) {
    throw err;
  }
}

const singleEvent = async (eventId) => {
  try {
    const event = await eventLoader.load(eventId.toString());
    return event;
  } catch (err) {
    throw err;
  }
}

const transformBooking = (booking) => {
  return {
    ...booking._doc,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt),
  };
}

const transformEvent = (event) => {
  return {
    ...event._doc,
    date: dateToString(event._doc.date),
    creator: user.bind(this, event._doc.creator),
  }
}

module.exports = {
  transformBooking,
  transformEvent
}
