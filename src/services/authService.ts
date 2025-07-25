export class AuthService {
  private static TOKEN_KEY = 'casino_token';
  private static USER_KEY = 'casino_user';

  static generateToken(userId: string): string {
    const payload = {
      userId,
      timestamp: Date.now(),
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };
    return btoa(JSON.stringify(payload));
  }

  static validateToken(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token));
      return payload.exp > Date.now();
    } catch {
      return false;
    }
  }

  static getUserIdFromToken(token: string): string | null {
    try {
      const payload = JSON.parse(atob(token));
      return payload.userId;
    } catch {
      return null;
    }
  }

  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  static isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? this.validateToken(token) : false;
  }
}