const bcrypt = require('bcryptjs')
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
  }
}