module.exports = {
  events: () => {
    return ['Sailing', 'All-night coding']
  },
  createEvent: (args) => {
    const eventName = args.name;
    return eventName;
  }
}
