import logger from '#config/logger.js';
import { users } from '#models/user.model.js';
import { db } from '#config/database.js';
import { eq } from 'drizzle-orm';
import { hashPassword } from './auth.service.js';

export const getAllUsers = async () => {
  try {
    return await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at,
      })
      .from(users);
  } catch (e) {
    logger.error('Error getting users', e);
    throw e;
  }
};

export const getUserById = async id => {
  try {
    const user = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (user.length === 0) {
      throw new Error('user not found');
    }

    return user[0];
  } catch (e) {
    logger.error(`Error getting user with id ${id}`, e);
    throw e;
  }
};

export const updateUser = async (id, updates) => {
  try {
    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (existingUser.length === 0) {
      throw new Error('user not found');
    }

    // If password is being updated, hash it
    if (updates.password) {
      updates.password = await hashPassword(updates.password);
    }

    // Add updated_at timestamp
    updates.updated_at = new Date();

    // Update the user
    const [updatedUser] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at,
      });

    logger.info(`User ${updatedUser.email} updated successfully`);
    return updatedUser;
  } catch (e) {
    logger.error(`Error updating user with id ${id}`, e);
    throw e;
  }
};

export const deleteUser = async id => {
  try {
    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (existingUser.length === 0) {
      throw new Error('user not found');
    }

    // Delete the user
    await db.delete(users).where(eq(users.id, id));

    logger.info(`User with id ${id} deleted successfully`);
    return { id, deleted: true };
  } catch (e) {
    logger.error(`Error deleting user with id ${id}`, e);
    throw e;
  }
};
