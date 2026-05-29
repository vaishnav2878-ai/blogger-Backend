const Blog = require("../models/Blog");


// CREATE BLOG
const createBlog = async (req, res) => {
  try {

    const { title, description, category } = req.body;

    const newBlog = await Blog.create({
      title,
      description,
      category,
      image: req.file ? req.file.path : "",



      user: req.user.id,
    });

    res.status(201).json({
      message: "Blog Created Successfully",
      newBlog,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


// GET ALL BLOGS
const getBlogs = async (req, res) => {
  try {

    const blogs = await Blog.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(blogs);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


// GET SINGLE BLOG
const getSingleBlog = async (req, res) => {
  try {

    const blog = await Blog.findById(req.params.id)
      .populate("user", "name email");

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }
    // Only count view if not the blog owner
    const viewedBlogs = req.headers["x-viewed-blogs"];
    const alreadyViewed = viewedBlogs && viewedBlogs.includes(req.params.id);


if(!alreadyViewed){

    // Increase view count
    blog.views += 1;

    await blog.save();
}

    res.status(200).json(blog);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


// UPDATE BLOG
const updateBlog = async (req, res) => {
  try {

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    // Authorization
    if (blog.user.toString() !== req.user.id) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    blog.title = req.body.title || blog.title;

    blog.description =
      req.body.description || blog.description;

    blog.category =
      req.body.category || blog.category;

    if (req.file) {
     blog.image = req.file.path; 

    }

    const updatedBlog = await blog.save();

    res.status(200).json({
      message: "Blog Updated Successfully",
      updatedBlog,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


// DELETE BLOG
const deleteBlog = async (req, res) => {
  try {

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    // Authorization
    if (blog.user.toString() !== req.user.id) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    await blog.deleteOne();

    res.status(200).json({
      message: "Blog Deleted Successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};
// LIKE / UNLIKE BLOG
const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const alreadyLiked = blog.likes.includes(req.user.id);

    if (alreadyLiked) {
      // Unlike
      blog.likes = blog.likes.filter(
        (id) => id.toString() !== req.user.id
      );
    } else {
      // Like
      blog.likes.push(req.user.id);
    }

    await blog.save();

    res.status(200).json({
      message: alreadyLiked ? "Unliked" : "Liked",
      likes: blog.likes.length,
      liked: !alreadyLiked,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBlog,
  getBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
  likeBlog
};