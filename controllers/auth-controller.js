import { nanoid } from "nanoid";
import UserModel from "../models/contacts/User.js";
import bcrypt from "bcrypt";
import path from "path";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import Jimp from "jimp";

// import { HttpErr } from "../helpers/HttpErr.js";
import { HttpErr, sendEmail } from "../helpers/index.js";

import { ctrlWrapper } from "../decorators/index.js";

import dotenv from "dotenv";
import { userSchema } from "../models/contacts/User.js";
import gravatar from "gravatar";

dotenv.config();

const saltUserSignUp = 10;

const { JWT_SECRET, BASE_URL, FRONT_BASE_URL } = process.env;

const signup = async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });
  if (user) {
    throw HttpErr(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, saltUserSignUp);

  const avatarURL = gravatar.url(email);

  const verificationCode = nanoid();

  const newUser = await UserModel.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationCode,
  });

  const { email: emailCreatedNewUser, subscription } = newUser;

  const verifyEmail = {
    to: email,
    subject: "Verify email ",
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationCode}">Click for verify</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    user: {
      email: emailCreatedNewUser,
      subscription,
    },
  });
};

const verify = async (req, res) => {
  const { verificationCode } = req.params;

  const user = await UserModel.findOne({ verificationCode });
  if (!user) {
    throw HttpErr(404, "User not found");
  }

  await UserModel.findByIdAndUpdate(user._id, {
    verify: true,
    verificationCode: "",
  });

  res.json({ message: "Verification successful" });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw HttpErr(404, "Email not found");
  }

  if (user.verify) {
    throw HttpErr(400, "Verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email ",
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationCode}">Click for verify</a>`,
  };

  await sendEmail(verifyEmail);

  res.json({ message: "Verification email sent" });
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });

  if (!user) {
    throw HttpErr(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw HttpErr(401, "Email not verify");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpErr(401, "Email or password is wrong");
  }

  const { _id: id } = user;

  const payload = {
    id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await UserModel.findByIdAndUpdate(id, { token });

  res.json({
    token: token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await UserModel.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json();
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;

  const user = await UserModel.findOne({ email });

  if (!user) {
    throw HttpErr(404, "user not found");
  }

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "22h" });

  const sendEmailOptions = {
    to: email,
    subject: "forget password",
    html: `<a target="_blank" href="${FRONT_BASE_URL}/forgPassword.html?token=${token}">Click for recovery password</a>`,
  };

  sendEmail(sendEmailOptions);

  res.json({ message: "success" });
};

const recoveryPassword = async (req, res) => {
  const { authorization: token } = req.headers;

  const { id: _id } = jwt.verify(token, JWT_SECRET);

  if (!_id) {
    throw HttpErr(403, "ivalid token");
  }

  const hashPwd = await bcrypt.hash(req.body.password, 10);

  const user = await UserModel.findByIdAndUpdate(_id, {
    password: hashPwd,
  });

  return res.status(302).redirect(`${FRONT_BASE_URL}/loginForm.html`);
};

const updateUserSubscription = async (req, res) => {
  const { subscription } = req.body;
  const { _id } = req.user;

  const validValueSubscr = userSchema.path("subscription").enumValues;

  if (!validValueSubscr.includes(subscription)) {
    throw HttpErr(400, "Invalid subscription value");
  }

  const user = await UserModel.findByIdAndUpdate(_id, { subscription });

  if (!user) {
    throw HttpErr(404, "User not found");
  }

  res.json(user);
};

const avatarDir = path.resolve("public", "avatars");

const updAvatar = async (req, res) => {
  const { _id } = req.user;

  const { path: tempUpload, originalname } = req.file;
  const uniqueName = `${_id}_${originalname}`;
  const pathRedirectFile = path.join(avatarDir, uniqueName);

  await fs.rename(tempUpload, pathRedirectFile);

  const avatarURL = path.join("avatars", uniqueName);
  await UserModel.findByIdAndUpdate(_id, { avatarURL });

  const image = await Jimp.read(pathRedirectFile);
  await image.resize(250, 250).writeAsync(pathRedirectFile);

  res.json({
    avatarURL,
  });
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateUserSubscription: ctrlWrapper(updateUserSubscription),
  updAvatar: ctrlWrapper(updAvatar),
  verify: ctrlWrapper(verify),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  forgetPassword: ctrlWrapper(forgetPassword),
  recoveryPassword: ctrlWrapper(recoveryPassword),
};
