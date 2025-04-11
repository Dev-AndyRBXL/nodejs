const crypto = require('crypto');
const normalizeUser = require('./utils/normalizeUser');

const userId1 = crypto.randomUUID();
const userId2 = crypto.randomUUID();

const users = new Map()
  .set(userId1, { name: 'Amando' })
  .set(userId2, { name: 'Charles' });

const messages = [
  {
    text: 'Hi there!',
    userId: userId1,
    user: users.get(userId1).name,
    added: new Date(),
    id: crypto.randomUUID(),
  },
  {
    text: 'Hello World!',
    userId: userId2,
    user: users.get(userId2).name,
    added: new Date(),
    id: crypto.randomUUID(),
  },
];

function getMessage(id) {
  const message = messages.find((msg) => msg.id === id);
  if (!message) throw new Error('Message not found');
  return message;
}

function getMessages(reverse = true) {
  const msgs = messages.map((msg) => ({
    ...msg,
    user: users.get(msg.userId)?.name || 'Unknown',
  }));
  return reverse ? msgs.slice().reverse() : msgs;
}

function getUserMessages(userId) {
  if (!users.has(userId)) throw new Error('User not found');
  return messages.filter((msg) => msg.userId === userId);
}

function getUsers() {
  return new Map(users);
}

function addUser(user) {
  if (!user) throw new Error('Invalid name');
  const normalized = normalizeUser(user);

  for (const { name } of users.values()) {
    if (name === normalized) throw new Error('User already exists');
  }

  const id = crypto.randomUUID();
  users.set(id, { name: normalized });
  return id;
}

function addMessage(text, userId) {
  if (!text || !userId) throw new Error('Invalid message or userId');
  if (!users.has(userId)) throw new Error('User does not exist');

  const newMessage = {
    text,
    userId,
    user: users.get(userId).name,
    added: new Date(),
    id: crypto.randomUUID(),
  };
  messages.push(newMessage);
  return newMessage;
}

function userExists(id) {
  return users.has(id);
}

const links = [{ href: 'messages', text: 'Messages' }];

module.exports = {
  getMessage,
  getMessages,
  getUserMessages,
  links,
  addUser,
  addMessage,
  userExists,
  getUsers,
};
