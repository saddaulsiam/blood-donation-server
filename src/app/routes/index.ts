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

// auth
router.post("/register", validateRequest(AuthValidation.createUser), AuthController.registerUser);

router.post("/verify-email", validateRequest(AuthValidation.verifyEmail), AuthController.verifyEmail);

router.post("/login", validateRequest(AuthValidation.loginUser), AuthController.loginUser);

// user management

router
  .route("/my-profile")
  .get(auth(), UserControllers.getMyProfile)
  .put(auth(), validateRequest(UserValidation.updateProfile), UserControllers.updateMyProfile);

router.put("/change-password", auth(), validateRequest(UserValidation.changePassword), UserControllers.changePassword);

// donors
router.get("/donors", UserControllers.getDonorsList);
router.get("/donor/:id", UserControllers.getSingleDonor);

//  requests
router.post(
  "/donation-request",
  auth(),
  validateRequest(RequestValidation.createRequest),
  RequestControllers.createRequest
);

router.put(
  "/update-request/:id",
  auth(),
  validateRequest(RequestValidation.updateRequest),
  RequestControllers.UpdateRequestStatus
);

router.get("/get-my-requests", auth(), RequestControllers.getMyDonationRequest);
router.get("/request-to-donate", auth(), RequestControllers.getRequestToDonate);

export default router;
