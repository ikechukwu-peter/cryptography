import * as Joi from "joi";

// Joi schema for validation
export const cryptographySchema = Joi.object({
  text: Joi.string().required(),
  key: Joi.string().length(64).hex().required(), // Ensure key is exactly 64 characters and hexadecimal
});
