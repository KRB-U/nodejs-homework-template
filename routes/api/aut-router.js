import express from "express";

import { isEmptyBody, isValidId } from "../../middleWares/index.js";

import { validateBody } from "../../decorators/validateBody.js";

import {
  userSigninSchema,
  userSignupSchema,
} from "../../schemes/user-schema.js";

import authController from "../../controllers/auth-controller.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  isEmptyBody,
  validateBody(userSignupSchema),
  authController.signup
);

authRouter.post(
  "/login",
  isEmptyBody,
  validateBody(userSigninSchema),
  authController.signin
);

export default authRouter;
