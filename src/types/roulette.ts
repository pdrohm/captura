export interface RouletteSegment {
  id: string;
  label: string;
  icon: string;
  color: string;
  reward: RouletteReward;
  probability: number; 
}

export interface RouletteReward {
  type: 'coins' | 'experience' | 'urinations' | 'radius' | 'jackpot';
  amount: number;
  multiplier?: number; 
}

export interface RouletteResult {
  segmentId: string;
  reward: RouletteReward;
  spinDuration: number;
  finalAngle: number;
}

export interface RouletteGame {
  id: string;
  userId: string;
  timestamp: Date;
  result: RouletteResult;
  cost: number;
  consecutiveWins: number;
  totalWinnings: number;
}

export interface RouletteStats {
  userId: string;
  totalSpins: number;
  totalWinnings: number;
  consecutiveWins: number;
  lastSpinDate: Date;
  freeSpinsRemaining: number;
  bestWin: RouletteReward;
  averageWin: number;
}

export interface RouletteState {
  isSpinning: boolean;
  currentAngle: number;
  lastResult?: RouletteResult;
  stats: RouletteStats;
  history: RouletteGame[];
  canSpin: boolean;
  spinCost: number;
}

export interface RouletteConfig {
  segments: RouletteSegment[];
  spinCost: number;
  freeSpinsPerDay: number;
  maxConsecutiveWins: number;
  jackpotThreshold: number;
}