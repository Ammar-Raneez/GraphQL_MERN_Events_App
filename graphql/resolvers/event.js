const events = [];

module.exports = {
  events: () => {
    return events;
  },
  createEvent: (args) => {
    const event = {
      _id: Math.random().toString(),
      title: args.event.title,
      description: args.event.description,
      price: +args.event.price,
      date: new Date().toISOString(),
    }

    events.push(event);
    return event;
  }
}
