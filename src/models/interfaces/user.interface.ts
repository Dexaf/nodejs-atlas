import mongoose from "mongoose";

export default interface UserInterface {
  _id: mongoose.Types.ObjectId,
  username: String,
  password: String
}