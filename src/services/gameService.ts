import { SlotMachine, SpinResult, Transaction } from '../types';
import { UserService } from './userService';

export class GameService {
  private static TRANSACTIONS_KEY = 'casino_transactions';

  static slotMachines: SlotMachine[] = [
    {
      id: 'classic',
      name: 'Classic Slots',
      theme: 'retro',
      minBet: 1,
      maxBet: 100,
      symbols: ['🍒', '🍋', '🍊', '🍇', '⭐', '💎', '7️⃣'],
      payouts: {
        '🍒🍒🍒': 10,
        '🍋🍋🍋': 15,
        '🍊🍊🍊': 20,
        '🍇🍇🍇': 25,
        '⭐⭐⭐': 50,
        '💎💎💎': 100,
        '7️⃣7️⃣7️⃣': 500
      },
      jackpot: 10000
    },
    {
      id: 'diamond',
      name: 'Diamond Rush',
      theme: 'luxury',
      minBet: 5,
      maxBet: 500,
      symbols: ['💎', '💍', '👑', '🌟', '💰', '🎰', '🔔'],
      payouts: {
        '💎💎💎': 200,
        '💍💍💍': 150,
        '👑👑👑': 300,
        '🌟🌟🌟': 75,
        '💰💰💰': 100,
        '🎰🎰🎰': 250,
        '🔔🔔🔔': 50
      },
      jackpot: 50000
    },
    {
      id: 'egyptian',
      name: 'Pharaoh\'s Gold',
      theme: 'ancient',
      minBet: 2,
      maxBet: 200,
      symbols: ['🐍', '🏺', '👁️', '🔮', '⚱️', '🗿', '🏛️'],
      payouts: {
        '🐍🐍🐍': 80,
        '🏺🏺🏺': 60,
        '👁️👁️👁️': 120,
        '🔮🔮🔮': 150,
        '⚱️⚱️⚱️': 200,
        '🗿🗿🗿': 300,
        '🏛️🏛️🏛️': 400
      },
      jackpot: 25000
    }
  ];

  static getSymbolWeights(): { [key: string]: number } {
    return {
      '🍒': 30, '🍋': 25, '🍊': 20, '🍇': 15,
      '⭐': 8, '💎': 3, '7️⃣': 1,
      '💍': 2, '👑': 1, '🌟': 10, '💰': 5,
      '🎰': 3, '🔔': 12, '🐍': 18, '🏺': 22,
      '👁️': 8, '🔮': 6, '⚱️': 4, '🗿': 2, '🏛️': 1
    };
  }

  static getRandomSymbol(symbols: string[]): string {
    const weights = this.getSymbolWeights();
    const weightedSymbols: string[] = [];
    
    symbols.forEach(symbol => {
      const weight = weights[symbol] || 10;
      for (let i = 0; i < weight; i++) {
        weightedSymbols.push(symbol);
      }
    });

    return weightedSymbols[Math.floor(Math.random() * weightedSymbols.length)];
  }

  static spin(machineId: string, betAmount: number): SpinResult {
    const machine = this.slotMachines.find(m => m.id === machineId);
    if (!machine) throw new Error('Machine not found');

    // Generate 3x3 grid
    const symbols: string[][] = [];
    for (let row = 0; row < 3; row++) {
      symbols[row] = [];
      for (let col = 0; col < 3; col++) {
        symbols[row][col] = this.getRandomSymbol(machine.symbols);
      }
    }

    const winningLines: number[] = [];
    let totalPayout = 0;
    let isJackpot = false;

    // Check winning lines (horizontal, vertical, diagonal)
    const lines = [
      // Horizontal
      [[0,0], [0,1], [0,2]],
      [[1,0], [1,1], [1,2]],
      [[2,0], [2,1], [2,2]],
      // Vertical
      [[0,0], [1,0], [2,0]],
      [[0,1], [1,1], [2,1]],
      [[0,2], [1,2], [2,2]],
      // Diagonal
      [[0,0], [1,1], [2,2]],
      [[0,2], [1,1], [2,0]]
    ];

    lines.forEach((line, index) => {
      const [pos1, pos2, pos3] = line;
      const symbol1 = symbols[pos1[0]][pos1[1]];
      const symbol2 = symbols[pos2[0]][pos2[1]];
      const symbol3 = symbols[pos3[0]][pos3[1]];

      if (symbol1 === symbol2 && symbol2 === symbol3) {
        const pattern = symbol1 + symbol2 + symbol3;
        const payout = machine.payouts[pattern] || 0;
        
        if (payout > 0) {
          winningLines.push(index);
          totalPayout += payout * betAmount;

          // Check for jackpot
          if (payout >= 500) {
            isJackpot = true;
          }
        }
      }
    });

    return {
      symbols,
      winningLines,
      payout: totalPayout,
      isJackpot
    };
  }

  static getTransactions(): Transaction[] {
    const transactions = localStorage.getItem(this.TRANSACTIONS_KEY);
    return transactions ? JSON.parse(transactions) : [];
  }

  static saveTransaction(transaction: Transaction): void {
    const transactions = this.getTransactions();
    transactions.unshift(transaction);
    localStorage.setItem(this.TRANSACTIONS_KEY, JSON.stringify(transactions.slice(0, 1000))); // Keep last 1000
  }

  static getUserTransactions(userId: string): Transaction[] {
    return this.getTransactions().filter(t => t.userId === userId);
  }

  static playSlot(machineId: string, betAmount: number): { success: boolean; result?: SpinResult; error?: string } {
    const user = UserService.getCurrentUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    if (user.balance < betAmount) {
      return { success: false, error: 'Insufficient balance' };
    }

    const machine = this.slotMachines.find(m => m.id === machineId);
    if (!machine) return { success: false, error: 'Machine not found' };

    if (betAmount < machine.minBet || betAmount > machine.maxBet) {
      return { success: false, error: `Bet must be between ${machine.minBet} and ${machine.maxBet}` };
    }

    // Deduct bet amount
    const newBalance = user.balance - betAmount;
    const spinResult = this.spin(machineId, betAmount);
    
    // Record spin transaction
    this.saveTransaction({
      id: Date.now().toString(),
      userId: user.id,
      type: 'spin',
      amount: -betAmount,
      game: machine.name,
      timestamp: new Date().toISOString(),
      details: { machineId, spinResult }
    });

    let finalBalance = newBalance;
    let totalWinnings = user.totalWinnings;

    // Add winnings if any
    if (spinResult.payout > 0) {
      finalBalance += spinResult.payout;
      totalWinnings += spinResult.payout;

      this.saveTransaction({
        id: (Date.now() + 1).toString(),
        userId: user.id,
        type: 'win',
        amount: spinResult.payout,
        game: machine.name,
        timestamp: new Date().toISOString(),
        details: { machineId, spinResult }
      });
    }

    // Update user stats
    UserService.updateUser(user.id, {
      balance: finalBalance,
      totalWinnings,
      totalSpins: user.totalSpins + 1
    });

    return { success: true, result: spinResult };
  }
}