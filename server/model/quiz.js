const mongoose=require('mongoose');

const optionSchema = new mongoose.Schema({
    type: { type: String, required: true },
    text: { type: String, required: false },
    imageUrl: { type: String, required: false },
    textImage:{type: String ,required: false}, 
    attempts: [{ type: Number}],
    isCorrect: { type: Boolean, default: false } 
  });
  
  const questionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    options: [optionSchema],
    answer: { type: String, required: true },
    timer: { type: Number, required: false },
    totalAttempts: { type: Number, default: 0 },
    correctAttempts: { type: Number, default: 0 },
    incorrectAttempts: { type: Number, default: 0 },
    isCorrect: { type: Boolean, default: false } 
  });

const quizSchema= new mongoose.Schema({

    creator:
     { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
     },
    title:{
        type: String,
        required: true,
    },
    questions: [
        questionSchema
    ],
    type: 
    { type: String,
         required: true 
    },
    impressions:
    {
        type: Number,
        default: 0
    },
    totalQuizAttempts: {
        type: Number,
        default: 0
    },
    totalQuizCorrectAttempts: {
        type: Number,
        default: 0
    },
    totalQuizIncorrectAttempts: {
        type: Number,
        default: 0
    }
},
{timestamps: {createdAt: "createdAt", updatedAt:"updatedAt"}}
)
module.exports=mongoose.model("Quiz", quizSchema);
