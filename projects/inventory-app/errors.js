class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
    this.name = '400';
  }
}

module.exports = { NotFoundError };
