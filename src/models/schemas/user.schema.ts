import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: ({
    type: mongoose.Types.ObjectId,
    required: true
  }),
  username: ({
    type: String,
    required: true
  }),
  password: ({
    type: String,
    required: true
  })
})

export const UserModel = mongoose.model('Users', userSchema);