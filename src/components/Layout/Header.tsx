import React from 'react';
import { User, LogOut, Trophy, Coins } from 'lucide-react';
import { User as UserType } from '../../types';

interface HeaderProps {
  user: UserType | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">🎰</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Royal Casino</h1>
          </div>
        </div>

        {user && (
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-lg">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-semibold">${user.balance.toLocaleString()}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-300">
              <User className="w-5 h-5" />
              <span>{user.username}</span>
              {user.isDemo && (
                <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">DEMO</span>
              )}
            </div>

            <button
              onClick={onLogout}
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};