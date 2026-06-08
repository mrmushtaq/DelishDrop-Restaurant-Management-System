const bcrypt = require("bcryptjs");

const localUsers = [];

const findLocalUserByEmail = (email) =>
  localUsers.find((user) => user.email.toLowerCase() === email.toLowerCase());

const findLocalUserById = (id) =>
  localUsers.find((user) => String(user.id) === String(id));

const createLocalUser = async ({ name, email, password, role = "user" }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = {
    id: String(localUsers.length + 1),
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role,
  };
  localUsers.push(user);
  return user;
};

module.exports = { findLocalUserByEmail, findLocalUserById, createLocalUser };
