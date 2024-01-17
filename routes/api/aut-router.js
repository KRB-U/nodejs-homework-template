import express from "express";

import {
  authenticate,
  isEmptyBody,
  isValidId,
  upload,
} from "../../middleWares/index.js";

import { validateBody } from "../../decorators/validateBody.js";

import {
  userSigninSchema,
  userSignupSchema,
  userEmailSchema,
} from "../../schemes/user-schema.js";

import authController from "../../controllers/auth-controller.js";

const authRouter = express.Router();

authRouter.get("/verify/:verificationCode", authController.verify);

authRouter.post(
  "/verify",
  isEmptyBody,
  validateBody(userEmailSchema),
  authController.verify
);

authRouter.post(
  "/register",
  upload.none(),
  isEmptyBody,
  validateBody(userSignupSchema),
  authController.signup
);

authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  authController.updAvatar
);

authRouter.post(
  "/login",
  isEmptyBody,
  validateBody(userSigninSchema),
  authController.signin
);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/logout", authenticate, authController.logout);

authRouter.patch(
  "/subscription",
  authenticate,
  authController.updateUserSubscription
);

export default authRouter;
