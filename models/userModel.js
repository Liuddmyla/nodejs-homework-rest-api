const { Schema, model } = require("mongoose");
const bcrypt = require('bcrypt');

const userSchema = Schema({
  password: {
    type: String,
    required: [true, 'Set password for user'],    
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter"
  },
  token: String,
  avatarURL: String
}, {    
   versionKey: false,
})
  

// Pre save hook. Fires on Create and Save.
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

  
const User = model('user', userSchema);

module.exports = User;