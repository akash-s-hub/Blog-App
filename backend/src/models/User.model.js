const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: [5, "minimum length is 5"]
  },
  avatarUrl: {
    type: String,
    default: ""
  },
  avatarPublicId: {
    type: String,
    default: ""
  },
  bio: {
    type: String,
    maxlength: [200, "max length is 200 letters"],
    default: ""
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  refreshToken: {
    type: String,
    select: false,
  },
}, { timestamps: true })

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;