import express from "express";
import passport from "../../config/auth.js";
import jwt from "jsonwebtoken";

const google_router = express.Router();


google_router.get(
  "/",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
google_router.get(
  "/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Login successful", token });
  }
);

export default google_router;
