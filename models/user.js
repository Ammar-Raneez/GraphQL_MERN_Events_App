const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  createdEvents: [{
    type: Schema.Types.ObjectId,

    // create a connection between event and user, so that
    // a merge can be done by mongoose upon querying
    ref: 'Event'
  }],
});

module.exports = mongoose.model('User', userSchema);
