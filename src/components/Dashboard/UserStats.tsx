import React from 'react';
import { BarChart3, TrendingUp, Target, DollarSign, Calendar, Percent } from 'lucide-react';
import { User, Transaction } from '../../types';

interface UserStatsProps {
  user: User;
  transactions: Transaction[];
}

export const UserStats: React.FC<UserStatsProps> = ({ user, transactions }) => {
  const totalSpent = transactions.filter(t => t.type === 'spin').reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const totalWon = transactions.filter(t => t.type === 'win').reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalWon - totalSpent;
  const winRate = user.totalSpins > 0 ? (transactions.filter(t => t.type === 'win').length / user.totalSpins * 100) : 0;
  
  const biggestWin = transactions
    .filter(t => t.type === 'win')
    .reduce((max, t) => Math.max(max, t.amount), 0);
  
  const avgBet = user.totalSpins > 0 ? totalSpent / user.totalSpins : 0;
  
  const favoriteGame = transactions.reduce((acc, t) => {
    acc[t.game] = (acc[t.game] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const mostPlayedGame = Object.entries(favoriteGame).sort(([,a], [,b]) => b - a)[0];

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const dailyStats = last7Days.map(date => {
    const dayTransactions = transactions.filter(t => 
      t.timestamp.split('T')[0] === date
    );
    const spins = dayTransactions.filter(t => t.type === 'spin').length;
    const winnings = dayTransactions.filter(t => t.type === 'win').reduce((sum, t) => sum + t.amount, 0);
    return { date, spins, winnings };
  });

  const stats = [
    {
      label: 'Total Spent',
      value: `$${totalSpent.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-red-400',
      bg: 'bg-red-600'
    },
    {
      label: 'Total Won',
      value: `$${totalWon.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-green-400',
      bg: 'bg-green-600'
    },
    {
      label: 'Net Profit',
      value: `${netProfit >= 0 ? '+' : ''}$${netProfit.toLocaleString()}`,
      icon: BarChart3,
      color: netProfit >= 0 ? 'text-green-400' : 'text-red-400',
      bg: netProfit >= 0 ? 'bg-green-600' : 'bg-red-600'
    },
    {
      label: 'Win Rate',
      value: `${winRate.toFixed(1)}%`,
      icon: Percent,
      color: 'text-blue-400',
      bg: 'bg-blue-600'
    },
    {
      label: 'Biggest Win',
      value: `$${biggestWin.toLocaleString()}`,
      icon: Target,
      color: 'text-yellow-400',
      bg: 'bg-yellow-600'
    },
    {
      label: 'Average Bet',
      value: `$${avgBet.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-purple-400',
      bg: 'bg-purple-600'
    }
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white">Detailed Statistics</h3>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.bg}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Favorite Game */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h4 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Gaming Preferences</span>
          </h4>
          <div className="space-y-4">
            <div>
              <div className="text-gray-400 text-sm">Most Played Game</div>
              <div className="text-white font-semibold">
                {mostPlayedGame ? mostPlayedGame[0] : 'No games played yet'}
              </div>
              {mostPlayedGame && (
                <div className="text-gray-400 text-sm">
                  {mostPlayedGame[1]} transactions
                </div>
              )}
            </div>
            <div>
              <div className="text-gray-400 text-sm">Member Since</div>
              <div className="text-white font-semibold">
                {new Date(user.joinDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Account Type</div>
              <div className="text-white font-semibold">
                {user.isDemo ? 'Demo Account' : 'Premium Account'}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Chart */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h4 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Last 7 Days Activity</span>
          </h4>
          <div className="space-y-3">
            {dailyStats.map((day, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="text-gray-400 text-sm">
                  {new Date(day.date).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-white text-sm">
                    {day.spins} spins
                  </div>
                  <div className={`text-sm font-semibold ${
                    day.winnings > 0 ? 'text-green-400' : 'text-gray-400'
                  }`}>
                    ${day.winnings.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievement Section */}
      <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl p-6">
        <h4 className="text-xl font-bold text-white mb-4">🏆 Achievements</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">🎰</div>
            <div className="text-white font-semibold">Spin Master</div>
            <div className="text-orange-100 text-sm">{user.totalSpins} spins completed</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">💰</div>
            <div className="text-white font-semibold">Big Winner</div>
            <div className="text-orange-100 text-sm">${biggestWin.toLocaleString()} biggest win</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">⭐</div>
            <div className="text-white font-semibold">Lucky Player</div>
            <div className="text-orange-100 text-sm">{winRate.toFixed(1)}% win rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};