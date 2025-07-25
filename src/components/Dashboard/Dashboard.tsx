import React, { useState } from 'react';
import { ArrowLeft, Trophy, History, TrendingUp, Coins, Calendar } from 'lucide-react';
import { User, Transaction } from '../../types';
import { Leaderboard } from './Leaderboard';
import { TransactionHistory } from './TransactionHistory';
import { UserStats } from './UserStats';

interface DashboardProps {
  user: User;
  transactions: Transaction[];
  onBack: () => void;
}

type DashboardTab = 'overview' | 'leaderboard' | 'history' | 'stats';

export const Dashboard: React.FC<DashboardProps> = ({ user, transactions, onBack }) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');

  const tabs = [
    { id: 'overview' as DashboardTab, label: 'Overview', icon: TrendingUp },
    { id: 'leaderboard' as DashboardTab, label: 'Leaderboard', icon: Trophy },
    { id: 'history' as DashboardTab, label: 'History', icon: History },
    { id: 'stats' as DashboardTab, label: 'Stats', icon: Coins }
  ];

  const recentTransactions = transactions.slice(0, 5);
  const totalSpent = transactions.filter(t => t.type === 'spin').reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const winRate = user.totalSpins > 0 ? (transactions.filter(t => t.type === 'win').length / user.totalSpins * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Games</span>
        </button>
        <h2 className="text-3xl font-bold text-white">Player Dashboard</h2>
      </div>

      {/* User Info Card */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">Welcome back, {user.username}!</h3>
            <div className="flex items-center space-x-4 text-purple-100">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
              </div>
              {user.isDemo && (
                <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-sm">Demo Account</span>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">${user.balance.toLocaleString()}</div>
            <div className="text-purple-200">Current Balance</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-white">{user.totalSpins}</div>
                    <div className="text-gray-400">Total Spins</div>
                  </div>
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🎰</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-green-400">${user.totalWinnings.toLocaleString()}</div>
                    <div className="text-gray-400">Total Winnings</div>
                  </div>
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-yellow-400">{winRate.toFixed(1)}%</div>
                    <div className="text-gray-400">Win Rate</div>
                  </div>
                  <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
              {recentTransactions.length > 0 ? (
                <div className="space-y-3">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          transaction.type === 'win' ? 'bg-green-600' : 'bg-red-600'
                        }`}>
                          {transaction.type === 'win' ? '💰' : '🎰'}
                        </div>
                        <div>
                          <div className="text-white font-medium">{transaction.game}</div>
                          <div className="text-gray-400 text-sm">
                            {new Date(transaction.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className={`font-bold ${
                        transaction.amount > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-400 py-8">
                  No recent activity. Start playing to see your transactions here!
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'leaderboard' && <Leaderboard />}
        {activeTab === 'history' && <TransactionHistory transactions={transactions} />}
        {activeTab === 'stats' && <UserStats user={user} transactions={transactions} />}
      </div>
    </div>
  );
};