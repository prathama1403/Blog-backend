const Post = require("../models/Post");
const Category = require("../models/Category");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 300 });

const clearCacheForPostsPage = async () => {
  const perPage = 12;
  const totalPosts = await Post.countDocuments();
  // Clear the cache for all pages
  for (let page = 1; page <= Math.ceil(totalPosts / perPage); page++) {
    const cacheKey = `posts_page_${page}`;
    cache.del(cacheKey);
  }
};

//create post
exports.createPost = async (req, res) => {
  const {
    title,
    content,
    postedBy,
    likes,
    comments,
    category,
    seoTitle,
    seoDescription,
    canonical,
    postUrl,
    keywords,
    thumbnailImage
  } = req.body;

  try {
    
 

    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category Details Not Found",
      });
    }

    const post = await Post.create({
      title,
      content,
      postedBy,
      seoTitle,
      seoDescription,
      canonical,
      category: categoryDetails._id,
      postUrl,
      keywords,
      image: thumbnailImage,
    });

    const categoryDetails2 = await Category.findByIdAndUpdate(
      { _id: category },
      {
        $push: {
          posts: post._id,
        },
      },
      { new: true }
    );

    res.status(201).json({
      success: true,
      post,
    });
  } catch (error) {
    console.log(error);
  }
};

// Show single post
exports.showSinglePost = async (req, res) => {
  try {
    const { url } = req.query; // Get the URL from the request body

    console.log(url);

    const post = await Post.findOne({
      postUrl: url,
    })
      .populate("category")
      .exec();

    if (post) {
      res.status(200).json({
        success: true,
        post,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

//delete post
exports.deletePost = async (req, res) => {
  const { postId } = req.body;

  try {
    // Remove the post
    const post = await Post.findByIdAndRemove(postId);
    console.log(post);

    // If the post was successfully deleted, remove its reference from the category
    if (post) {
      await Category.findOneAndUpdate(
        { _id: post.category }, // Use the correct field for the unique identifier
        { $pull: { posts: post._id } },
        { new: true }
      );

      clearCacheForPostsPage();

      res.status(200).json({
        success: true,
        message: "Post deleted successfully",
      });
    } else {
      // If the post wasn't found, return an error
      res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//edit post
exports.editPost = async (req, res) => {
  try {
    // Retrieve the edited data from the request body
    const {
      postId,
      title,
      content,
      category,
      postedBy,
      seoTitle,
      seoDescription,
      canonical,
      postUrl,
      keywords,
    } = req.body;

    // Find the post you want to edit by its ID
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post Not Found",
      });
    }
    console.log("before");
    // Update the post properties
    post.title = title || post.title;
    post.content = content || post.content;
    post.seoTitle = seoTitle || post.seoTitle;
    post.seoDescription = seoDescription || post.seoDescription;
    post.canonical = canonical || post.canonical;
    post.postUrl = postUrl || post.postUrl;
    post.category = category || post.category;
    post.postedBy = postedBy || post.postedBy;
    post.keywords = keywords || post.keywords;

    if (req.files) {
      console.log("thumbnail update");
      const thumbnail = req.files.thumbnailImage;
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      );
      post.thumbnail = thumbnailImage.secure_url;
    }

    // Save the updated post
    await post.save();
    clearCacheForPostsPage();
    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error while editing the post",
    });
  }
};

exports.showPost = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const perPage = 5;

    const totalPosts = await Post.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page < 1 || page > totalPages) {
      return res.status(400).json({
        success: false,
        message: "Invalid page number",
      });
    }

    const skipAmount = (page - 1) * perPage;

    const posts = await Post.find()
      .sort({ createdAt: -1, _id: -1 }) // Ensure unique sorting
      .populate("category")
      .skip(skipAmount)
      .limit(perPage);

    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: totalPages,
      posts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};




exports.showAllPost = async (req, res) => {
  try {
    const posts = await Post.find().populate("category");

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

exports.showSinglePostById = async (req, res) => {
  try {
    const { url } = req.body; // Get the URL from the request body

    const post = await Post.findById(url).populate("category").exec();

    if (post) {
      res.status(200).json({
        success: true,
        post,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

exports.getLatestPosts = async (req, res) => {
  try {
    const latestPosts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .populate("category");

    res.status(200).json({
      success: true,
      latestPosts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

exports.countPosts = async (req, res) => {
  try {
    const postCount = await Post.countDocuments();
    res.status(200).json({
      success: true,
      postCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};