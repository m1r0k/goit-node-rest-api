import * as fs from "node:fs";
import path from "node:path";
import jimp from "jimp";
import User from "../models/auth.js";
import HttpError from "../helpers/HttpError.js";

async function getAvatar(req, res, next) {
  try {
    const user = await User.findById(req.user.id);

    if (user === null) {
      return res.status(404).send({ message: "User not found" });
    }

    if (user.avatarURL === null) {
      return res.status(404).send({ message: "Avatar not found" });
    }

    res.sendFile(path.resolve("public/avatars", user.avatarURL));
  } catch (error) {
    next(error);
  }
}

async function uploadAvatar(req, res, next) {
  try {
    const { path: tempPath, filename } = req.file;
    const [name, extension] = filename.split(".");
    const newFileName = `${req.user.id}-${Date.now()}.${extension}`;
    const publicPath = path.resolve("public/avatars", newFileName);

    const image = await jimp.read(tempPath);
    await image.resize(250, 250).writeAsync(publicPath);

    await fs.unlink(tempPath);

    const avatarURL = `/avatars/${newFileName}`;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatarURL },
      { new: true }
    );

    if (!user) {
      throw HttpError(404, "User not found");
    }

    res.status(200).json({ avatarURL });
  } catch (error) {
    next(error);
  }
}

export default { getAvatar, uploadAvatar };
