import React from 'react';
import { Clock, BookOpen, Play } from 'lucide-react';
import { Exam } from '../types';

interface ExamCardProps {
  exam: Exam;
  onStart: (exam: Exam) => void;
}

export const ExamCard: React.FC<ExamCardProps> = ({ exam, onStart }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between hover:shadow-xl transition-all duration-300 group">
    <div>
      <div className="flex justify-between items-start mb-4">
        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full uppercase tracking-tight">
          {exam.category}
        </span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
          exam.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' :
          exam.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' :
          'bg-rose-100 text-rose-700'
        }`}>
          {exam.difficulty}
        </span>
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">{exam.title}</h3>
      <div className="flex items-center space-x-4 text-slate-500 text-sm mb-6">
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1.5 opacity-70" />
          {exam.duration} mins
        </div>
        <div className="flex items-center">
          <BookOpen className="w-4 h-4 mr-1.5 opacity-70" />
          {exam.totalQuestions} Qs
        </div>
      </div>
    </div>
    <button 
      onClick={(e) => {
        e.stopPropagation();
        onStart(exam);
      }}
      className="w-full py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center font-semibold shadow-lg shadow-slate-200"
    >
      <Play className="w-4 h-4 mr-2 fill-current" />
      Start Exam
    </button>
  </div>
);
