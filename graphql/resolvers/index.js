const eventResolver = require('./event');
const userResolver = require('./user');

const rootResolver = {
  ...eventResolver,
  ...userResolver
}

module.exports = rootResolver;
