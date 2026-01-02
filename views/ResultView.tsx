import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Brain, Loader2 } from 'lucide-react';
import { Exam, Attempt, ViewState } from '../types';
import { formatSeconds } from '../utils/formatting';

interface ResultViewProps {
  activeExam: Exam | null;
  history: Attempt[];
  answers: Record<number, number>;
  aiFeedback: string | null;
  isGettingFeedback: boolean;
  fetchAiFeedback: () => void;
  setView: (view: ViewState) => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  activeExam,
  history,
  answers,
  aiFeedback,
  isGettingFeedback,
  fetchAiFeedback,
  setView,
}) => {
  const lastAttempt = history[0];
  const isPass = lastAttempt.percentage >= 70;

  return (
    <div className="max-w-4xl mx-auto animate-in zoom-in-95 duration-500">
      <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden">
        {/* Hero Banner */}
        <div className={`p-12 text-center relative overflow-hidden ${isPass ? 'bg-emerald-50/30' : 'bg-rose-50/30'}`}>
          {/* Animated BG elements */}
          <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-200/20 rounded-full blur-3xl"></div>
          
          <div className={`w-24 h-24 mx-auto rounded-3xl flex items-center justify-center mb-6 shadow-xl ${isPass ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
            {isPass ? <CheckCircle className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">
            {isPass ? 'Success! You Passed.' : 'Not Quite There Yet.'}
          </h1>
          <p className="text-slate-500 font-medium">
            You correctly answered <span className="font-bold text-slate-900">{lastAttempt.score}</span> out of <span className="font-bold text-slate-900">{lastAttempt.total}</span> questions.
          </p>
        </div>

        {/* AI Coaching Section */}
        <div className="px-10 pb-10">
          {!aiFeedback ? (
            <button 
              onClick={fetchAiFeedback}
              disabled={isGettingFeedback}
              className="w-full bg-indigo-600 text-white py-5 rounded-2xl flex items-center justify-center font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all transform hover:-translate-y-1"
            >
              {isGettingFeedback ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  Gemini is analyzing your patterns...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5 mr-3" />
                  Get AI Performance Breakdown
                </>
              )}
            </button>
          ) : (
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-3xl border border-indigo-100 shadow-inner">
              <div className="flex items-center mb-4 text-indigo-700 font-black uppercase tracking-wider text-sm">
                <Brain className="w-5 h-5 mr-3" />
                AI Study Coach Feedback
              </div>
              <div className="prose prose-slate max-w-none text-slate-700">
                {/* Simplistic rendering of Markdown-ish feedback */}
                <div className="whitespace-pre-wrap leading-relaxed space-y-4">
                  {aiFeedback.split('\n').map((line, i) => {
                    if (line.startsWith('#')) return <h3 key={i} className="text-lg font-bold text-slate-800">{line.replace(/#/g, '').trim()}</h3>;
                    if (line.startsWith('-')) return <li key={i} className="ml-4">{line.replace('-', '').trim()}</li>;
                    return <p key={i}>{line}</p>;
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Breakdown */}
        <div className="grid grid-cols-3 border-y border-slate-100">
          <div className="p-8 text-center border-r border-slate-100">
            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Final Score</span>
            <span className={`text-4xl font-black ${isPass ? 'text-emerald-600' : 'text-rose-600'}`}>{lastAttempt.percentage}%</span>
          </div>
          <div className="p-8 text-center border-r border-slate-100">
            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Time Invested</span>
            <span className="text-4xl font-black text-slate-800">{formatSeconds(lastAttempt.timeSpent)}</span>
          </div>
          <div className="p-8 text-center">
            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Rank Status</span>
            <span className={`text-4xl font-black ${isPass ? 'text-emerald-500' : 'text-rose-400'}`}>
              {lastAttempt.percentage === 100 ? 'S+' : lastAttempt.percentage >= 90 ? 'A' : lastAttempt.percentage >= 80 ? 'B' : lastAttempt.percentage >= 70 ? 'C' : 'F'}
            </span>
          </div>
        </div>

        {/* Review Section */}
        <div className="p-10 bg-slate-50/50">
          <h3 className="font-black text-slate-800 mb-8 text-xl">Answer Review</h3>
          <div className="space-y-6">
            {activeExam?.questions.map((q, idx) => {
              const userChoice = answers[idx];
              const correct = q.correctAnswer;
              const isCorrect = userChoice === correct;
              
              return (
                <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="flex items-start gap-6">
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-slate-900 text-white rounded-lg font-bold text-sm">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-bold text-slate-800 mb-6 leading-snug">{q.text}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {q.options.map((opt, oIdx) => {
                          const isUserSelected = userChoice === oIdx;
                          const isCorrectAnswer = correct === oIdx;
                          
                          let boxStyle = "border-slate-100 text-slate-400";
                          if (isCorrectAnswer) boxStyle = "bg-emerald-50 border-emerald-500 text-emerald-700 font-bold";
                          else if (isUserSelected && !isCorrect) boxStyle = "bg-rose-50 border-rose-500 text-rose-700 font-bold";

                          return (
                            <div key={oIdx} className={`p-4 rounded-xl border-2 text-sm flex items-center justify-between transition-all ${boxStyle}`}>
                              <span>{opt}</span>
                              {isCorrectAnswer && <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 ml-2" />}
                              {isUserSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0 ml-2" />}
                            </div>
                          );
                        })}
                      </div>
                      {!isCorrect && userChoice === undefined && (
                        <div className="mt-4 flex items-center text-amber-600 text-sm font-bold bg-amber-50 p-2 px-4 rounded-lg w-fit">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Question Skipped
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-10 border-t border-slate-100 flex justify-center bg-white sticky bottom-0 z-10">
          <button
            onClick={() => setView(ViewState.DASHBOARD)}
            className="px-12 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all transform hover:scale-105 shadow-2xl shadow-slate-200 active:scale-95"
          >
            Back to Portal Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
