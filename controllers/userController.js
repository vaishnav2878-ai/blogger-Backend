const User = require( "../models/User.js");

// Get Profile
const getUserProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user.id)
      .select("-password");

    res.status(200).json(user);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Profile
const updateUserProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user.id);

    if (user) {

      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      const updatedUser = await user.save();

      res.status(200).json(updatedUser);

    } else {
      res.status(404).json({
        message: "User not found",
      });
    }

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports={
  getUserProfile,
  updateUserProfile,
};