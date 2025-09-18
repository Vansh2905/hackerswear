import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: function() {
      return !this.provider; // Password not required for OAuth users
    }
  },
  provider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },
  providerId: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
