import React, { useState, useEffect } from 'react';
import { Play, Minus, Plus, Settings } from 'lucide-react';
import { SlotMachine as SlotMachineType, SpinResult } from '../../types';

interface SlotMachineProps {
  machine: SlotMachineType;
  onSpin: (machineId: string, betAmount: number) => Promise<{ success: boolean; result?: SpinResult; error?: string }>;
  balance: number;
}

export const SlotMachine: React.FC<SlotMachineProps> = ({ machine, onSpin, balance }) => {
  const [betAmount, setBetAmount] = useState(machine.minBet);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<SpinResult | null>(null);
  const [displaySymbols, setDisplaySymbols] = useState<string[][]>([]);
  const [showWinAnimation, setShowWinAnimation] = useState(false);

  useEffect(() => {
    // Initialize display with random symbols
    const initialSymbols: string[][] = [];
    for (let row = 0; row < 3; row++) {
      initialSymbols[row] = [];
      for (let col = 0; col < 3; col++) {
        initialSymbols[row][col] = machine.symbols[Math.floor(Math.random() * machine.symbols.length)];
      }
    }
    setDisplaySymbols(initialSymbols);
  }, [machine.symbols]);

  const handleSpin = async () => {
    if (isSpinning || balance < betAmount) return;

    setIsSpinning(true);
    setShowWinAnimation(false);
    setSpinResult(null);

    // Spinning animation
    const spinInterval = setInterval(() => {
      const newSymbols: string[][] = [];
      for (let row = 0; row < 3; row++) {
        newSymbols[row] = [];
        for (let col = 0; col < 3; col++) {
          newSymbols[row][col] = machine.symbols[Math.floor(Math.random() * machine.symbols.length)];
        }
      }
      setDisplaySymbols(newSymbols);
    }, 100);

    // Simulate spin delay
    setTimeout(async () => {
      clearInterval(spinInterval);
      
      const result = await onSpin(machine.id, betAmount);
      if (result.success && result.result) {
        setDisplaySymbols(result.result.symbols);
        setSpinResult(result.result);
        
        if (result.result.payout > 0) {
          setShowWinAnimation(true);
          setTimeout(() => setShowWinAnimation(false), 3000);
        }
      }
      
      setIsSpinning(false);
    }, 2000);
  };

  const adjustBet = (change: number) => {
    const newBet = Math.max(machine.minBet, Math.min(machine.maxBet, betAmount + change));
    setBetAmount(newBet);
  };

  const getThemeColors = () => {
    switch (machine.theme) {
      case 'luxury':
        return {
          bg: 'from-purple-900 to-pink-900',
          accent: 'from-gold-400 to-yellow-500',
          border: 'border-purple-500'
        };
      case 'ancient':
        return {
          bg: 'from-amber-900 to-orange-900',
          accent: 'from-amber-400 to-yellow-500',
          border: 'border-amber-500'
        };
      default:
        return {
          bg: 'from-blue-900 to-indigo-900',
          accent: 'from-blue-400 to-cyan-500',
          border: 'border-blue-500'
        };
    }
  };

  const theme = getThemeColors();

  return (
    <div className={`bg-gradient-to-br ${theme.bg} rounded-2xl p-6 border ${theme.border} shadow-2xl relative overflow-hidden`}>
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 left-4 text-6xl">🎰</div>
        <div className="absolute bottom-4 right-4 text-6xl">✨</div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-white mb-2">{machine.name}</h3>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-300">
            <span>Min: ${machine.minBet}</span>
            <span>Max: ${machine.maxBet}</span>
            <span>Jackpot: ${machine.jackpot.toLocaleString()}</span>
          </div>
        </div>

        {/* Slot display */}
        <div className="bg-black bg-opacity-50 rounded-xl p-4 mb-6 border-2 border-gray-600">
          <div className="grid grid-cols-3 gap-2">
            {displaySymbols.map((row, rowIndex) =>
              row.map((symbol, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`w-20 h-20 bg-gray-800 rounded-lg flex items-center justify-center text-3xl border-2 ${
                    spinResult?.winningLines.some(line => 
                      line === rowIndex || // horizontal lines
                      line === colIndex + 3 || // vertical lines
                      (line === 6 && rowIndex === colIndex) || // main diagonal
                      (line === 7 && rowIndex + colIndex === 2) // anti-diagonal
                    ) ? 'border-yellow-400 bg-yellow-400 bg-opacity-20 animate-pulse' : 'border-gray-600'
                  } transition-all duration-300 ${isSpinning ? 'animate-bounce' : ''}`}
                >
                  {symbol}
                </div>
              ))
            )}
          </div>

          {/* Win animation */}
          {showWinAnimation && spinResult && spinResult.payout > 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 rounded-xl">
              <div className="text-center">
                <div className="text-6xl mb-4 animate-bounce">🎉</div>
                <div className="text-4xl font-bold text-yellow-400 mb-2">
                  {spinResult.isJackpot ? 'JACKPOT!' : 'WIN!'}
                </div>
                <div className="text-2xl text-white">
                  ${spinResult.payout.toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bet controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => adjustBet(-1)}
              disabled={betAmount <= machine.minBet}
              className="w-10 h-10 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center justify-center text-white transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            
            <div className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-600">
              <span className="text-white font-semibold">${betAmount}</span>
            </div>
            
            <button
              onClick={() => adjustBet(1)}
              disabled={betAmount >= machine.maxBet || betAmount >= balance}
              className="w-10 h-10 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center justify-center text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleSpin}
            disabled={isSpinning || balance < betAmount}
            className={`px-8 py-3 bg-gradient-to-r ${theme.accent} text-white font-bold rounded-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-300 flex items-center space-x-2 shadow-lg`}
          >
            <Play className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>{isSpinning ? 'Spinning...' : 'SPIN'}</span>
          </button>
        </div>

        {/* Payout table */}
        <div className="bg-black bg-opacity-30 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-3 flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Payouts (x bet)</span>
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(machine.payouts).map(([pattern, multiplier]) => (
              <div key={pattern} className="flex justify-between text-gray-300">
                <span>{pattern.replace(/(.)/g, '$1 ')}</span>
                <span className="text-yellow-400">{multiplier}x</span>
              </div>
            ))}
          </div>
        </div>

        {/* Last result */}
        {spinResult && !isSpinning && (
          <div className="mt-4 text-center">
            {spinResult.payout > 0 ? (
              <div className="text-green-400 font-semibold">
                Won ${spinResult.payout.toLocaleString()}! 🎉
              </div>
            ) : (
              <div className="text-gray-400">
                Better luck next time! 🍀
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};