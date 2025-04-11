const normalizeUser = require('./utils/normalizeUser');

// --- Simple ID generator ---
let userIdCounter = 2; // Already using 1 and 2
let messageIdCounter = 2;

function generateUserId() {
  return ++userIdCounter;
}

function generateMessageId() {
  return ++messageIdCounter;
}

// --- Initial Users & Messages ---
const userId1 = 1;
const userId2 = 2;

const users = new Map()
  .set(userId1, { name: 'Amando' })
  .set(userId2, { name: 'Charles' });

const messages = [
  {
    text: 'Hi there!',
    userId: userId1,
    user: users.get(userId1).name,
    added: new Date(),
    id: 1,
  },
  {
    text: 'Hello World!',
    userId: userId2,
    user: users.get(userId2).name,
    added: new Date(),
    id: 2,
  },
];

// --- Get | Messages ---
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

// --- Get | Users ---
function getUserMessages(userId) {
  return messages.filter((msg) => msg.userId === userId);
}

function getUsers() {
  return new Map(users);
}

function getUser(userId) {
  // console.log(userId);
  return users.get(userId);
}

// --- Post | Users ---
function addUser(user) {
  if (!user) throw new Error('Invalid name');
  const normalized = normalizeUser(user);

  if ([...users.values()].some((u) => u.name === normalized)) {
    throw new Error('User already exists');
  }

  const id = generateUserId();
  users.set(id, { name: normalized });
  return id;
}

// --- Post | Messages ---
function addMessage(text, userId) {
  if (!text || !userId) throw new Error('Invalid message or userId');
  if (!users.has(userId)) throw new Error('User does not exist');

  const newMessage = {
    text,
    userId,
    user: users.get(userId).name,
    added: new Date(),
    id: generateMessageId(),
  };
  messages.push(newMessage);
  return newMessage;
}

function userExists(userId) {
  return users.has(userId);
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
  getUser,
};
