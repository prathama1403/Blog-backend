const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  review: {
    type: String,
    required: true,
    trim: true,
  },
  post: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
