
import React from 'react';
import { Task, UserData } from '../types';

interface TasksViewProps {
  tasks: Task[];
  user: UserData;
  setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
}

const TasksView: React.FC<TasksViewProps> = ({ tasks, user, setUser }) => {
  const complete = (task: Task) => {
    if (user.completedTasks?.includes(task.id)) return;
    
    window.open(task.link, '_blank');
    
    setTimeout(() => {
      if (window.confirm(`${task.title} কি সম্পন্ন করেছেন?`)) {
        setUser(prev => {
          if (!prev) return null;
          return {
            ...prev,
            balance: prev.balance + task.reward,
            completedTasks: [...(prev.completedTasks || []), task.id]
          };
        });
      }
    }, 3000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-black text-slate-800">অ্যাভেইলেবল টাস্ক</h2>
        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{tasks.length} টি টাস্ক</span>
      </div>
      
      {tasks.length === 0 ? (
        <div className="bg-white p-10 rounded-3xl text-center border border-dashed border-slate-300">
          <p className="text-slate-400 font-medium">বর্তমানে কোনো টাস্ক নেই!</p>
        </div>
      ) : (
        tasks.map(task => {
          const isDone = user.completedTasks?.includes(task.id);
          return (
            <div key={task.id} className={`p-4 rounded-3xl border transition-all flex items-center gap-4 ${isDone ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-white border-white shadow-sm hover:shadow-md'}`}>
               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner ${task.type === 'telegram' ? 'bg-sky-100 text-sky-600' : task.type === 'youtube' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                 {task.type === 'telegram' ? '💬' : task.type === 'youtube' ? '🎥' : '👤'}
               </div>
               <div className="flex-1">
                 <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{task.title}</h4>
                 <p className="text-xs font-black text-green-600 mt-0.5">রিওয়ার্ড: ৳{task.reward.toFixed(2)}</p>
               </div>
               <button 
                 disabled={isDone}
                 onClick={() => complete(task)}
                 className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${isDone ? 'bg-slate-200 text-slate-400' : 'bg-indigo-600 text-white shadow-lg active:scale-90'}`}
               >
                 {isDone ? 'Done' : 'Start'}
               </button>
            </div>
          );
        })
      )}
    </div>
  );
};

export default TasksView;
