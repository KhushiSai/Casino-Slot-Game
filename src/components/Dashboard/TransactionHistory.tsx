import React, { useState } from 'react';
import { Filter, Search, TrendingUp, TrendingDown } from 'lucide-react';
import { Transaction } from '../../types';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

type FilterType = 'all' | 'spin' | 'win';

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = transactions.filter(transaction => {
    const matchesFilter = filter === 'all' || transaction.type === filter;
    const matchesSearch = transaction.game.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'win': return '💰';
      case 'spin': return '🎰';
      default: return '💳';
    }
  };

  const getTransactionColor = (amount: number) => {
    return amount > 0 ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h3 className="text-2xl font-bold text-white">Transaction History</h3>
        
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <div className="flex items-center space-x-1 bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                filter === 'all' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('spin')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                filter === 'spin' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Spins
            </button>
            <button
              onClick={() => setFilter('win')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                filter === 'win' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Wins
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700">
        {filteredTransactions.length > 0 ? (
          <div className="divide-y divide-gray-700">
            {filteredTransactions.map((transaction, index) => (
              <div key={transaction.id} className="p-4 hover:bg-gray-750 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      transaction.amount > 0 ? 'bg-green-600' : 'bg-red-600'
                    }`}>
                      <span className="text-xl">{getTransactionIcon(transaction.type)}</span>
                    </div>
                    
                    <div>
                      <div className="text-white font-medium">{transaction.game}</div>
                      <div className="text-gray-400 text-sm flex items-center space-x-2">
                        <span>{new Date(transaction.timestamp).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{new Date(transaction.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`text-lg font-bold flex items-center space-x-1 ${getTransactionColor(transaction.amount)}`}>
                      {transaction.amount > 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span>
                        {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-gray-400 text-sm capitalize">{transaction.type}</div>
                  </div>
                </div>

                {transaction.details?.spinResult && (
                  <div className="mt-3 ml-16 text-sm text-gray-400">
                    {transaction.details.spinResult.winningLines.length > 0 && (
                      <span>🎯 {transaction.details.spinResult.winningLines.length} winning line(s)</span>
                    )}
                    {transaction.details.spinResult.isJackpot && (
                      <span className="ml-2 text-yellow-400 font-bold">🏆 JACKPOT!</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Filter className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400 mb-2">No Transactions Found</h3>
            <p className="text-gray-500">
              {searchTerm 
                ? `No transactions found for "${searchTerm}"`
                : 'Start playing to see your transaction history here!'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};