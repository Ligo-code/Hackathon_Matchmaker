import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  skills: [String],
});

const User = mongoose.model("User", userSchema);

export default User;
