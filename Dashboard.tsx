
import React, { useState } from 'react';
import { UserData, AppSettings } from '../types';

interface DashboardProps {
  user: UserData | null;
  setActiveTab: (tab: any) => void;
  settings: AppSettings;
  onAdReward: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, setActiveTab, settings, onAdReward }) => {
  const [adLoading, setAdLoading] = useState(false);

  const watchAd = async () => {
    setAdLoading(true);
    // @ts-ignore
    const success = await window.showMonetagAd(settings.monetagZoneId);
    if (success) {
      alert("অভিনন্দন! আপনি ১.৫০ টাকা ইনকাম করেছেন।");
      onAdReward();
    }
    setAdLoading(false);
  };

  return (
    <div className="space-y-5">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-xl shadow-sm flex justify-between items-center">
        <div className="flex-1">
          <p className="text-[10px] text-yellow-800 font-bold uppercase tracking-wider">ঘোষণা</p>
          <p className="text-xs text-yellow-900 leading-tight">আমাদের টেলিগ্রাম চ্যানেলে জয়েন হয়ে পেমেন্ট প্রুফ দেখুন।</p>
        </div>
        {settings.rulesLink && (
          <a 
            href={settings.rulesLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="ml-2 bg-yellow-400 text-yellow-900 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase shadow-sm"
          >
            কাজের নিয়ম 📖
          </a>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => setActiveTab('tasks')} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:bg-slate-50 active:scale-95 transition-all">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl mb-3">📋</div>
          <h3 className="font-bold text-slate-800 text-sm">টাস্ক কমপ্লিট</h3>
          <p className="text-[10px] text-slate-400 mt-1">আনলিমিটেড ইনকাম</p>
        </button>
        <button onClick={() => setActiveTab('spin')} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:bg-slate-50 active:scale-95 transition-all">
          <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-2xl mb-3">🎡</div>
          <h3 className="font-bold text-slate-800 text-sm">লাকি স্পিন</h3>
          <p className="text-[10px] text-slate-400 mt-1">ভাগ্যের চাকা ঘুরান</p>
        </button>
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-indigo-900 rounded-[2rem] p-6 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10">
          <span className="bg-indigo-500/30 text-indigo-300 text-[10px] font-bold px-3 py-1 rounded-full uppercase">Monetag Ads</span>
          <h3 className="text-xl font-bold mt-2">ভিডিও অ্যাড দেখুন</h3>
          <p className="text-xs opacity-70 mt-1">প্রতিটি অ্যাড এর জন্য পাবেন ১.৫০ টাকা!</p>
          <button 
            disabled={adLoading}
            onClick={watchAd}
            className={`mt-5 w-full py-3 rounded-2xl font-bold transition-all shadow-lg active:scale-95 ${adLoading ? 'bg-slate-700' : 'bg-white text-indigo-900 hover:bg-indigo-50'}`}
          >
            {adLoading ? 'অ্যাড লোড হচ্ছে...' : 'Watch Video Ad 🎬'}
          </button>
        </div>
        <div className="absolute -bottom-6 -right-6 text-8xl opacity-10">💰</div>
      </div>

      <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span> আপনার প্রোফাইল
        </h4>
        <div className="grid grid-cols-3 gap-2">
          <StatBox label="রেফার" value={user?.referralCount || 0} color="text-blue-600" />
          <StatBox label="টাস্ক" value={user?.completedTasks?.length || 0} color="text-purple-600" />
          <StatBox label="টাকা" value={`৳${user?.balance.toFixed(0)}`} color="text-green-600" />
        </div>
      </div>
    </div>
  );
};

const StatBox = ({ label, value, color }: { label: string, value: any, color: string }) => (
  <div className="bg-slate-50 p-3 rounded-2xl text-center border border-slate-100">
    <p className={`text-lg font-black ${color}`}>{value}</p>
    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
  </div>
);

export default Dashboard;
