
export interface UserData {
  id: string; // Telegram ID
  username: string;
  balance: number;
  referralCode: string;
  referredBy?: string;
  referralCount: number;
  lastSpinDate?: string;
  completedTasks: string[]; // Task IDs
  isAdmin?: boolean;
}

export interface Task {
  id: string;
  title: string;
  type: 'telegram' | 'youtube' | 'facebook' | 'ads';
  reward: number;
  link: string;
  isActive: boolean;
}

export interface AppSettings {
  monetagZoneId: string;
  minWithdrawal: number;
  spinRewardMin: number;
  spinRewardMax: number;
  referralReward: number;
  adminId: string; 
  rulesLink?: string; // ব্লগার বা ইউটিউব ভিডিওর লিঙ্ক
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  username: string;
  amount: number;
  method: 'bkash' | 'nagad';
  accountNumber: string;
  status: 'pending' | 'completed' | 'rejected';
  createdAt: number;
}
