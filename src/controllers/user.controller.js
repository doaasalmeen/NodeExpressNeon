import logger from '#config/logger.js';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '#services/users.services.js';
import { formatValidationError } from '#utils/format.js';
import {
  userIdSchema,
  updateUserSchema,
} from '#validations/users.validation.js';

export const fetchAllUsers = async (req, res, next) => {
  try {
    logger.info('Getting users ...');
    const allUsers = await getAllUsers();
    res.json({
      message: 'Successfully retrieved users',
      users: allUsers,
      count: allUsers.length,
    });
  } catch (e) {
    logger.error(e);
    next(e);
  }
};

export const fetchUserById = async (req, res, next) => {
  try {
    const validationResult = userIdSchema.safeParse({ id: req.params.id });

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(validationResult.error),
      });
    }

    const { id } = validationResult.data;
    logger.info(`Getting user with id: ${id}`);

    const user = await getUserById(id);

    res.json({
      message: 'Successfully retrieved user',
      user,
    });
  } catch (e) {
    logger.error('Fetch user by id error', e);
    if (e.message === 'user not found') {
      return res.status(404).json({ error: 'User not found' });
    }
    next(e);
  }
};

export const updateUserById = async (req, res, next) => {
  try {
    const idValidation = userIdSchema.safeParse({ id: req.params.id });

    if (!idValidation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(idValidation.error),
      });
    }

    const bodyValidation = updateUserSchema.safeParse(req.body);

    if (!bodyValidation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(bodyValidation.error),
      });
    }

    const { id } = idValidation.data;
    const updates = bodyValidation.data;

    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    // Users can only update their own information
    if (req.user.id !== id && req.user.role !== 'admin') {
      logger.warn(
        `User ${req.user.email} attempted to update user ${id} without permission`
      );
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only update your own information',
      });
    }

    // Only admins can change roles
    if (updates.role && req.user.role !== 'admin') {
      logger.warn(
        `User ${req.user.email} attempted to change role without admin privileges`
      );
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Only admins can change user roles',
      });
    }

    // If non-admin trying to update their own account, remove role from updates
    if (req.user.role !== 'admin') {
      delete updates.role;
    }

    logger.info(`Updating user with id: ${id}`);
    const updatedUser = await updateUser(id, updates);

    res.json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (e) {
    logger.error('Update user error', e);
    if (e.message === 'user not found') {
      return res.status(404).json({ error: 'User not found' });
    }
    next(e);
  }
};

export const deleteUserById = async (req, res, next) => {
  try {
    const validationResult = userIdSchema.safeParse({ id: req.params.id });

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(validationResult.error),
      });
    }

    const { id } = validationResult.data;

    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    // Users can delete their own account, admins can delete any account
    if (req.user.id !== id && req.user.role !== 'admin') {
      logger.warn(
        `User ${req.user.email} attempted to delete user ${id} without permission`
      );
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only delete your own account',
      });
    }

    logger.info(`Deleting user with id: ${id}`);
    await deleteUser(id);

    res.json({
      message: 'User deleted successfully',
      id,
    });
  } catch (e) {
    logger.error('Delete user error', e);
    if (e.message === 'user not found') {
      return res.status(404).json({ error: 'User not found' });
    }
    next(e);
  }
};
