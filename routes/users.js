import express from "express";
import { checkApiKey } from "../middlewares/auth.js"; // Import middleware
import { UserController } from "../controllers/userController.js";

const router = express.Router();

// Define the base path for all routes as /api/users
router.route("/")
  .get(UserController.getUsers)            // GET - Get all users
  .post(checkApiKey, UserController.createUser); // POST - Create a new user

router.route("/:id")
  .get(UserController.getUserById)          // GET - Get user by ID
  .put(UserController.updateUser)           // PUT - Replace a user
  .patch(checkApiKey, UserController.patchUser) // PATCH - Update user
  .delete(checkApiKey, UserController.deleteUser); // DELETE - Delete a user

export default router;
