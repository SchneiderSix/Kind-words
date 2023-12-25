import mongoose from "mongoose";

const { Schema } = mongoose;

/**
 * Letter Schema
 */
const letterSchema = new Schema({
  content: {
    type: String,
    unique: true
  },
  votes: Number,
  sentiment: String
}, {
  timestamps: true,
});

export const letterModel = mongoose.model('Letter', letterSchema);