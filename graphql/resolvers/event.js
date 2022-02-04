const Event = require("../../models/event");

const events = [];

module.exports = {
  events: () => {
    return events;
  },
  createEvent: async (args) => {
    const event = new Event({
      title: args.event.title,
      description: args.event.description,
      price: +args.event.price,
      date: new Date(args.event.date),
    });

    try {
      return await event.save();
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
