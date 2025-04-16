const Database = require('../index');

// Mock data
const mockUsers = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];

jest.mock('../index', () => ({
  getUsers: jest.fn(() => Promise.resolve(mockUsers)),
}));

test('Should return all users', async () => {
  const users = await Database.getUsers();
  console.log(users);
  expect(Database.getUsers).toHaveBeenCalled();
  expect(users).toEqual(mockUsers);
});
