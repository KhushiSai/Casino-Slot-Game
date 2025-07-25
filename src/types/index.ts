export interface User {
  id: string;
  username: string;
  email: string;
  balance: number;
  totalWinnings: number;
  totalSpins: number;
  joinDate: string;
  isDemo: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'spin' | 'win' | 'deposit' | 'withdrawal';
  amount: number;
  game: string;
  timestamp: string;
  details?: any;
}

export interface SpinResult {
  symbols: string[][];
  winningLines: number[];
  payout: number;
  isJackpot: boolean;
}

export interface GameStats {
  totalSpins: number;
  totalWinnings: number;
  biggestWin: number;
  winRate: number;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  winnings: number;
  spins: number;
}

export interface SlotMachine {
  id: string;
  name: string;
  theme: string;
  minBet: number;
  maxBet: number;
  symbols: string[];
  payouts: { [key: string]: number };
  jackpot: number;
}