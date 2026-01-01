
import React, { useState } from 'react';
import { AppSettings, Task, WithdrawalRequest } from '../types';

interface AdminPanelProps {
  settings: AppSettings;
  setSettings: (s: AppSettings) => void;
  tasks: Task[];
  setTasks: (t: Task[]) => void;
  withdrawals: WithdrawalRequest[];
  setWithdrawals: (w: WithdrawalRequest[]) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ settings, setSettings, tasks, setTasks, withdrawals, setWithdrawals }) => {
  const [tab, setTab] = useState<'settings' | 'tasks' | 'payments'>('settings');
  const [newTask, setNewTask] = useState<Partial<Task>>({ type: 'telegram', reward: 2 });

  const addTask = () => {
    if (!newTask.title || !newTask.link) return;
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title!,
      link: newTask.link!,
      reward: Number(newTask.reward),
      type: newTask.type as any,
      isActive: true
    };
    setTasks([task, ...tasks]);
    setNewTask({ type: 'telegram', reward: 2 });
    alert("টাস্ক অ্যাড হয়েছে!");
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex bg-slate-200/50 p-1 rounded-2xl gap-1">
        {(['settings', 'tasks', 'payments'] as const).map(t => (
          <button 
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-xs font-black uppercase rounded-xl transition-all ${tab === t ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-200'}`}
          >
            {t === 'payments' ? 'পেমেন্ট' : t === 'tasks' ? 'টাস্ক' : 'সেটিংস'}
          </button>
        ))}
      </div>

      {tab === 'settings' && (
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 border-b pb-2">অ্যাপ কন্ট্রোল</h3>
          <div className="space-y-3">
            <Input label="Monetag Zone ID" value={settings.monetagZoneId} onChange={v => setSettings({...settings, monetagZoneId: v})} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="মিনিমাম উইথড্র" type="number" value={settings.minWithdrawal} onChange={v => setSettings({...settings, minWithdrawal: Number(v)})} />
              <Input label="রেফার বোনাস" type="number" value={settings.referralReward} onChange={v => setSettings({...settings, referralReward: Number(v)})} />
            </div>
            <Input label="Blogger/Rules Link" value={settings.rulesLink || ''} onChange={v => setSettings({...settings, rulesLink: v})} />
            <Input label="আপনার টেলিগ্রাম আইডি (Admin)" value={settings.adminId} onChange={v => setSettings({...settings, adminId: v})} />
          </div>
          <button className="w-full bg-slate-900 text-white py-3 rounded-2xl font-bold mt-4 shadow-xl active:scale-95 transition-all">সেভ সেটিংস</button>
        </div>
      )}

      {tab === 'tasks' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">নতুন টাস্ক দিন</h3>
            <div className="space-y-3">
              <input placeholder="টাস্ক টাইটেল" className="w-full p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-200" value={newTask.title || ''} onChange={e => setNewTask({...newTask, title: e.target.value})} />
              <input placeholder="লিঙ্ক (URL)" className="w-full p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-200" value={newTask.link || ''} onChange={e => setNewTask({...newTask, link: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                 <select className="p-4 bg-slate-50 rounded-2xl ring-1 ring-slate-200 font-bold text-sm" value={newTask.type} onChange={e => setNewTask({...newTask, type: e.target.value as any})}>
                   <option value="telegram">টেলিগ্রাম</option>
                   <option value="youtube">ইউটিউব</option>
                   <option value="facebook">ফেসবুক</option>
                 </select>
                 <input type="number" placeholder="টাকা (৳)" className="p-4 bg-slate-50 rounded-2xl ring-1 ring-slate-200" value={newTask.reward} onChange={e => setNewTask({...newTask, reward: Number(e.target.value)})} />
              </div>
              <button onClick={addTask} className="w-full bg-green-500 text-white py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-all">অ্যাড করুন</button>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-bold text-slate-500 text-sm px-2 uppercase tracking-widest">চলমান টাস্ক</h4>
            {tasks.map(t => (
              <div key={t.id} className="bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm border border-slate-50">
                <div>
                  <p className="font-bold text-slate-800">{t.title}</p>
                  <p className="text-[10px] font-bold text-indigo-500 uppercase">{t.type} | ৳{t.reward}</p>
                </div>
                <button onClick={() => setTasks(tasks.filter(x => x.id !== t.id))} className="text-red-500 font-bold text-xs bg-red-50 px-3 py-1 rounded-lg">Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'payments' && (
        <div className="space-y-4">
          <h3 className="font-bold text-slate-800 mb-4 px-2">পেমেন্ট রিকোয়েস্ট ({withdrawals.filter(w => w.status === 'pending').length})</h3>
          {withdrawals.length === 0 ? (
            <p className="text-center text-slate-400 py-10">কোনো রিকোয়েস্ট নেই</p>
          ) : (
            withdrawals.map(req => (
              <div key={req.id} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-black text-slate-800">{req.username}</h4>
                    <p className="text-xs font-bold text-slate-400">{req.method.toUpperCase()} • {req.accountNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-indigo-600">৳{req.amount}</p>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${req.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>
                      {req.status}
                    </span>
                  </div>
                </div>
                {req.status === 'pending' && (
                  <div className="flex gap-2">
                    <button onClick={() => setWithdrawals(withdrawals.map(w => w.id === req.id ? {...w, status: 'completed'} : w))} className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl font-bold text-xs shadow-md active:scale-95 transition-all">Approve</button>
                    <button onClick={() => setWithdrawals(withdrawals.map(w => w.id === req.id ? {...w, status: 'rejected'} : w))} className="flex-1 bg-red-50 text-red-500 py-2.5 rounded-xl font-bold text-xs active:scale-95 transition-all">Reject</button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const Input = ({ label, value, onChange, type = 'text' }: { label: string, value: any, onChange: (v: string) => void, type?: string }) => (
  <div>
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <input 
      type={type} 
      value={value} 
      onChange={e => onChange(e.target.value)} 
      className="w-full mt-1 p-4 bg-slate-50 border-none ring-1 ring-slate-200 rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500 transition-all" 
    />
  </div>
);

export default AdminPanel;
