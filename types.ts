
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Question {
  id: number | string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface Exam {
  id: number | string;
  title: string;
  category: string;
  duration: number; // in minutes
  totalQuestions: number;
  difficulty: Difficulty;
  questions: Question[];
}

export interface Attempt {
  id: number | string;
  examId: number | string;
  examTitle: string;
  date: string;
  score: number;
  total: number;
  percentage: number;
  timeSpent: number; // in seconds
}

export interface User {
  name: string;
  id: string;
  avatar?: string;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  EXAM = 'EXAM',
  RESULT = 'RESULT',
}
