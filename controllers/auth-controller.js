import UserModel from "../models/contacts/User.js";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

import { HttpErr } from "../helpers/HttpErr.js";
import { ctrlWrapper } from "../decorators/index.js";

import dotenv from "dotenv";

dotenv.config();

const saltUserSignUp = 10;

const { JWT_SECRET } = process.env;

const signup = async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (user) {
    throw HttpErr(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, saltUserSignUp);

  const newUser = await UserModel.create({
    ...req.body,
    password: hashPassword,
  });

  const { email: emailCreatedNewUser, subscription } = newUser;
  res.status(201).json({
    user: {
      //   username: newUser.email,
      //   password: newUser.password,
      email: emailCreatedNewUser,
      subscription,
    },
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });

  if (!user) {
    throw HttpErr(401, "Email or password is wrong");
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

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  getCurrent: ctrlWrapper(getCurrent),
};
