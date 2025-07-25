import React, { useEffect, useState } from 'react';
import { Trophy, Crown, Medal, Star } from 'lucide-react';
import { LeaderboardEntry } from '../../types';
import { LeaderboardService } from '../../services/leaderboardService';

export const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    setLeaderboard(LeaderboardService.getLeaderboard());
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2: return <Medal className="w-6 h-6 text-gray-300" />;
      case 3: return <Medal className="w-6 h-6 text-amber-600" />;
      default: return <Star className="w-6 h-6 text-gray-500" />;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 2: return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 3: return 'bg-gradient-to-r from-amber-400 to-amber-600';
      default: return 'bg-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center space-x-2">
          <Trophy className="w-8 h-8 text-yellow-400" />
          <span>24-Hour Leaderboard</span>
        </h3>
        <p className="text-gray-400">Top players from the last 24 hours</p>
      </div>

      {leaderboard.length > 0 ? (
        <div className="space-y-4">
          {leaderboard.map((entry, index) => {
            const rank = index + 1;
            return (
              <div
                key={entry.userId}
                className={`rounded-xl p-4 border transition-all duration-300 hover:scale-105 ${
                  rank <= 3
                    ? 'bg-gray-800 border-yellow-500 shadow-lg'
                    : 'bg-gray-800 border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getRankBg(rank)}`}>
                      {rank <= 3 ? (
                        getRankIcon(rank)
                      ) : (
                        <span className="text-white font-bold">#{rank}</span>
                      )}
                    </div>
                    
                    <div>
                      <div className="text-white font-bold text-lg">{entry.username}</div>
                      <div className="text-gray-400 text-sm">{entry.spins} spins played</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-400">
                      ${entry.winnings.toLocaleString()}
                    </div>
                    <div className="text-gray-400 text-sm">Total Winnings</div>
                  </div>
                </div>

                {rank === 1 && (
                  <div className="mt-3 text-center">
                    <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold">
                      🏆 CHAMPION
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-400 mb-2">No Players Yet</h3>
          <p className="text-gray-500">Be the first to win and claim the top spot!</p>
        </div>
      )}

      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-center">
        <h4 className="text-xl font-bold text-white mb-2">🎊 Weekly Tournament</h4>
        <p className="text-purple-100 mb-4">
          Compete for the weekly jackpot of $100,000!
        </p>
        <div className="text-3xl font-bold text-white">$47,830</div>
        <div className="text-purple-200 text-sm">Current Prize Pool</div>
      </div>
    </div>
  );
};