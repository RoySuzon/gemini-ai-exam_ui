import React from 'react';
import { LogOut } from 'lucide-react';
import { User, ViewState } from '../types';

interface NavigationProps {
  user: User;
  activeExam: any;
  setView: (view: ViewState) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ user, activeExam, setView }) => (
  <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 transition-all">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-20">
        <div className="flex items-center space-x-4 cursor-pointer" onClick={() => !activeExam && setView(ViewState.DASHBOARD)}>
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-indigo-100 transform rotate-3">
            G
          </div>
          <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 tracking-tighter">
            GeminiQuest
          </span>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="hidden sm:flex flex-col items-end pr-4 border-r border-slate-100">
            <span className="text-sm font-black text-slate-800">{user.name}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.id}</span>
          </div>
          <div className="h-11 w-11 bg-slate-100 border-2 border-white rounded-2xl flex items-center justify-center text-slate-400 font-black shadow-inner overflow-hidden ring-2 ring-indigo-50">
             <img src={`https://picsum.photos/seed/${user.id}/44/44`} alt="avatar" />
          </div>
          <button className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  </nav>
);
