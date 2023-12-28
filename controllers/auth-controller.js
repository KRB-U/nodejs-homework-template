import UserModel from "../models/contacts/User.js";
import bcrypt from "bcrypt";

import { HttpErr } from "../helpers/HttpErr.js";
import { ctrlWrapper } from "../decorators/index.js";

const saltUserSignUp = 10;
// const hashPassword = async (password) => {
//   const res = await bcrypt.hash(password, saltSignUp);
//   //   console.log(res);
//   const compareResult1 = await bcrypt.compare(password, res);
//   console.log(compareResult1);
// };

// hashPassword("dfdsbgh");

const signup = async (req, res, next) => {
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

  res.json({
    user: {
      username: newUser.email,
      //   password: newUser.password,
    },
  });
  next();
};

const signin = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw HttpErr();
  }
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
};
