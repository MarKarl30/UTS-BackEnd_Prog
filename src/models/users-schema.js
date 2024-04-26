const usersSchema = {
  name: String,
  email: String,
  password: String,
  loginAttempt: Number,
  loginTimeout: Number,
};

module.exports = usersSchema;
