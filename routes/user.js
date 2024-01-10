const express = require("express");
const router = express.Router();
const { signup, login, revalidatepost } = require("../Controllers/Auth");
const{createReview,getLatestReviewsByPost, createTraffic,getTraffic,countReview} = require('../Controllers/Review')
const { auth, isAdmin } = require("../middlewares/auth");
const {contactUsController} = require('../Controllers/Contact');
const {
  createPost,
  showPost,
  showSinglePost,
  editPost,
  deletePost,
  showAllPost,
  showSinglePostById,
  getLatestPosts,
  countPosts
} = require("../Controllers/Post");
const {
  createCategory,
  showAllCategories,
  categoryPageDetailspage,
  categoryPageDetails,
  
} = require("../Controllers/Category");


//auth

router.post("/signup", signup);
router.post("/login", login);
router.get('/rev',revalidatepost)
//categories
router.post("/createcategory", auth, isAdmin, createCategory);
router.get("/showallcategory", showAllCategories);
router.post("/showsinglecategory", categoryPageDetails);
router.get("/showpaginationcategory", categoryPageDetailspage);
//posts
router.get("/countpost", countPosts);
router.post("/createpost", auth, isAdmin, createPost);
router.put("/editpost", auth, isAdmin, editPost);
router.post("/deletepost", auth, isAdmin, deletePost);
router.get("/showallpost", showPost);
router.get("/showallpostall", showAllPost);
router.get("/showlatestpost", getLatestPosts);
router.get("/showsinglepost", showSinglePost);
router.post("/showsinglepostbyid", showSinglePostById);
//reviews
router.post("/createreview", createReview);
router.get("/latestreviews", getLatestReviewsByPost);
router.post("/createtraffic" ,auth, isAdmin, createTraffic);
router.get("/gettraffic", getTraffic);
router.get("/getreviews", countReview);



//contact
router.post('/contact',contactUsController);
module.exports = router;
