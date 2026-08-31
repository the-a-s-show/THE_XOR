// In-memory user database
const users = new Map();

export const createUser = async ({ email, password, full_name, role }) => {
  const normalizedEmail = email.toLowerCase();
  const user = {
    _id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    email: normalizedEmail,
    password, // Plain text password since DB and auth are removed
    full_name: full_name || 'XOR User',
    role: role || 'USER',
    comparePassword: async function(plainPassword) {
      return plainPassword === this.password;
    }
  };
  users.set(normalizedEmail, user);
  return user;
};

export const findByEmail = async (email) => {
  const normalizedEmail = email?.toLowerCase() || '';
  return users.get(normalizedEmail) || null;
};

export const generateAccessToken = (user) => {
  return `mock-access-token-${user._id}`;
};

export const generateRefreshToken = (user) => {
  return `mock-refresh-token-${user._id}`;
};