"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const checkAuth_1 = require("../../middlewares/checkAuth");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_const_1 = require("../user/user.const");
const auth_controller_1 = require("./auth.controller");
const auth_validations_1 = require("./auth.validations");
const admin_password_controller_1 = require("./admin-password.controller");
const admin_password_validation_1 = require("./admin-password.validation");
const router = express_1.default.Router();
// Individual routes
router.post("/register", (0, validateRequest_1.default)(auth_validations_1.AuthValidations.registerUser), auth_controller_1.AuthController.registerUser);
router.post("/login", (0, validateRequest_1.default)(auth_validations_1.AuthValidations.loginUser), auth_controller_1.AuthController.loginUser);
router.post("/logout/:id", auth_controller_1.AuthController.logOutUser);
router.post("/login/provider", (0, validateRequest_1.default)(auth_validations_1.AuthValidations.loginUserUsingProvider), auth_controller_1.AuthController.loginUserUsingProvider);
// 🔹 Resend OTP (already implemented earlier)
router.post("/verify-email", auth_controller_1.AuthController.verifyEmail);
router.post("/resend-otp", auth_controller_1.AuthController.resendOtp);
router.post("/forgot-password", auth_controller_1.AuthController.forgotPassword);
router.post("/reset-password-otp", auth_controller_1.AuthController.resetPasswordWithOtp);
router.post("/reset-password", auth_controller_1.AuthController.resetPassword);
router.get("/google", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const redirect = req.query.redirect || "";
    passport_1.default.authenticate("google", {
        scope: ["profile", "email"],
        state: redirect,
    })(req, res, next);
}));
router.get("/google/callback", passport_1.default.authenticate("google", { failureRedirect: "/login" }), auth_controller_1.AuthController.googleCallbackController);
router.get("/me", (0, checkAuth_1.checkAuth)(...Object.values(user_const_1.userRoles)), auth_controller_1.AuthController.gatMe);
// Admin-specific password change route
router.post("/admin/change-password", (0, checkAuth_1.checkAuth)("admin", "super-admin"), (0, validateRequest_1.default)(admin_password_validation_1.AdminPasswordValidations.changeAdminPasswordSchema), admin_password_controller_1.AdminPasswordController.changeAdminPassword);
exports.AuthRoutes = router;
