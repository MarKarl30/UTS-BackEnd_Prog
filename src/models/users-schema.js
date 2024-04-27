const usersSchema = {
  name: String,
  email: String,
  password: String,
  loginAttempt: Number,
  lastAttempt: String,
};

module.exports = usersSchema;
