
import { Exam } from './types';

export const MOCK_EXAMS: Exam[] = [
  {
    id: 1,
    title: "Modern React Development",
    category: "Web Engineering",
    duration: 15,
    totalQuestions: 5,
    difficulty: "Medium",
    questions: [
      {
        id: 101,
        text: "What is the primary purpose of the useMemo hook?",
        options: [
          "To perform side effects",
          "To memoize expensive calculations",
          "To handle global state",
          "To create refs"
        ],
        correctAnswer: 1
      },
      {
        id: 102,
        text: "In React, what does 'Lifting State Up' refer to?",
        options: [
          "Moving state to a lower component",
          "Syncing state between two components using their closest common ancestor",
          "Deploying the state to a cloud server",
          "Deleting state to improve performance"
        ],
        correctAnswer: 1
      },
      {
        id: 103,
        text: "Which life-cycle equivalent does useEffect with an empty dependency array represent?",
        options: [
          "componentDidUpdate",
          "componentWillUnmount",
          "componentDidMount",
          "constructor"
        ],
        correctAnswer: 2
      },
      {
        id: 104,
        text: "What is the Virtual DOM?",
        options: [
          "A direct copy of the HTML",
          "An in-memory representation of the real DOM",
          "A server-side rendering tool",
          "A specialized CSS parser"
        ],
        correctAnswer: 1
      },
      {
        id: 105,
        text: "Strict Mode in React is used for:",
        options: [
          "Compiling TypeScript",
          "Enabling better CSS support",
          "Highlighting potential problems in an application",
          "Preventing all errors"
        ],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 2,
    title: "Advanced JavaScript Basics",
    category: "Programming",
    duration: 10,
    totalQuestions: 4,
    difficulty: "Hard",
    questions: [
      {
        id: 201,
        text: "What is the result of 'typeof null' in JavaScript?",
        options: ["'null'", "'undefined'", "'object'", "'string'"],
        correctAnswer: 2
      },
      {
        id: 202,
        text: "Which of the following is NOT a falsy value?",
        options: ["0", "'' (empty string)", "NaN", "[] (empty array)"],
        correctAnswer: 3
      },
      {
        id: 203,
        text: "What does the 'bind' method do?",
        options: [
          "Executes a function immediately",
          "Creates a new function with a specific 'this' context",
          "Deletes a function",
          "Parses JSON"
        ],
        correctAnswer: 1
      },
      {
        id: 204,
        text: "Async functions always return:",
        options: ["An object", "A Promise", "A string", "Nothing"],
        correctAnswer: 1
      }
    ]
  }
];
