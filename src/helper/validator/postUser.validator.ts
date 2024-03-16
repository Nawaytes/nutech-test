import { body } from "express-validator";
import validate from "../function/validator";

export const createUserValidation = () =>
  validate([
    body('name').notEmpty().isString(),
    body('email').isEmail().notEmpty().isString(),
    body('password')
      .matches(/[A-Z0-9]/)
      .notEmpty()
      .isLength({ min: 8 }),
  ]);