import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().required().min(3).max(20),
  email: Joi.string().required().email().min(6).max(30),
  phone: Joi.string().required().number().min(10).max(15),
});

export const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string().number(),
})
  .min(1)
  .message("Body must have at least one field");
