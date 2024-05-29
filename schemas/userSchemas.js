import Joi from "joi";

export const userSchema = Joi.object({
  name: Joi.string().required().min(3).max(20),
  email: Joi.string().required().email().min(6).max(30),
  password: Joi.string().required().min(8).max(15),
  subscription: Joi.string().valid("starter", "pro", "business"),
});

export const subscriptionSchema = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").required(),
});
