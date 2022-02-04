const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user')

module.exports = {
  createUser: async (args) => {
    try {
      const existingUser = await User.findOne({ email: args.user.email });
      if (!existingUser) {
        const hash = await bcrypt.hash(args.user.password, 12);
        const user = await new User({
          email: args.user.email,
          password: hash,
        });

        return user.save();
      }

      throw new Error('Invalid input');
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  login: async (args) => {
    const user = await User.findOne({ email: args.email });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isEqual = await bcrypt.compare(args.password, user.password);
    if (!isEqual) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.SECRET_KEY, {
        expiresIn: '1h'
      });

    return {
      userId: user.id,
      tokenExpiration: 1,
      token
    }
  }
}