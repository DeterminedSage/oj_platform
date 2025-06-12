const mongoose = require('mongoose');
const  Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  questionsSolvedTotal: {
    type: Number,
    default: 0,
  },
  questionsSolvedEasy: {
    type: Number,
    default: 0,
  },
  questionsSolvedMedium: {
    type: Number,
    default: 0,
  },
  questionsSolvedHard: {
    type: Number,
    default: 0,
  },
  solvedQuestions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'ques', 
    }
  ],
});

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;


