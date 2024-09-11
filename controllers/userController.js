import UserModel  from "../models/UserModel.js";

export const UserController = {
  getUsers: async (req, res) => {
    const { gender, job_title, page = 1, limit = 10 } = req.query;

    try {
      // Get filtered users with pagination
      const filteredUsers = await UserModel.filterUsers(
        { gender, job_title },
        page,
        limit
      );

      // Calculate total results for the filter criteria
      const allUsers = await UserModel.filterUsers(
        { gender, job_title },
        1,
        1000000
      ); // A large limit to get all results
      const totalResult = allUsers.length;

      res.json({
        page: Number(page),
        limit: Number(limit),
        totalResult,
        totalPages: Math.ceil(totalResult / limit),
        data: filteredUsers,
      });
    } catch (err) {
      console.error("Error getting users:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // GET - Get user by ID
  getUserById: async (req, res) => {
    const id = Number(req.params.id);

    try {
      const user = await UserModel.getUserById(id);

      if (!user) {
        return res.status(404).json({ error: "User not found!" });
      }
      res.json(user);
    } catch (err) {
      console.error("Error fetching user by ID:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // POST - Create a new user
  createUser: async (req, res) => {
    const { first_name, last_name, gender, email, job_title } = req.body;

    if (!first_name || !last_name || !gender || !email || !job_title) {
      return res.status(400).json({ error: "More fields required" });
    }

    try {
      const newUser = await UserModel.createUser(req.body);
      res.status(201).json({ status: "success", newUser });
    } catch (err) {
      console.error("Error creating user:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // PUT - Replace a user
  updateUser: async (req, res) => {
    const id = Number(req.params.id);
    const updatedUser = req.body;

    try {
      const user = await UserModel.updateUser(id, updatedUser);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ status: "success", user });
    } catch (err) {
      console.error("Error updating user:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // PATCH - Update part of a user's data
  patchUser: async (req, res) => {
    const id = Number(req.params.id);

    try {
      const user = await UserModel.getUserById(id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const updatedUser = { ...user, ...req.body };
      const updatedUserInDb = await UserModel.updateUser(id, updatedUser);
      res.json({ status: "success", user: updatedUserInDb });
    } catch (err) {
      console.error("Error updating user:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // DELETE - Delete a user
  deleteUser: async (req, res) => {
    const id = Number(req.params.id);

    try {
      const result = await UserModel.deleteUser(id);

      if (!result) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ status: "success" });
    } catch (err) {
      console.error("Error deleting user:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};
