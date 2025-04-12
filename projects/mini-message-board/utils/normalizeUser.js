function normalizeUser(user) {
  return user[0].toUpperCase() + user.slice(1).toLowerCase();
}

module.exports = normalizeUser;
