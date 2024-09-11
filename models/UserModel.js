import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const UserModel = {
  getAllUsers: async () => {
    try {
      return await prisma.user.findMany();
    } catch (err) {
      console.error('Error fetching users:', err);
      throw err;
    }
  },

  filterUsers: async (filters = {}, page = 1, limit = 10) => {
    const { gender, job_title } = filters;

    try {
      return await prisma.user.findMany({
        where: {
          AND: [
            gender ? { gender } : {},
            job_title ? { job_title } : {}
          ]
        },
        skip: (page - 1) * limit,
        take: limit
      });
    } catch (err) {
      console.error('Error filtering users:', err);
      throw err;
    }
  },

  getUserById: async (id) => {
    try {
      return await prisma.user.findUnique({
        where: { id }
      });
    } catch (err) {
      console.error('Error fetching user by ID:', err);
      throw err;
    }
  },

  createUser: async (newUser) => {
    try {
      return await prisma.user.create({
        data: newUser
      });
    } catch (err) {
      console.error('Error creating user:', err);
      throw err;
    }
  },

  updateUser: async (id, updatedUser) => {
    try {
      return await prisma.user.update({
        where: { id },
        data: updatedUser
      });
    } catch (err) {
      console.error('Error updating user:', err);
      throw err;
    }
  },

  deleteUser: async (id) => {
    try {
      await prisma.user.delete({
        where: { id }
      });
      return true;
    } catch (err) {
      console.error('Error deleting user:', err);
      throw err;
    }
  }
};

export default UserModel;
