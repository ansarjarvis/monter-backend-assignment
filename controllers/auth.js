import cryptoRandomString from "crypto-random-string";
import sendEmail from "../utils/nodemailer.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";

export let registerUser = async (req, res) => {
  let otp = cryptoRandomString({ length: 6, type: "numeric" });

  try {
    const { email, password } = req.body;

    console.log(req.body);

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
