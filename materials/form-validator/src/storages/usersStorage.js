// storages/usersStorage.js
// This class lets us simulate interacting with a database.
const { NotFoundError } = require('../customErrors');

class UsersStorage {
  constructor() {
    this.storage = {};
    this.id = 0;
  }

  addUser({ firstName, lastName, email, age, bio }) {
    const id = this.id;
    this.storage[id] = { id, firstName, lastName, email, age, bio };
    this.id++;
  }

  getUserById(id) {
    return new Promise((resolve, reject) => {
      try {
        const user = Object.values(this.storage)[id];

        if (!user) {
          return reject(new NotFoundError('User not found!'));
        }

        resolve(user);
      } catch (err) {
        reject(err);
      }
    });
  }

  getUsersByKeyword(keyword) {
    return new Promise((resolve, reject) => {
      try {
        const newKeyword = keyword?.trim().toLowerCase();

        const res = Object.values(this.storage).filter(
          (user) =>
            user.firstName.toLowerCase().includes(newKeyword) ||
            user.lastName.toLowerCase().includes(newKeyword) ||
            user.email.includes(newKeyword)
        );

        resolve(res);
      } catch (err) {
        reject(err);
      }
    });
  }

  getUsers() {
    return new Promise((resolve, reject) => {
      try {
        const res = Object.values(this.storage);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    });
  }

  updateUserById(id, { firstName, lastName, email, age, bio }) {
    this.storage[id] = { id, firstName, lastName, email, age, bio };
  }

  deleteUser(id) {
    delete this.storage[id];
  }
}
// Rather than exporting the class, we can export an instance of the class by instantiating it.
// This ensures only one instance of this class can exist, also known as the "singleton" pattern.
module.exports = new UsersStorage();
