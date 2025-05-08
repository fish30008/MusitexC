// User interface
export interface User {
  id: string;
  email: string;
  name?: string;
}

// Simple auth service for demo purposes - in a real app, this would connect to a backend
export const AuthService = {
  // Mock user storage
  getUsers: (): Record<string, User & { passwordHash: string }> => {
    const usersJson = localStorage.getItem('musictex_users');
    if (!usersJson) {
      return {};
    }
    try {
      return JSON.parse(usersJson);
    } catch (error) {
      console.error('Error parsing users from localStorage:', error);
      return {};
    }
  },

  // Save users to localStorage
  saveUsers: (users: Record<string, User & { passwordHash: string }>) => {
    try {
      localStorage.setItem('musictex_users', JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users to localStorage:', error);
    }
  },

  // Register a new user
  register: (email: string, password: string): User | null => {
    if (!email || !password) {
      console.error('Email and password are required');
      return null;
    }

    const users = AuthService.getUsers();

    // Check if user already exists
    if (users[email]) {
      console.log('User already exists:', email);
      return null; // User already exists
    }

    // In a real app, you would hash the password properly - this is just for demo
    const passwordHash = btoa(password); // Base64 encoding (NOT secure for production!)

    // Create new user
    const newUser: User & { passwordHash: string } = {
      id: Date.now().toString(),
      email,
      passwordHash
    };

    // Save user
    users[email] = newUser;
    AuthService.saveUsers(users);
    console.log('User registered successfully:', email);

    // Return user without passwordHash
    const { passwordHash: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  // Login user
  login: (email: string, password: string): User | null => {
    if (!email || !password) {
      console.error('Email and password are required');
      return null;
    }

    const users = AuthService.getUsers();
    const user = users[email];

    // Check if user exists and password matches
    if (!user || user.passwordHash !== btoa(password)) {
      console.log('Invalid login credentials for:', email);
      return null; // Invalid credentials
    }

    // Save auth token to localStorage (in a real app, this would be a JWT token from backend)
    const token = {
      id: user.id,
      email: user.email,
      exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours expiry
    };

    try {
      localStorage.setItem('authToken', btoa(JSON.stringify(token)));
      console.log('User logged in successfully:', email);
    } catch (error) {
      console.error('Error saving auth token:', error);
      return null;
    }

    // Return user without passwordHash
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  // Check if user is logged in
  isAuthenticated: (): boolean => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        return false;
      }

      const decodedToken = JSON.parse(atob(token));
      const isValid = decodedToken.exp > Date.now(); // Check if token is expired

      if (!isValid) {
        // Clean up expired token
        localStorage.removeItem('authToken');
      }

      return isValid;
    } catch (error) {
      console.error('Error checking authentication:', error);
      // Clean up invalid token
      localStorage.removeItem('authToken');
      return false;
    }
  },

  // Get current user
  getCurrentUser: (): User | null => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        return null;
      }

      const decodedToken = JSON.parse(atob(token));
      if (decodedToken.exp < Date.now()) {
        // Token expired
        localStorage.removeItem('authToken');
        return null;
      }

      return {
        id: decodedToken.id,
        email: decodedToken.email
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      localStorage.removeItem('authToken');
      return null;
    }
  },

  // Logout user
  logout: (): void => {
    try {
      localStorage.removeItem('authToken');
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  },

  // Initialize with a demo user
  initializeWithDemoUser: () => {
    const users = AuthService.getUsers();

    // Only add demo user if no users exist
    if (Object.keys(users).length === 0) {
      const demoEmail = 'demo@musictex.com';
      const demoPassword = 'password123';

      // Register demo user
      const result = AuthService.register(demoEmail, demoPassword);
      if (result) {
        console.log('Demo user created successfully');
      }
    }
  }
};

export default AuthService;