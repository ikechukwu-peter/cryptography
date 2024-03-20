import * as Joi from "joi";

// Joi schema for validation
export const cryptographySchema = Joi.object({
  text: Joi.string().required(),
  key: Joi.string().required(),
});
