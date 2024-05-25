import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/auth.js";
import HttpError from "../helpers/HttpError.js";

async function register(req, res, next) {
  const { email, password } = req.body;
  const emailToLowerCase = email.trim().toLowerCase();
  const passwordTrim = password.trim();

  try {
    const user = await User.findOne({ email: emailToLowerCase });
    if (user !== null) {
      throw HttpError(409, "User already registered");
    }

    const passwordHash = await bcrypt.hash(passwordTrim, 10);

    const newUser = await User.create({
      email: emailToLowerCase,
      password: passwordHash,
    });
    res.status(201).json({
      user: { email: emailToLowerCase, subscription: newUser.subscription },
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const emailToLowerCase = email.trim().toLowerCase();

    const user = await User.findOne({ email: emailToLowerCase });

    if (user === null) {
      throw HttpError(401, "Email or password is incorrect");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch === false) {
      throw HttpError(401, "Email or password is incorrect");
    }

    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: 60 * 60 }
    );

    await User.findByIdAndUpdate(user._id, { token });

    res.send({ token, user: { email, subscription: user.subscription } });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    await User.findByIdAndUpdate(req.user._id, { token: null });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

async function current(req, res, next) {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
}

export default { register, login, logout, current };
