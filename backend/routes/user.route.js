import express from "express";
import { login, signup } from "../controllers/user.controller.js"; 
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Validation for signup route
const signupValidation = [
  body('email').isEmail().withMessage('Please provide a valid email.'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.')
];

// Validation for login route
const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email.'),
  body('password').exists().withMessage('Password is required.')
];

// Route to handle signup with validation
router.post("/signup", signupValidation, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, signup);

// Route to handle login with validation
router.post("/login", loginValidation, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, login);

export default router;
