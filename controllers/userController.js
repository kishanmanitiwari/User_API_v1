import { UserModel } from "../models/userModel.js";

export const UserController = {
  // GET - Get all users with filtering and pagination
  getUsers: (req, res) => {
    const { gender, job_title, page = 1, limit = 10 } = req.query;
    let users = UserModel.getAllUsers();

    const filteredUsers = users.filter(user => {
      if (gender && job_title) {
        return user.gender === gender && user.job_title === job_title;
      } else if (gender) {
        return user.gender === gender;
      } else if (job_title) {
        return user.job_title === job_title;
      } else {
        return true;
      }
    });

    const startIndex = (page - 1) * limit;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + limit);

    res.json({
      page: Number(page),
      limit: Number(limit),
      totalResult: filteredUsers.length,
      totalPages: Math.ceil(filteredUsers.length / limit),
      data: paginatedUsers,
    });
  },

  // GET - Get user by ID
  getUserById: (req, res) => {
    const user = UserModel.getUserById(Number(req.params.id));

    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }
    res.json(user);
  },

  // POST - Create a new user
  createUser: (req, res) => {
    const { first_name, last_name, gender, email, job_title } = req.body;

    if (!first_name || !last_name || !gender || !email || !job_title) {
      return res.status(400).json({ error: "More fields required" });
    }

    const newUser = UserModel.createUser(req.body);
    res.status(201).json({ status: "success", newUser });
  },

  // PUT - Replace a user
  updateUser: (req, res) => {
    const updatedUser = req.body;
    const user = UserModel.updateUser(Number(req.params.id), updatedUser);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ status: "success", user });
  },

  // PATCH - Update part of a user's data
  patchUser: (req, res) => {
    const id = Number(req.params.id);
    const user = UserModel.getUserById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedUser = { ...user, ...req.body };
    UserModel.updateUser(id, updatedUser);
    res.json({ status: "success", user: updatedUser });
  },

  // DELETE - Delete a user
  deleteUser: (req, res) => {
    const result = UserModel.deleteUser(Number(req.params.id));

    if (!result) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ status: "success" });
  }
};
