import path from 'path';
import fs from 'fs';

// Path to the JSON file (this would be replaced by a database in real applications)
const __dirname = path.resolve();
const usersFilePath = path.join(__dirname, 'MOCK_DATA.json');

// Helper function to read users from the JSON file
function readUsersFromFile() {
  const data = fs.readFileSync(usersFilePath, 'utf-8');
  return JSON.parse(data);
}

// Helper function to write users back to the JSON file
function writeUsersToFile(users) {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
}

// User Model Functions
export const UserModel = {
  getAllUsers: () => {
    return readUsersFromFile();
  },

  getUserById: (id) => {
    const users = readUsersFromFile();
    return users.find(user => user.id === id);
  },

  createUser: (newUser) => {
    const users = readUsersFromFile();
    newUser.id = users.length + 1;
    users.push(newUser);
    writeUsersToFile(users);
    return newUser;
  },

  updateUser: (id, updatedUser) => {
    const users = readUsersFromFile();
    const userIndex = users.findIndex(user => user.id == id);

    if (userIndex !== -1) {
      users[userIndex] = { id: Number(id), ...updatedUser };
      writeUsersToFile(users);
      return users[userIndex];
    }

    return null;
  },

  deleteUser: (id) => {
    let users = readUsersFromFile();
    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex === -1) {
      return null;
    }

    // Remove the user and update the IDs
    users.splice(userIndex, 1);
    users = users.map((user, index) => ({ ...user, id: index + 1 }));
    writeUsersToFile(users);
    return true;
  }
};
