
import React, { useState, useEffect } from 'react';
import { UserData, Task, AppSettings, WithdrawalRequest } from './types';
import Dashboard from './components/Dashboard';
import TasksView from './components/TasksView';
import SpinView from './components/SpinView';
import ReferralView from './components/ReferralView';
import AdminPanel from './components/AdminPanel';
import WithdrawView from './components/WithdrawView';

// আমরা এখানে ব্রাউজারের Fetch API ব্যবহার করে Firebase Realtime DB কানেক্ট করছি 
// যাতে কোনো বাড়তি লাইব্রেরি ইনস্টল না করেই কাজ করা যায়।

const DB_URL = "https://earnmaster-4ff98-default-rtdb.firebaseio.com"; // আপনার ফায়ারবেস ডাটাবেস ইউআরএল আপডেট করা হয়েছে

const INITIAL_SETTINGS: AppSettings = {
  monetagZoneId: "10276178", // ইউজার প্রদত্ত Monetag Zone ID সেট করা হয়েছে
  minWithdrawal: 50,
  spinRewardMin: 0.5,
  spinRewardMax: 5,
  referralReward: 2,
  adminId: "8518912933" 
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'tasks' | 'spin' | 'refer' | 'withdraw' | 'admin'>('home');
  const [user, setUser] = useState<UserData | null>(null);
  const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // ফায়ারবেস থেকে ডাটা লোড করার ফাংশন
  const loadData = async (tgUserId: string) => {
    try {
      const response = await fetch(`${DB_URL}/.json`);
      const data = await response.json();
      
      if (data) {
        // Convert objects to arrays if they exist
        setTasks(data.tasks ? Object.values(data.tasks) : []);
        setWithdrawals(data.withdrawals ? Object.values(data.withdrawals) : []);
        setSettings(data.settings || INITIAL_SETTINGS);

        const usersList = data.users || {};
        let currentUser = usersList[tgUserId];

        if (!currentUser) {
          currentUser = {
            id: tgUserId,
            username: 'User',
            balance: 0,
            referralCode: `REF${tgUserId}`,
            referralCount: 0,
            completedTasks: [],
            isAdmin: tgUserId === (data.settings?.adminId || INITIAL_SETTINGS.adminId)
          };
          await updateUserData(currentUser);
        } else {
            // Update admin status based on latest settings
            currentUser.isAdmin = tgUserId === (data.settings?.adminId || INITIAL_SETTINGS.adminId);
            // Firebase doesn't store empty arrays, so ensure it exists
            if (!currentUser.completedTasks) {
              currentUser.completedTasks = [];
            }
        }
        setUser(currentUser);
      } else {
        // If DB is empty, set default user
        const defaultUser: UserData = {
            id: tgUserId,
            username: 'User',
            balance: 0,
            referralCode: `REF${tgUserId}`,
            referralCount: 0,
            completedTasks: [],
            isAdmin: tgUserId === INITIAL_SETTINGS.adminId
        };
        setUser(defaultUser);
        await updateUserData(defaultUser);
        // Also sync initial settings if empty
        await syncSettings(INITIAL_SETTINGS);
      }
    } catch (e) {
      console.error("Firebase load error:", e);
    } finally {
      setLoading(false);
    }
  };

  const updateUserData = async (updatedUser: UserData) => {
    await fetch(`${DB_URL}/users/${updatedUser.id}.json`, {
      method: 'PUT',
      body: JSON.stringify(updatedUser)
    });
  };

  const syncSettings = async (newSettings: AppSettings) => {
    await fetch(`${DB_URL}/settings.json`, {
      method: 'PUT',
      body: JSON.stringify(newSettings)
    });
  };

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      const tgUser = tg.initDataUnsafe?.user;
      if (tgUser) {
        loadData(tgUser.id.toString());
      } else {
        // Test in browser with your admin ID
        loadData("8518912933");
      }
    } else {
        loadData("8518912933");
    }
  }, []);

  const updateUserBalance = (amount: number) => {
    if (!user) return;
    const updated = { ...user, balance: user.balance + amount };
    setUser(updated);
    updateUserData(updated);
  };

  const handleWithdraw = async (req: Omit<WithdrawalRequest, 'id' | 'status' | 'createdAt'>) => {
    const newReq: WithdrawalRequest = {
      ...req,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      createdAt: Date.now()
    };
    await fetch(`${DB_URL}/withdrawals/${newReq.id}.json`, {
      method: 'PUT',
      body: JSON.stringify(newReq)
    });
    setWithdrawals(prev => [newReq, ...prev]);
    updateUserBalance(-req.amount);
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-indigo-600 text-white font-bold animate-pulse">EarnMaster Pro লোড হচ্ছে...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-[#f1f5f9] max-w-md mx-auto shadow-2xl relative">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 text-white shadow-lg rounded-b-[2.5rem]">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black tracking-tight">EarnMaster <span className="text-[10px] bg-yellow-400 text-indigo-900 px-2 py-0.5 rounded-full uppercase ml-1">PRO</span></h1>
            <p className="text-xs opacity-80 mt-1 font-medium">ব্যালেন্স: ৳ {user?.balance.toFixed(2)}</p>
          </div>
          <button onClick={() => setActiveTab('withdraw')} className="bg-white/20 backdrop-blur-md p-2 rounded-2xl flex flex-col items-center min-w-[80px]">
            <span className="text-[10px] uppercase font-bold opacity-70">Wallet</span>
            <span className="text-lg font-black">৳{user?.balance.toFixed(0)}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-28">
        {activeTab === 'home' && <Dashboard user={user} setActiveTab={setActiveTab} settings={settings} onAdReward={() => updateUserBalance(1.5)} />}
        {activeTab === 'tasks' && <TasksView tasks={tasks} user={user!} setUser={(u: any) => {
            const newUser = typeof u === 'function' ? u(user) : u;
            setUser(newUser);
            if (newUser) updateUserData(newUser);
        }} />}
        {activeTab === 'spin' && <SpinView settings={settings} onWin={updateUserBalance} />}
        {activeTab === 'refer' && <ReferralView user={user} reward={settings.referralReward} />}
        {activeTab === 'withdraw' && <WithdrawView user={user} minWithdrawal={settings.minWithdrawal} onSubmit={handleWithdraw} history={withdrawals.filter(w => w.userId === user?.id)} />}
        {activeTab === 'admin' && user?.isAdmin && (
          <AdminPanel 
            settings={settings} 
            setSettings={(s) => { setSettings(s); syncSettings(s); }} 
            tasks={tasks} 
            setTasks={async (t) => {
                setTasks(t);
                // Convert array to object for Firebase to avoid null indices
                const tasksObj = t.reduce((acc: any, task) => {
                    acc[task.id] = task;
                    return acc;
                }, {});
                await fetch(`${DB_URL}/tasks.json`, { method: 'PUT', body: JSON.stringify(tasksObj) });
            }} 
            withdrawals={withdrawals}
            setWithdrawals={async (w) => {
                setWithdrawals(w);
                const withdrawalsObj = w.reduce((acc: any, req) => {
                    acc[req.id] = req;
                    return acc;
                }, {});
                await fetch(`${DB_URL}/withdrawals.json`, { method: 'PUT', body: JSON.stringify(withdrawalsObj) });
            }}
          />
        )}
      </div>

      <nav className="fixed bottom-4 left-4 right-4 bg-white/90 backdrop-blur-lg border border-white shadow-2xl flex justify-around p-3 rounded-3xl max-w-[calc(448px-2rem)] mx-auto z-50">
        <NavBtn icon="🏠" label="Home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
        <NavBtn icon="🎯" label="Tasks" active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} />
        <NavBtn icon="🎡" label="Spin" active={activeTab === 'spin'} onClick={() => setActiveTab('spin')} />
        <NavBtn icon="💰" label="Withdraw" active={activeTab === 'withdraw'} onClick={() => setActiveTab('withdraw')} />
        {user?.isAdmin && (
          <NavBtn icon="🛠️" label="Admin" active={activeTab === 'admin'} onClick={() => setActiveTab('admin')} />
        )}
      </nav>
    </div>
  );
};

const NavBtn: React.FC<{ icon: string; label: string; active: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-all duration-300 ${active ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}>
    <span className="text-2xl">{icon}</span>
    <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
  </button>
);

export default App;
