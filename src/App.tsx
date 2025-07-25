import React, { useState, useEffect } from 'react';
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
import { Header } from './components/Layout/Header';
import { GameLobby } from './components/Games/GameLobby';
import { SlotMachine } from './components/Games/SlotMachine';
import { Dashboard } from './components/Dashboard/Dashboard';
import { User, SpinResult } from './types';
import { UserService } from './services/userService';
import { GameService } from './services/gameService';

type AppView = 'login' | 'register' | 'lobby' | 'game' | 'dashboard';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('login');
  const [user, setUser] = useState<User | null>(null);
  const [selectedGameId, setSelectedGameId] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  useEffect(() => {
    // Check if user is already authenticated
    const currentUser = UserService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setCurrentView('lobby');
    }
  }, []);

  const handleLogin = (email: string, password: string) => {
    const result = UserService.login(email, password);
    if (result.success) {
      setUser(result.user!);
      setCurrentView('lobby');
      setAuthError('');
    } else {
      setAuthError(result.error!);
    }
  };

  const handleDemoLogin = () => {
    const result = UserService.login('demo@casino.com', 'demo');
    if (result.success) {
      setUser(result.user!);
      setCurrentView('lobby');
      setAuthError('');
    }
  };

  const handleRegister = (email: string, username: string, password: string) => {
    const result = UserService.register(email, username, password);
    if (result.success) {
      setUser(result.user!);
      setCurrentView('lobby');
      setAuthError('');
    } else {
      setAuthError(result.error!);
    }
  };

  const handleLogout = () => {
    UserService.logout();
    setUser(null);
    setCurrentView('login');
    setSelectedGameId('');
  };

  const handleSelectGame = (machineId: string) => {
    setSelectedGameId(machineId);
    setCurrentView('game');
  };

  const handleSpin = async (machineId: string, betAmount: number): Promise<{ success: boolean; result?: SpinResult; error?: string }> => {
    const result = GameService.playSlot(machineId, betAmount);
    if (result.success) {
      // Refresh user data to get updated balance
      const updatedUser = UserService.getCurrentUser();
      if (updatedUser) {
        setUser(updatedUser);
      }
    }
    return result;
  };

  const handleBackToLobby = () => {
    setCurrentView('lobby');
    setSelectedGameId('');
  };

  const handleViewDashboard = () => {
    setCurrentView('dashboard');
  };

  const selectedMachine = GameService.slotMachines.find(m => m.id === selectedGameId);
  const transactions = user ? GameService.getUserTransactions(user.id) : [];

  if (!user) {
    return currentView === 'register' ? (
      <RegisterForm
        onRegister={handleRegister}
        onSwitchToLogin={() => setCurrentView('login')}
        error={authError}
      />
    ) : (
      <LoginForm
        onLogin={handleLogin}
        onDemoLogin={handleDemoLogin}
        onSwitchToRegister={() => setCurrentView('register')}
        error={authError}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      <Header user={user} onLogout={handleLogout} />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {currentView === 'lobby' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Welcome to Royal Casino</h1>
                <p className="text-gray-300">Choose your game and start winning big!</p>
              </div>
              <button
                onClick={handleViewDashboard}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
              >
                View Dashboard
              </button>
            </div>
            <GameLobby machines={GameService.slotMachines} onSelectGame={handleSelectGame} />
          </div>
        )}

        {currentView === 'game' && selectedMachine && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={handleBackToLobby}
                className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2"
              >
                <span>← Back to Lobby</span>
              </button>
              <button
                onClick={handleViewDashboard}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Dashboard
              </button>
            </div>
            <div className="flex justify-center">
              <SlotMachine
                machine={selectedMachine}
                onSpin={handleSpin}
                balance={user.balance}
              />
            </div>
          </div>
        )}

        {currentView === 'dashboard' && (
          <Dashboard
            user={user}
            transactions={transactions}
            onBack={() => setCurrentView('lobby')}
          />
        )}
      </main>
    </div>
  );
}

export default App;