const Event = require('../../models/event');

module.exports = {
  events: () => {
    return Event.find();
  },
  createEvent: (args) => {
    const event = new Event({
      title: args.event.title,
      description: args.event.description,
      price: +args.event.price,
      date: new Date(args.event.date),
    });

    try {
      return event.save();
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
