import crypto from "node:crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import User from "../models/auth.js";
import HttpError from "../helpers/HttpError.js";
import mail from "../mail.js";

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
    const verificationToken = crypto.randomUUID();

    const avatarURL = gravatar.url(
      emailToLowerCase,
      { s: "250", d: "robohash" },
      true
    );

    const newUser = await User.create({
      email: emailToLowerCase,
      password: passwordHash,
      verificationToken,
      avatarURL,
    });

    mail.sendMail({
      to: emailToLowerCase,
      from: process.env.MAILTRAP_USER_EMAIL,
      subject: "Welcome to your Contactbook!",
      html: `To confirm your email please click on the <a href="http://${process.env.BASE_URL}/api/users/verify/${verificationToken}">link</a>`,
      text: `To confirm your email please open the link http://${process.env.BASE_URL}/api/users/verify/${verificationToken}`,
      verificationToken,
    });

    res.status(201).json({
      user: {
        email: emailToLowerCase,
        subscription: newUser.subscription,
        avatarURL,
      },
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

    if (user.verify === false) {
      throw HttpError(401, "Please verify your email");
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
