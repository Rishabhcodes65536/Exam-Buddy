import express from "express";
import session from "express-session";
import passport from "passport";

import userModel from "../models/user.js";
const router = express.Router();

router.use(passport.initialize());
router.use(passport.session());



function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"],prompt: 'select_account' })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    // successRedirect: '/doubt',
    failureRedirect: "/auth/google/failure",
  }),
  async (req, res) => {
      const userProfile = req.user;
      console.log(userProfile)
    try {
        let user = await userModel.findOne({ email: userProfile.email });
      if (!user) {
        res.redirect("/register");
      } else {
        req.session._id = user._id;
        req.session.name = user.name;
        req.session.email = user.email;
        req.session.occupation = user.occupation;
        res.redirect("/dashboard");
      }
    } catch (error) {
      console.log(error);
      res.redirect("/auth/google/failure");
    }
  }
);

// router.get("/protected", isLoggedIn, (req, res) => {
//   res.send(`Hello ${req.user.displayName}`);
// });

router.get("/google/failure", (req, res) => {
  res.send("Failed to authenticate..");
});

export default router