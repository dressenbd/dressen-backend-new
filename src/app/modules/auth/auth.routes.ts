import express, { NextFunction, Request, Response } from "express";
import passport from "passport";
import { checkAuth } from "../../middlewares/checkAuth";
import validateRequest from "../../middlewares/validateRequest";
import { userRoles } from "../user/user.const";
import { AuthController } from "./auth.controller";
import { AuthValidations } from "./auth.validations";
import { AdminPasswordController } from "./admin-password.controller";
import { AdminPasswordValidations } from "./admin-password.validation";

const router = express.Router();

// Individual routes

router.post(
  "/register",
  validateRequest(AuthValidations.registerUser),
  AuthController.registerUser
);

router.post(
  "/login",
  validateRequest(AuthValidations.loginUser),
  AuthController.loginUser
);

router.post("/logout/:id", AuthController.logOutUser);

router.post(
  "/login/provider",
  validateRequest(AuthValidations.loginUserUsingProvider),
  AuthController.loginUserUsingProvider
);
// 🔹 Resend OTP (already implemented earlier)
router.post("/verify-email", AuthController.verifyEmail);
router.post("/resend-otp", AuthController.resendOtp);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password-otp", AuthController.resetPasswordWithOtp);
router.post("/reset-password", AuthController.resetPassword);

router.get(
  "/google",
  async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "";
    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: redirect as string,
    })(req, res, next);
  }
);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  AuthController.googleCallbackController
);

router.get("/me", checkAuth(...Object.values(userRoles)), AuthController.gatMe);

// Admin-specific password change route
router.post(
  "/admin/change-password",
  checkAuth("admin", "super-admin"),
  validateRequest(AdminPasswordValidations.changeAdminPasswordSchema),
  AdminPasswordController.changeAdminPassword
);

export const AuthRoutes = router;
