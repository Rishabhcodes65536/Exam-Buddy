import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  question: {
    type: String,
    required: true
  },
  student_response: {
    type: String,
    default: ''
  },
  final_answer: {
    type: String,
    default: ''
  },
  topic: String,
  total_marks: {
    type: Number, 
  },
  allocated_marks: {
    type: Number,
  },
  mode: {
    type: String,
    enum: ['answer', 'metacognition'],
    default:'answer'
  },
  attempted_at: {
    type: Date,
    default: Date.now
  },
  feedback: { 
    type: String,
    default: ""
  }
}, {
  timestamps: true 
});

const questionModel = mongoose.model('Quest', questionSchema);

export default questionModel;
