import { LeaderboardEntry, Transaction } from '../types';
import { UserService } from './userService';
import { GameService } from './gameService';

export class LeaderboardService {
  static getLeaderboard(): LeaderboardEntry[] {
    const transactions = GameService.getTransactions();
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    // Get recent winning transactions
    const recentWinnings = transactions.filter(t => 
      t.type === 'win' && 
      new Date(t.timestamp) > oneDayAgo
    );

    // Group by user
    const userWinnings: { [userId: string]: { winnings: number; spins: number } } = {};
    
    recentWinnings.forEach(transaction => {
      if (!userWinnings[transaction.userId]) {
        userWinnings[transaction.userId] = { winnings: 0, spins: 0 };
      }
      userWinnings[transaction.userId].winnings += transaction.amount;
      userWinnings[transaction.userId].spins += 1;
    });

    // Convert to leaderboard entries
    const leaderboard: LeaderboardEntry[] = Object.entries(userWinnings)
      .map(([userId, stats]) => {
        const user = UserService.getUserById(userId);
        return {
          userId,
          username: user?.username || 'Unknown',
          winnings: stats.winnings,
          spins: stats.spins
        };
      })
      .sort((a, b) => b.winnings - a.winnings)
      .slice(0, 10);

    return leaderboard;
  }

  static getUserRank(userId: string): number {
    const leaderboard = this.getLeaderboard();
    const index = leaderboard.findIndex(entry => entry.userId === userId);
    return index === -1 ? -1 : index + 1;
  }
}