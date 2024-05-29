import jwt from "jsonwebtoken";
import User from "../models/auth.js";
import HttpError from "../helpers/HttpError.js";

function auth(req, res, next) {
  const authorizationHeader = req.headers.authorization;

  if (typeof authorizationHeader === "undefined") {
    throw HttpError(401, "Not authorized");
  }

  const [bearer, token] = authorizationHeader.split(" ", 2);
  console.log({ bearer, token });

  if (bearer !== "Bearer") {
    throw HttpError(401, "Not authorized");
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
      if (err) {
        return next(HttpError(401, "Not authorized"));
      }
      const user = await User.findById(decode.id);

      if (!user || user.token !== token) {
        throw HttpError(401, "Not authorized");
      }

      req.user = { id: decode.id, name: decode.name };
      next();
    });
  } catch (error) {
    next(error);
  }
}

export default auth;
