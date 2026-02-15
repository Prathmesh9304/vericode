const User = require('../models/User');
const UserDetails = require('../models/UserDetails');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret_key_change_me', {
    expiresIn: '30d',
  });
};

exports.register = async (req, res) => {
  const { username, email, password, firstName, lastName } = req.body;

  if (!username || !email || !password || !firstName || !lastName) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    const userExists = await User.findOne({ 
        $or: [{ username }, { email }]
    });

    if (userExists) {
      return res.status(400).json({ message: 'User with this username or email already exists' });
    }

    const user = await User.create({
      username,
      email,
      password,
    });

    // Create user details
    await UserDetails.create({
      userId: user._id,
      firstName,
      lastName
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        firstName: firstName,
        lastName: lastName,
        profileImage: "",
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { loginIdentifier, password } = req.body; // loginIdentifier can be username or email

  try {
    // Check for user by username OR email
    const user = await User.findOne({
        $or: [{ username: loginIdentifier }, { email: loginIdentifier }]
    });

    if (user && (await user.comparePassword(password))) {
      const details = await UserDetails.findOne({ userId: user._id });
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        firstName: details ? details.firstName : '',
        lastName: details ? details.lastName : '',
        profileImage: details ? details.profileImage : '',
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const details = await UserDetails.findOne({ userId: req.user.id });
        
        // console.log("getMe returning profileImage:", details ? details.profileImage : 'null');
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            firstName: details ? details.firstName : '',
            lastName: details ? details.lastName : '',
            profileImage: details ? details.profileImage : '',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}
const fs = require('fs');
const path = require('path');

exports.updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, bio, removeProfileImage } = req.body;
        const userId = req.user.id;

        let userDetails = await UserDetails.findOne({ userId });

        if (!userDetails) {
            return res.status(404).json({ message: 'User details not found' });
        }

        // Update basic fields
        if (firstName) userDetails.firstName = firstName;
        if (lastName) userDetails.lastName = lastName;
        if (bio) userDetails.bio = bio;

        // Helper to delete local file
        const deleteLocalImage = (relativePath) => {
            if (!relativePath || relativePath.startsWith('http')) return;
            // relativePath is like 'uploads/filename.jpg'
            // We need absolute path. authController is in src/controllers
            // Root is ../../..
            const absolutePath = path.join(__dirname, '../../', relativePath);
            fs.unlink(absolutePath, (err) => {
                if (err) console.error("Failed to delete old image:", err);
                else console.log("Deleted old image:", absolutePath);
            });
        };

        // Handle Profile Image
        if (req.file) {
            // New image uploaded. Delete old one if exists.
            if (userDetails.profileImage) {
                if (process.env.IMG_UPLOAD === 'cloud') {
                     // Cloudinary deletion logic (omitted for now as requested/scope)
                } else {
                    deleteLocalImage(userDetails.profileImage);
                }
            }

            // Set new image path
            if (process.env.IMG_UPLOAD === 'cloud') {
                userDetails.profileImage = req.file.path;
            } else {
                console.log("Saving local profile image:", req.file.filename);
                userDetails.profileImage = `uploads/${req.file.filename}`;
            } 
        } else if (removeProfileImage === 'true') {
            // Remove current image
            if (userDetails.profileImage) {
                 if (process.env.IMG_UPLOAD === 'cloud') {
                    // Cloudinary deletion logic
                 } else {
                    deleteLocalImage(userDetails.profileImage);
                 }
            }
            userDetails.profileImage = "";
        }

        await userDetails.save();

        // Fetch updated user to return consistent response
        const user = await User.findById(userId).select('-password');

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            profileImage: userDetails.profileImage,
            bio: userDetails.bio
        });

    } catch (error) {
        console.error("Profile Update Error:", error);
        res.status(500).json({ message: 'Server error during profile update' });
    }
};
