import jwt from "jsonwebtoken";
import User from "./models/user.js";

import dotenv from "dotenv";

dotenv.config();

const authMiddleware = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token provided, authorization denied." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password"); // Exclude password from user data

    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized" });
  }
};

export default authMiddleware;
