import { User } from '../types';
import { AuthService } from './authService';

export class UserService {
  private static USERS_KEY = 'casino_users';

  static createDemoUser(): User {
    return {
      id: 'demo-user',
      username: 'DemoPlayer',
      email: 'demo@casino.com',
      balance: 1000,
      totalWinnings: 0,
      totalSpins: 0,
      joinDate: new Date().toISOString(),
      isDemo: true
    };
  }

  static getUsers(): User[] {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  static saveUsers(users: User[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  static getUserById(id: string): User | null {
    if (id === 'demo-user') {
      return this.createDemoUser();
    }
    const users = this.getUsers();
    return users.find(user => user.id === id) || null;
  }

  static getUserByEmail(email: string): User | null {
    const users = this.getUsers();
    return users.find(user => user.email === email) || null;
  }

  static createUser(userData: Omit<User, 'id' | 'joinDate'>): User {
    const users = this.getUsers();
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      joinDate: new Date().toISOString()
    };
    users.push(newUser);
    this.saveUsers(users);
    return newUser;
  }

  static updateUser(userId: string, updates: Partial<User>): User | null {
    if (userId === 'demo-user') {
      const demoUser = this.createDemoUser();
      return { ...demoUser, ...updates };
    }
    
    const users = this.getUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex === -1) return null;

    users[userIndex] = { ...users[userIndex], ...updates };
    this.saveUsers(users);
    return users[userIndex];
  }

  static getCurrentUser(): User | null {
    const token = AuthService.getToken();
    if (!token) return null;

    const userId = AuthService.getUserIdFromToken(token);
    if (!userId) return null;

    return this.getUserById(userId);
  }

  static register(email: string, username: string, password: string): { success: boolean; user?: User; error?: string } {
    if (this.getUserByEmail(email)) {
      return { success: false, error: 'Email already exists' };
    }

    const user = this.createUser({
      email,
      username,
      balance: 500, // Starting balance
      totalWinnings: 0,
      totalSpins: 0,
      isDemo: false
    });

    const token = AuthService.generateToken(user.id);
    AuthService.setToken(token);

    return { success: true, user };
  }

  static login(email: string, password: string): { success: boolean; user?: User; error?: string } {
    if (email === 'demo@casino.com') {
      const demoUser = this.createDemoUser();
      const token = AuthService.generateToken(demoUser.id);
      AuthService.setToken(token);
      return { success: true, user: demoUser };
    }

    const user = this.getUserByEmail(email);
    if (!user) {
      return { success: false, error: 'Invalid credentials' };
    }

    const token = AuthService.generateToken(user.id);
    AuthService.setToken(token);

    return { success: true, user };
  }

  static logout(): void {
    AuthService.removeToken();
  }
}