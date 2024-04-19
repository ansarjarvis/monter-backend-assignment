import cryptoRandomString from "crypto-random-string";
import sendEmail from "../utils/nodemailer.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export let registerUser = async (req, res) => {
  let otp = cryptoRandomString({ length: 6, type: "numeric" });

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // checking for existing user
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(400).json({ message: "Email already in use." });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    // creating new user

    const newUser = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      verificationToken: otp,
      verificationExpire: new Date(Date.now() + 3600000),
    });

    await newUser.save();

    // sending user varification code

    let emailText = `your varification code is: ${otp}`;
    await sendEmail(newUser.email, "Varify Your Email", emailText);

    res.status(201).json({
      message:
        "User registered successfully! Please check your email to verify your account.",
      userId: newUser._id,
    });
  } catch (error) {
    res.status(500).json({
      message: " error while registering user.",
      error: error.message,
    });
  }
};

export let varifyUser = async (req, res) => {
  try {
    const { email, otp } = req.body;

    console.log(email);

    const user = await User.findOne({
      email: email.toLowerCase(),
      // verificationExpires: { $gt: new Date() },
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "No user found with this email or OTP has expired." });
    }

    // Check if OTP is correct

    if (user.verificationToken === otp) {
      user.isVerified = true;
      user.verificationToken = undefined; // Clear OTP after successful verification
      user.verificationExpires = undefined;
      await user.save();

      res.status(200).json({ message: "Email verified successfully!" });
    } else {
      res.status(400).json({ message: "Invalid OTP. Please try again." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error verifying email.", error: error.message });
  }
};

export let updateUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { location, age, workDetails } = req.body;

    // Check if the user's account is verified
    const user = await User.findById(userId);
    if (!user.isVerified) {
      return res.status(403).json({ message: "Account is not verified." });
    }

    // Validate user input
    if (age && age < 0) {
      return res
        .status(400)
        .json({ message: "Age must be a positive number." });
    }

    // Update the user's profile
    user.location = location || user.location;
    user.age = age || user.age;
    user.workDetails = workDetails || user.workDetails;

    await user.save();

    // Respond with the updated profile
    res.status(200).json({
      message: "Profile updated successfully!",
      user: {
        location: user.location,
        age: user.age,
        workDetails: user.workDetails,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error during profile update.",
      error: error.message,
    });
  }
};

export let loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {});

    // Respond with token
    res.status(200).json({
      message: "Login successful!",
      token: token,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error during login.", error: error.message });
  }
};

export let userInfo = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Respond with user information
    res.status(200).json({
      message: "User information retrieved successfully.",
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving user information.",
      error: error.message,
    });
  }
};
