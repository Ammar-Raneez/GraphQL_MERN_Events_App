const Event = require('../../models/event');
const User = require('../../models/user');

module.exports = {
  events: () => {
    return Event.find();
  },
  createEvent: async (args) => {
    const creator = '61fceafbfa783b3601b6641b';
    const event = new Event({
      title: args.event.title,
      description: args.event.description,
      price: +args.event.price,
      date: new Date(args.event.date),

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
