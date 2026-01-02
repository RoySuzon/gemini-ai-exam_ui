import React, { useState, useEffect, useCallback } from "react";
import { Exam, Attempt, User, ViewState } from "./types";
import { generateExamByTopic, getExamFeedback } from "./services/geminiService";
import { Navigation } from "./components/Navigation";
import { Dashboard } from "./views/Dashboard";
import { ExamView } from "./views/ExamView";
import { ResultView } from "./views/ResultView";

export default function App() {
  // Navigation & Core State
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [history, setHistory] = useState<Attempt[]>([
    {
      id: 1,
      examId: 1,
      examTitle: "Modern React Development",
      date: "Oct 24, 2023",
      score: 4,
      total: 5,
      percentage: 80,
      timeSpent: 300,
    },
    {
      id: 2,
      examId: 2,
      examTitle: "Advanced JavaScript Basics",
      date: "Oct 20, 2023",
      score: 2,
      total: 4,
      percentage: 50,
      timeSpent: 420,
    },
  ]);
  const [user] = useState<User>({ name: "Jordan Hayes", id: "STUD-88-01" });

  // AI Generation State
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isGettingFeedback, setIsGettingFeedback] = useState(false);

  // --- Handlers ---

  const handleStartExam = (exam: Exam) => {
    setActiveExam(exam);
    setAnswers({});
    setCurrentQuestionIdx(0);
    setTimeLeft(exam.duration * 60);
    setAiFeedback(null);
    setView(ViewState.EXAM);
  };

  const handleAnswerChange = (optionIdx: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIdx]: optionIdx,
    }));
  };

  const handleFinalSubmit = useCallback(() => {
    if (!activeExam) return;

    let score = 0;
    activeExam.questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) score++;
    });

    const timeSpent = activeExam.duration * 60 - timeLeft;
    const percentage = Math.round((score / activeExam.totalQuestions) * 100);

    const newAttempt: Attempt = {
      id: Date.now(),
      examId: activeExam.id,
      examTitle: activeExam.title,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      score,
      total: activeExam.totalQuestions,
      percentage,
      timeSpent,
    };

    setHistory((prev) => [newAttempt, ...prev]);
    setView(ViewState.RESULT);
  }, [activeExam, answers, timeLeft]);

  const handleAiExamGenerate = async () => {
    if (!aiTopic.trim()) return;
    setIsGenerating(true);
    try {
      const exam = await generateExamByTopic(aiTopic);
      handleStartExam(exam);
      setIsAiModalOpen(false);
      setAiTopic("");
    } catch (error) {
      console.error(error);
      alert("Failed to generate AI exam. Please try a different topic.");
    } finally {
      setIsGenerating(false);
    }
  };

  const fetchAiFeedback = async () => {
    if (!activeExam) return;
    setIsGettingFeedback(true);
    const lastAttempt = history[0];

    const wrongQuestions = activeExam.questions
      .filter((q, idx) => answers[idx] !== q.correctAnswer)
      .map((q) => q.text);

    try {
      const feedback = await getExamFeedback(
        activeExam.title,
        lastAttempt.score,
        lastAttempt.total,
        wrongQuestions
      );
      setAiFeedback(feedback);
    } catch (error) {
      setAiFeedback("Unable to generate coaching feedback at this moment.");
    } finally {
      setIsGettingFeedback(false);
    }
  };

  // Timer Effect
  useEffect(() => {
    let timer: number;
    if (view === ViewState.EXAM && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleFinalSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [view, timeLeft, handleFinalSubmit]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navigation user={user} activeExam={activeExam} setView={setView} />

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {view === ViewState.DASHBOARD && (
          <Dashboard
            user={user}
            history={history}
            isAiModalOpen={isAiModalOpen}
            setIsAiModalOpen={setIsAiModalOpen}
            aiTopic={aiTopic}
            setAiTopic={setAiTopic}
            isGenerating={isGenerating}
            handleAiExamGenerate={handleAiExamGenerate}
            handleStartExam={handleStartExam}
          />
        )}
        {view === ViewState.EXAM && (
          <ExamView
            activeExam={activeExam}
            currentQuestionIdx={currentQuestionIdx}
            setCurrentQuestionIdx={setCurrentQuestionIdx}
            answers={answers}
            handleAnswerChange={handleAnswerChange}
            timeLeft={timeLeft}
            handleFinalSubmit={handleFinalSubmit}
          />
        )}
        {view === ViewState.RESULT && (
          <ResultView
            activeExam={activeExam}
            history={history}
            answers={answers}
            aiFeedback={aiFeedback}
            isGettingFeedback={isGettingFeedback}
            fetchAiFeedback={fetchAiFeedback}
            setView={setView}
          />
        )}
      </main>

      {/* Background Decor */}
      <div className="fixed top-0 right-0 -z-10 w-[50vw] h-[50vh] bg-indigo-50/30 rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2"></div>
      <div className="fixed bottom-0 left-0 -z-10 w-[40vw] h-[40vh] bg-purple-50/30 rounded-full blur-3xl opacity-50 -translate-x-1/2 translate-y-1/2"></div>
    </div>
  );
}
