
import React, { useState } from 'react';
import { UserData, WithdrawalRequest } from '../types';

interface WithdrawViewProps {
  user: UserData | null;
  minWithdrawal: number;
  onSubmit: (req: Omit<WithdrawalRequest, 'id' | 'status' | 'createdAt'>) => void;
  history: WithdrawalRequest[];
}

const WithdrawView: React.FC<WithdrawViewProps> = ({ user, minWithdrawal, onSubmit, history }) => {
  const [amount, setAmount] = useState<number>(minWithdrawal);
  const [method, setMethod] = useState<'bkash' | 'nagad'>('bkash');
  const [account, setAccount] = useState('');

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (amount < minWithdrawal) {
      alert(`Minimum withdrawal is ৳ ${minWithdrawal}`);
      return;
    }
    if (amount > user.balance) {
      alert('Insufficient balance');
      return;
    }
    if (account.length < 11) {
      alert('Please enter a valid account number');
      return;
    }

    onSubmit({
      userId: user.id,
      username: user.username,
      amount,
      method,
      accountNumber: account
    });
    setAccount('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Request Withdrawal</h3>
        <form onSubmit={handleWithdraw} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Select Method</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setMethod('bkash')}
                className={`flex-1 py-3 rounded-xl border-2 font-bold transition-all ${method === 'bkash' ? 'border-pink-500 bg-pink-50 text-pink-600' : 'border-gray-200 text-gray-400'}`}
              >
                bKash
              </button>
              <button
                type="button"
                onClick={() => setMethod('nagad')}
                className={`flex-1 py-3 rounded-xl border-2 font-bold transition-all ${method === 'nagad' ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-200 text-gray-400'}`}
              >
                Nagad
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Amount (৳)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold"
              min={minWithdrawal}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Account Number</label>
            <input
              type="text"
              placeholder="017xxxxxxxx"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-600 active:scale-95 transition-all shadow-md"
          >
            Submit Request
          </button>
        </form>
      </div>

      <div className="space-y-3">
        <h4 className="font-bold text-gray-700">Recent Transactions</h4>
        {history.length === 0 ? (
          <p className="text-gray-400 text-center py-4 text-sm italic">No history yet.</p>
        ) : (
          history.map(req => (
            <div key={req.id} className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between items-center shadow-sm">
              <div>
                <p className="font-bold text-gray-800 capitalize">{req.method} - {req.accountNumber}</p>
                <p className="text-[10px] text-gray-400">{new Date(req.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-indigo-600">৳ {req.amount}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${req.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : req.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {req.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WithdrawView;
