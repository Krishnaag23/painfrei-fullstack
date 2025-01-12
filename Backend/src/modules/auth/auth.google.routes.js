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

    res.redirect(
      `${process.env.FRONTEND_URL}/product/675596a8f4f20366005ce1e1/?token=${token}`
    );
  }
);

export default google_router;
