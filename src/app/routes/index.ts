import express from "express";
import auth from "../middlewares/auth";
import validateRequest from "../middlewares/validateRequest";
import { AuthController } from "../modules/Auth/auth.controller";
import { AuthValidation } from "../modules/Auth/auth.validation";
import { RequestControllers } from "../modules/Request/request.controller";
import { RequestValidation } from "../modules/Request/request.validation";
import { UserControllers } from "../modules/User/user.controller";
import { UserValidation } from "../modules/User/user.validation";

const router = express.Router();

// Auth routes
router.post("/register", validateRequest(AuthValidation.createUser), AuthController.registerUser);

router.post("/verify-email", validateRequest(AuthValidation.verifyEmail), AuthController.verifyEmail);

router.post(
  "/resend-verification-code",
  validateRequest(AuthValidation.resendVerificationCode),
  AuthController.resendVerificationCode
);

router.post("/login", validateRequest(AuthValidation.loginUser), AuthController.loginUser);

router.post("/forgot-password", validateRequest(AuthValidation.forgotPassword), AuthController.forgotPassword);

router.post("/reset-password", validateRequest(AuthValidation.resetPassword), AuthController.resetPassword);

//! User management routes
router
  .route("/my-profile")
  .get(auth(), UserControllers.getMyProfile)
  .put(auth(), validateRequest(UserValidation.updateProfile), UserControllers.updateMyProfile);

router.put(
  "/change-user-status",
  auth(),
  validateRequest(UserValidation.changeUserStatus),
  UserControllers.changeUserStatus
);

router.put("/change-password", auth(), validateRequest(UserValidation.changePassword), UserControllers.changePassword);

router.put("/make-admin", auth(), validateRequest(UserValidation.makeAdmin), UserControllers.makeAdmin);

//! Donor routes
router.get("/donors", UserControllers.getDonorsList);
router.get("/donor/:id", UserControllers.getSingleDonor);

//! Donation requests routes
router.post(
  "/donation-request",
  auth(),
  validateRequest(RequestValidation.createRequest),
  RequestControllers.createRequest
);

router.get("/requests", auth(), RequestControllers.getRequestsList);

router.get("/request/:id", auth(), RequestControllers.getSingleRequest);

router.put(
  "/update-request/:id",
  auth(),
  validateRequest(RequestValidation.updateRequest),
  RequestControllers.updateRequestStatus
);

router.put("/request-complete-remainder/:id", auth(), RequestControllers.compleatRemainder);

router.get("/get-my-requests", auth(), RequestControllers.getMyDonationRequest);
router.get("/request-to-donate", auth(), RequestControllers.getRequestToDonate);

export default router;
