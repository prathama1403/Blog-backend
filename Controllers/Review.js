
const Review = require('../models/Review')
const Traffic = require('../models/Traffic')
exports.createReview =  async (req, res) => {
    try {

      const { email, title, rating, review, postId } = req.body;
  
      // Creating a new review instance
      const newReview = new Review({
        email,
        title,
        rating,
        review,
        post: postId, // Assuming you associate the review with a post using postId
      });
  
      // Saving the review to the database
      const savedReview = await newReview.save();
  
      res.status(201).json({
        success: true,
        review: savedReview,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Error creating the review',
      });
    }
  };

  exports.getLatestReviewsByPost = async (req, res) => {
    try {
       const { postid } = req.query; 
   
      
      const latestReviews = await Review.find({post:postid})
        .sort({ createdAt: -1 }) // Sort by createdAt in descending order to get the latest reviews first
      res.status(200).json({
        success: true,
        reviews: latestReviews,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Error fetching the latest reviews',
      });
    }
  };
  

  exports.createTraffic =  async (req, res) => {
    try {

      const { traffic } = req.body;
  
      // Creating a new review instance
      const newTraffic = new Traffic({
        traffic
      });
  
      // Saving the review to the database
      const savedTraffic= await newTraffic.save();
  
      res.status(201).json({
        success: true,
        traffic: savedTraffic,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Error creating the Traffic',
      });
    }
  };

  exports.getTraffic =  async (req, res) => {
    try {
      // Saving the review to the database
      const savedTraffic= await Traffic.find();
  
      res.status(201).json({
        success: true,
        traffic: savedTraffic,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Error getting the Traffic',
      });
    }
  };

  exports.countReview = async (req, res) => {
    try {
      const reviewCount = await Review.countDocuments();
      res.status(200).json({
        success: true,
        reviewCount,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  };