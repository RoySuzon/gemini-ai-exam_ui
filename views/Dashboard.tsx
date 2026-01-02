import React, { useState, useMemo } from "react";
import {
  BookOpen,
  Clock,
  Award,
  History,
  Brain,
  Sparkles,
  Loader2,
  Trophy,
  Target,
  X,
} from "lucide-react";
import { User, Attempt, Exam } from "../types";
import { MOCK_EXAMS } from "../constants";
import { StatCard } from "../components/StatCard";
import { ExamCard } from "../components/ExamCard";
import { calculateAverage } from "../utils/formatting";

interface DashboardProps {
  user: User;
  history: Attempt[];
  isAiModalOpen: boolean;
  setIsAiModalOpen: (open: boolean) => void;
  aiTopic: string;
  setAiTopic: (topic: string) => void;
  isGenerating: boolean;
  handleAiExamGenerate: () => void;
  handleStartExam: (exam: Exam) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  history,
  isAiModalOpen,
  setIsAiModalOpen,
  aiTopic,
  setAiTopic,
  isGenerating,
  handleAiExamGenerate,
  handleStartExam,
}) => {
  const [selectedExamId, setSelectedExamId] = useState<number | string | null>(
    null
  );

  // Filter history based on selected exam
  const filteredHistory = useMemo(() => {
    if (selectedExamId === null) {
      return history;
    }
    return history.filter((attempt) => attempt.examId === selectedExamId);
  }, [history, selectedExamId]);

  // Get the selected exam title for display
  const selectedExam = useMemo(() => {
    if (selectedExamId === null) return null;
    return MOCK_EXAMS.find((exam) => exam.id === selectedExamId);
  }, [selectedExamId]);

  const handleExamCardClick = (exam: Exam) => {
    if (selectedExamId === exam.id) {
      setSelectedExamId(null); // Toggle off if already selected
    } else {
      setSelectedExamId(exam.id);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Welcome back, {user.name.split(" ")[0]}!
          </h1>
          <p className="text-slate-500 font-medium">
            Ready to test your knowledge or generate a new challenge?
          </p>
        </div>
        <button
          onClick={() => setIsAiModalOpen(true)}
          className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition-all transform hover:-translate-y-1"
        >
          <Brain className="w-5 h-5 mr-2" />
          Create AI Exam
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Trophy}
          label="Tests Taken"
          value={history.length}
          color="bg-indigo-500"
        />
        <StatCard
          icon={Target}
          label="Average Score"
          value={`${calculateAverage(history)}%`}
          color="bg-emerald-500"
        />
        <StatCard
          icon={Clock}
          label="Study Time"
          value={`${Math.round(
            history.reduce((a, c) => a + c.timeSpent, 0) / 60
          )}m`}
          color="bg-amber-500"
        />
        <StatCard
          icon={Award}
          label="Completion"
          value="94%"
          color="bg-rose-500"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Exam List */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-indigo-500" />
              Available Assessments
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_EXAMS.map((exam) => (
              <div
                key={exam.id}
                onClick={() => handleExamCardClick(exam)}
                className={`cursor-pointer transition-all ${
                  selectedExamId === exam.id
                    ? "ring-2 ring-indigo-500 rounded-2xl p-1 -m-1"
                    : ""
                }`}
              >
                <ExamCard exam={exam} onStart={handleStartExam} />
              </div>
            ))}
          </div>
        </div>

        {/* Recent History */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-fit sticky top-24">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center">
              <History className="w-5 h-5 mr-2 text-slate-400" />
              Performance History
            </h2>
            {selectedExamId !== null && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedExamId(null);
                }}
                className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                title="Show all history"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            )}
          </div>
          {selectedExamId !== null && selectedExam && (
            <div className="mb-4 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
                Filtered by:
              </p>
              <p className="text-sm font-bold text-slate-800">
                {selectedExam.title}
              </p>
            </div>
          )}
          <div className="space-y-4">
            {filteredHistory.slice(0, 5).map((attempt) => (
              <div
                key={attempt.id}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors group"
              >
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-800 text-sm truncate group-hover:text-indigo-600 transition-colors">
                    {attempt.examTitle}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {attempt.date}
                  </p>
                </div>
                <div className="flex items-center space-x-3 ml-4">
                  <div className="text-right">
                    <p
                      className={`text-sm font-black ${
                        attempt.percentage >= 70
                          ? "text-emerald-600"
                          : "text-rose-600"
                      }`}
                    >
                      {attempt.percentage}%
                    </p>
                  </div>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      attempt.percentage >= 70
                        ? "bg-emerald-500"
                        : "bg-rose-500"
                    }`}
                  ></div>
                </div>
              </div>
            ))}
            {filteredHistory.length === 0 && (
              <div className="text-center py-8">
                <p className="text-slate-400 text-sm">
                  {selectedExamId !== null
                    ? "No history for this exam yet."
                    : "No exam history yet."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => !isGenerating && setIsAiModalOpen(false)}
          ></div>
          <div className="relative bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-indigo-100 rounded-2xl text-indigo-600">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-slate-800">
                Gemini AI Generator
              </h2>
            </div>

            <p className="text-slate-500 mb-8 leading-relaxed">
              Tell Gemini what you want to be tested on. It will craft a unique
              set of questions including multiple choices and correct answers.
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Target Topic
                </label>
                <input
                  type="text"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="e.g. World War II, Photosynthesis, Python Decorators"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                  autoFocus
                  disabled={isGenerating}
                />
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleAiExamGenerate}
                  disabled={isGenerating || !aiTopic.trim()}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-lg shadow-indigo-100"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Crafting Assessment...
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5 mr-2" />
                      Generate Exam
                    </>
                  )}
                </button>
                <button
                  onClick={() => setIsAiModalOpen(false)}
                  disabled={isGenerating}
                  className="w-full py-3 text-slate-400 font-bold hover:text-slate-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
