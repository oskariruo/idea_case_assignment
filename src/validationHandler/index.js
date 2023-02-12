/*
  ---- EXPRESS VALIDATOR ----
  Express-validator is a library that can be used to validate the data coming from 
  the frontend or other client
  https://express-validator.github.io/docs/
*/

import {check} from 'express-validator';

export const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    // Build your resulting errors however you want! String, object, whatever - it works!
    return `${location}[${param}]: ${msg}`;
};

/* ---- SUBJECT ---- */
export const validateAddCategory = [
  check("name")
    .isLength({ min: 3, max: 255 })
    .withMessage("Must be between 3-255 characters long")
    .bail()
    .matches(/^[A-Za-zäöåÄÖÅ0-9\s-]*$/)
    .withMessage("Must contain only letters or numbers")
    .bail()
    .notEmpty()
    .withMessage("Cannot be empty")
    .bail(),
  check("description")
    .isLength({ min: 0, max: 255 })
    .withMessage("Must be between 0-255 characters long")
    .bail()
    .optional()
    .bail(),
  check("budgetLimit")
  .matches(/^[0-9]+$/)
  .withMessage("Must be a number")
  .bail()
  .isFloat({ min: 0, max: 9999 })
  .withMessage("Must be between 0 - 9999")
  .optional()
  .bail(),
  check("isActive").matches(/^[01]$/).withMessage("Must be 0 or 1").bail(),
];

export const validateAddMember = [
  check("firstName")
  .isLength({ min: 2, max :30})
  .withMessage("Firstname between 2 and 30 characters")
  .bail()
  .matches(/^[A-Za-zäöåÄÖÅ0-9\s-]*$/)
  .withMessage("Must contain only letters or numbers")
  .bail()
  .notEmpty()
  .withMessage("Cannot be empty")
  .bail(),
  check("lastName")
  .isLength({ min: 2, max :40})
  .withMessage("Firstname between 2 and 40 characters")
  .bail()
  .matches(/^[A-Za-zäöåÄÖÅ0-9\s-]*$/)
  .withMessage("Must contain only letters or numbers")
  .bail()
  .notEmpty()
  .withMessage("Cannot be empty")
  .bail(),
  check("email")
  .isLength({ min: 5, max :40})
  .withMessage("Email between 2 and 40 characters")
  .bail(),
  check("email")
   .matches(/^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*$/)
   .withMessage("Enter valid email")
   .bail()
   .notEmpty()
   .withMessage("Email cannot be empty")
   .bail(),
]