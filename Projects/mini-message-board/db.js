// --- Simple ID generator ---
let userIdCounter = 2; // Already using 1 and 2
let messageIdCounter = 2;

function generateUserId() {
  return ++userIdCounter;
}

function generateMessageId() {
  return ++messageIdCounter;
}

// --- Simple User Name Normalization ---
// (Assuming a basic normalization like lowercase and trim)
function normalizeUser(name) {
  if (typeof name !== 'string') return ''; // Handle non-string input
  return name.trim().toLowerCase();
}

// --- Initial Users & Messages ---
const userId1 = 1;
const userId2 = 2;

// Store users with normalized names for easier lookup,
// but keep the original name for display if needed.
// Let's adjust the initial data slightly for clarity
const users = new Map()
  .set(userId1, { name: 'Amando', normalizedName: 'amando' })
  .set(userId2, { name: 'Charles', normalizedName: 'charles' });

const messages = [
  {
    text: 'Hi there!',
    userId: userId1,
    author: users.get(userId1).name, // Display original name
    added: new Date(),
    id: 1,
  },
  {
    text: 'Hello World!',
    userId: userId2,
    author: users.get(userId2).name, // Display original name
    added: new Date(),
    id: 2,
  },
];

// --- Get | Messages ---
function getMessage(id) {
  const message = messages.find((msg) => msg.id === id);
  if (!message) throw new Error('Message not found');
  // Ensure author name is fresh
  message.author = users.get(message.userId)?.name || 'Unknown';
  return message;
}

function getMessages(reverse = true) {
  const msgs = messages.map((msg) => ({
    ...msg,
    author: users.get(msg.userId)?.name || 'Unknown', // Use original name for display
  }));
  return reverse ? msgs.slice().reverse() : msgs;
}

// --- Get | Users ---
function getUserMessages(userId) {
  return messages
    .filter((msg) => msg.userId === userId)
    .map((msg) => ({
      ...msg,
      author: users.get(userId)?.name || 'Unknown', // Use original name for display
    }));
}

function getUsers() {
  return new Map(users); // Returns the map { id => { name, normalizedName } }
}

function getUser(userId) {
  return users.get(userId); // Returns { name, normalizedName }
}

// --- Find User By Name --- NEW FUNCTION
/**
 * Finds a user ID by their normalized name.
 * @param {string} name - The username to search for.
 * @returns {number | null} The user ID if found, otherwise null.
 */
function findUserByName(name) {
  const normalized = normalizeUser(name);
  if (!normalized) return null; // Don't search for empty names

  for (const [id, user] of users.entries()) {
    if (user.normalizedName === normalized) {
      return id; // Return the user ID
    }
  }
  return null; // User not found
}

// --- Post | Users ---
/**
 * Adds a new user.
 * @param {string} name - The desired username.
 * @returns {number} The ID of the newly created user.
 * @throws {Error} If the name is invalid or the user already exists.
 */
function addUser(name) {
  const trimmedName = name?.trim(); // Keep original casing for storage
  if (!trimmedName) throw new Error('Invalid name: Cannot be empty');

  const normalized = normalizeUser(trimmedName);

  // Check if normalized name already exists
  if ([...users.values()].some((u) => u.normalizedName === normalized)) {
    throw new Error(`User '${trimmedName}' already exists (case-insensitive).`);
  }

  const id = generateUserId();
  // Store both original and normalized name
  users.set(id, { name: trimmedName, normalizedName: normalized });
  console.log(`User added: ID=${id}, Name='${trimmedName}'`); // Log new user
  return id; // Return the new user's ID
}

// --- Post | Messages ---
/**
 * Adds a new message.
 * @param {string} text - The message content.
 * @param {number} userId - The ID of the author.
 * @returns {object} The newly created message object.
 * @throws {Error} If text is invalid or user does not exist.
 */
function addMessage(text, userId) {
  const trimmedText = text?.trim();
  if (!trimmedText) throw new Error('Invalid message: Cannot be empty');
  const user = users.get(userId);
  if (!user) throw new Error(`User with ID ${userId} does not exist`);

  const newMessage = {
    text: trimmedText,
    userId,
    author: user.name, // Get original casing name for the message
    added: new Date(),
    id: generateMessageId(),
  };
  messages.push(newMessage);
  console.log(
    `Message added: ID=${newMessage.id}, AuthorID=${userId}, Text='${trimmedText}'`
  ); // Log new message
  return newMessage;
}

// Checks if a user exists by ID (still potentially useful)
function userExists(userId) {
  return users.has(userId);
}

// links
const links = [
  { href: 'messages', text: 'Messages' },
  { href: 'https://github.com/Dev-AndyRBXL', text: 'About' },
];

// Update exports
module.exports = {
  getMessage,
  getMessages,
  getUserMessages,
  links,
  findUserByName, // <-- Export new function
  addUser,
  addMessage,
  userExists, // Keep exporting this too
  getUsers,
  getUser,
  // normalizeUser, // Optionally export if needed elsewhere
};
