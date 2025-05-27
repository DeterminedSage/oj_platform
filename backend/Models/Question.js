const mongoose = require('mongoose');
const  Schema = mongoose.Schema;

const questionSchema = new Schema({
  qid: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: { 
    type: String, 
    required: true,
    unique: true
  },
  difficulty: { 
    type: String, 
    enum: ['easy', 'medium', 'hard'], 
    required: true 
  },
  numberOfTests: { 
    type: Number, 
    required: true, 
    min: 5, 
    max: 20 
  },
  testCases: [{
    input: { 
      type: String, 
      required: true 
    },
    output: { 
      type: String, 
      required: true 
    }
  }]
});

const QuesModel = mongoose.model('ques', questionSchema);
module.exports = QuesModel;     


