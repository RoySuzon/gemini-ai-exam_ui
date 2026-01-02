import React from 'react';
import { Clock, ChevronRight, ChevronLeft } from 'lucide-react';
import { Exam } from '../types';
import { formatSeconds } from '../utils/formatting';

interface ExamViewProps {
  activeExam: Exam;
  currentQuestionIdx: number;
  setCurrentQuestionIdx: React.Dispatch<React.SetStateAction<number>>;
  answers: Record<number, number>;
  handleAnswerChange: (optionIdx: number) => void;
  timeLeft: number;
  handleFinalSubmit: () => void;
}

export const ExamView: React.FC<ExamViewProps> = ({
  activeExam,
  currentQuestionIdx,
  setCurrentQuestionIdx,
  answers,
  handleAnswerChange,
  timeLeft,
  handleFinalSubmit,
}) => {
  if (!activeExam) return null;
  const currentQ = activeExam.questions[currentQuestionIdx];

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-10rem)] flex flex-col md:flex-row gap-8 animate-in slide-in-from-right-8 duration-500">
      
      {/* Question Area */}
      <div className="flex-1 flex flex-col bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden relative">
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white">
          <div className="min-w-0 pr-4">
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-1">
              Question {currentQuestionIdx + 1} / {activeExam.totalQuestions}
            </p>
            <h2 className="text-xl font-bold text-slate-800 truncate">{activeExam.title}</h2>
          </div>
          <div className={`flex items-center px-5 py-2.5 rounded-2xl font-mono font-black text-xl border-2 transition-colors ${
            timeLeft < 60 ? 'border-rose-200 bg-rose-50 text-rose-600 animate-pulse' : 'border-slate-100 bg-slate-50 text-slate-700'
          }`}>
            <Clock className="w-5 h-5 mr-3" />
            {formatSeconds(timeLeft)}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute top-[108px] left-0 right-0 h-1 bg-slate-50">
          <div 
            className="h-full bg-indigo-500 transition-all duration-500 shadow-[0_0_8px_rgba(79,70,229,0.4)]" 
            style={{ width: `${((currentQuestionIdx + 1) / activeExam.totalQuestions) * 100}%` }}
          ></div>
        </div>

        {/* Main Question Body */}
        <div className="flex-1 p-10 overflow-y-auto">
          <h3 className="text-2xl font-bold text-slate-800 mb-10 leading-tight">
            {currentQ.text}
          </h3>

          <div className="space-y-4">
            {currentQ.options.map((option, idx) => {
              const isSelected = answers[currentQuestionIdx] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleAnswerChange(idx)}
                  className={`group w-full p-6 text-left rounded-2xl border-2 transition-all duration-200 flex items-center ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-md'
                      : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-full border-2 mr-5 flex items-center justify-center transition-all ${
                     isSelected ? 'border-indigo-600 bg-indigo-600 scale-110' : 'border-slate-200 group-hover:border-indigo-300'
                  }`}>
                    {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                  </div>
                  <span className="text-lg font-medium">{option}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="p-8 border-t border-slate-100 flex justify-between bg-slate-50/30">
          <button
            onClick={() => setCurrentQuestionIdx(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIdx === 0}
            className="px-8 py-3 rounded-2xl text-slate-500 font-bold hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center transition-all"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous
          </button>
          
          {currentQuestionIdx === activeExam.totalQuestions - 1 ? (
            <button
              onClick={handleFinalSubmit}
              className="px-10 py-3 rounded-2xl bg-indigo-600 text-white font-black hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all transform hover:scale-105 active:scale-95"
            >
              Complete Exam
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestionIdx(prev => Math.min(activeExam.totalQuestions - 1, prev + 1))}
              className="px-10 py-3 rounded-2xl bg-slate-900 text-white font-black hover:bg-slate-800 flex items-center transition-all transform hover:translate-x-1 active:translate-x-0"
            >
              Next Question
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          )}
        </div>
      </div>

      {/* Sidebar Info */}
      <div className="w-full md:w-80 space-y-6">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Question Navigator</h4>
          <div className="grid grid-cols-4 gap-3">
            {activeExam.questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestionIdx(idx)}
                className={`w-12 h-12 rounded-xl text-sm font-bold flex items-center justify-center transition-all ${
                  currentQuestionIdx === idx 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110' 
                    : answers[idx] !== undefined
                      ? 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                      : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
          
          <div className="mt-10 pt-8 border-t border-slate-100 space-y-4">
            <div className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-tight">
              <div className="w-3 h-3 bg-indigo-600 rounded-full mr-3 shadow-sm"></div>
              Active Item
            </div>
            <div className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-tight">
              <div className="w-3 h-3 bg-indigo-100 rounded-full mr-3"></div>
              Completed
            </div>
            <div className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-tight">
              <div className="w-3 h-3 bg-slate-50 rounded-full mr-3"></div>
              Not Visited
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
