import React from 'react';
import { Play, Trophy, Star } from 'lucide-react';
import { SlotMachine } from '../../types';

interface GameLobbyProps {
  machines: SlotMachine[];
  onSelectGame: (machineId: string) => void;
}

export const GameLobby: React.FC<GameLobbyProps> = ({ machines, onSelectGame }) => {
  const getThemeIcon = (theme: string) => {
    switch (theme) {
      case 'luxury': return '💎';
      case 'ancient': return '🏛️';
      default: return '🎰';
    }
  };

  const getThemeDescription = (theme: string) => {
    switch (theme) {
      case 'luxury': return 'Premium slots with diamond rewards';
      case 'ancient': return 'Discover treasures of the pharaohs';
      default: return 'Classic fruit machine experience';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-4">Game Lobby</h2>
        <p className="text-gray-300 text-lg">Choose your favorite slot machine and start winning!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {machines.map((machine) => (
          <div
            key={machine.id}
            className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group"
          >
            <div className="text-center mb-4">
              <div className="text-6xl mb-3">{getThemeIcon(machine.theme)}</div>
              <h3 className="text-2xl font-bold text-white mb-2">{machine.name}</h3>
              <p className="text-gray-400 text-sm">{getThemeDescription(machine.theme)}</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Min Bet:</span>
                <span className="text-yellow-400 font-semibold">${machine.minBet}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Max Bet:</span>
                <span className="text-yellow-400 font-semibold">${machine.maxBet}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Jackpot:</span>
                <div className="flex items-center space-x-1">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 font-bold">${machine.jackpot.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-gray-300 text-sm mb-2">Available Symbols:</div>
              <div className="flex flex-wrap justify-center gap-1">
                {machine.symbols.map((symbol, index) => (
                  <span key={index} className="text-2xl">{symbol}</span>
                ))}
              </div>
            </div>

            <button
              onClick={() => onSelectGame(machine.id)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 group-hover:scale-105"
            >
              <Play className="w-5 h-5" />
              <span>Play Now</span>
            </button>

            <div className="mt-3 text-center">
              <div className="flex items-center justify-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
                <span className="text-gray-400 text-sm ml-2">(4.8/5)</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-center">
        <h3 className="text-2xl font-bold text-white mb-2">🎊 Tournament Mode</h3>
        <p className="text-green-100 mb-4">Compete with other players for exclusive prizes!</p>
        <button className="bg-white text-green-600 font-bold px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors">
          Join Tournament
        </button>
      </div>
    </div>
  );
};