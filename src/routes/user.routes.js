import {
  fetchAllUsers,
  fetchUserById,
  updateUserById,
  deleteUserById,
} from '#controllers/user.controller.js';
import { authenticate } from '#middleware/auth.middleware.js';
import express from 'express';

const router = express.Router();

// Get all users (requires authentication)
router.get('/', authenticate, fetchAllUsers);

// Get user by ID (requires authentication)
router.get('/:id', authenticate, fetchUserById);

// Update user by ID (requires authentication)
router.put('/:id', authenticate, updateUserById);

// Delete user by ID (requires authentication)
router.delete('/:id', authenticate, deleteUserById);

export default router;
