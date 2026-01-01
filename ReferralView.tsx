
import React from 'react';
import { UserData } from '../types';

interface ReferralViewProps {
  user: UserData | null;
  reward: number;
}

const ReferralView: React.FC<ReferralViewProps> = ({ user, reward }) => {
  const shareLink = `https://t.me/your_bot_user?start=${user?.id}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-3xl text-white text-center shadow-xl">
        <h3 className="text-2xl font-bold mb-2">Refer & Earn</h3>
        <p className="text-indigo-100 mb-6">Earn ৳ {reward} for every friend you invite to this bot!</p>
        
        <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm border border-white/30 flex items-center justify-between mb-4">
          <code className="text-xs truncate mr-2 font-mono">{shareLink}</code>
          <button 
            onClick={copyToClipboard}
            className="bg-white text-indigo-700 px-4 py-2 rounded-lg text-sm font-bold active:scale-90 transition-all"
          >
            Copy
          </button>
        </div>
        
        <button 
          onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(shareLink)}&text=${encodeURIComponent('Join this amazing earning bot and get rewards!')}`)}
          className="w-full bg-yellow-400 text-gray-900 py-3 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-colors shadow-lg"
        >
          Invite Friends 🚀
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h4 className="font-bold text-gray-800 mb-4">Your Referral Stats</h4>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-2xl font-bold text-indigo-600">{user?.referralCount}</p>
            <p className="text-xs text-gray-500 uppercase">Invited</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-2xl font-bold text-green-600">৳ {(user?.referralCount || 0) * reward}</p>
            <p className="text-xs text-gray-500 uppercase">Earnings</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralView;
