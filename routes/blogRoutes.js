const express = require("express");
const {
  createBlog,
  getBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
} = require("../controllers/blogController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

const handleUpload = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      console.log("UPLOAD ERROR:", JSON.stringify(err), err.message, err.stack);
      return res.status(500).json({ message: err.message || "Upload failed" });
    }
    next();
  });
};

router.post("/create", protect, handleUpload, createBlog);
router.get("/", getBlogs);
router.get("/:id", getSingleBlog);
router.put("/:id", protect, handleUpload, updateBlog);
router.delete("/:id", protect, deleteBlog);
router.put("/:id/like", protect, likeBlog);

module.exports = router;