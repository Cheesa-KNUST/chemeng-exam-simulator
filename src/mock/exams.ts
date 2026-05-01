export type ExamQuestion = {
  question: string;
  options: string[];
  answer: string;
};

export type Exam = {
  id: string;
  courseSlug: string;
  title: string;
  duration: number;
  difficulty: string;
  type: string;
  questions: ExamQuestion[];
};

export const exams: Exam[] = [
  {
    id: "exam-1",
    courseSlug: "chemical-engineering-101",
    title: "Thermodynamics Basics",
    duration: 2,
    difficulty: "Easy",
    type: "MCQ's",
    questions: [
      {
        question: "What is the first law of thermodynamics?",
        options: [
          "Energy cannot be created or destroyed",
          "Heat flows from cold to hot",
          "Mass is conserved only",
          "Entropy decreases in isolated systems",
        ],
        answer: "Energy cannot be created or destroyed",
      },
      {
        question: "Which quantity is always conserved?",
        options: ["Energy", "Temperature", "Pressure", "Volume"],
        answer: "Energy",
      },
      {
        question: "What is the first law of thermodynamics?",
        options: [
          "Energy cannot be created or destroyed",
          "Heat flows from cold to hot",
          "Mass is conserved only",
          "Entropy decreases in isolated systems",
        ],
        answer: "Energy cannot be created or destroyed",
      },
      {
        question: "Which quantity is always conserved?",
        options: ["Energy", "Temperature", "Pressure", "Volume"],
        answer: "Energy",
      },
      {
        question: "Which quantity is always conserved?",
        options: ["Energy", "Temperature", "Pressure", "Volume"],
        answer: "Energy",
      },
    ],
  },
  {
    id: "exam-2",
    courseSlug: "chemical-engineering-101",
    title: "Fluid Mechanics Intro",
    duration: 45,
    difficulty: "Medium",
    type: "Theory",
    questions: [
      {
        question: "What is viscosity?",
        options: [
          "Resistance to flow",
          "Density of fluid",
          "Pressure gradient",
          "Heat capacity",
        ],
        answer: "Resistance to flow",
      },
    ],
  },
  {
    id: "exam-3",
    courseSlug: "thermodynamics",
    title: "Laws of Thermodynamics",
    duration: 40,
    difficulty: "Hard",
    type: "Theory and MCQ's",
    questions: [
      {
        question: "Second law of thermodynamics states?",
        options: [
          "Entropy of universe increases",
          "Energy is created",
          "Mass increases",
          "Temperature is constant",
        ],
        answer: "Entropy of universe increases",
      },
    ],
  },
  {
    id: "exam-4",
    courseSlug: "chemical-engineering-102",
    title: "Thermodynamics",
    duration: 30,
    difficulty: "Easy",
    type: "MCQ's",
    questions: [
      {
        question: "What is the first law of thermodynamics?",
        options: [
          "Energy cannot be created or destroyed",
          "Heat flows from cold to hot",
          "Mass is conserved only",
          "Entropy decreases in isolated systems",
        ],
        answer: "Energy cannot be created or destroyed",
      },
      {
        question: "Which quantity is always conserved?",
        options: ["Energy", "Temperature", "Pressure", "Volume"],
        answer: "Energy",
      },
    ],
  },
  {
    id: "exam-5",
    courseSlug: "chemical-engineering-101",
    title: "Fluid Mechanics Intro",
    duration: 45,
    difficulty: "Medium",
    type: "Theory",
    questions: [
      {
        question: "What is viscosity?",
        options: [
          "Resistance to flow",
          "Density of fluid",
          "Pressure gradient",
          "Heat capacity",
        ],
        answer: "Resistance to flow",
      },
    ],
  },
  {
    id: "exam-6",
    courseSlug: "thermodynamics",
    title: "Laws of Thermodynamics",
    duration: 40,
    difficulty: "Hard",
    type: "Theory and MCQ's",
    questions: [
      {
        question: "Second law of thermodynamics states?",
        options: [
          "Entropy of universe increases",
          "Energy is created",
          "Mass increases",
          "Temperature is constant",
        ],
        answer: "Entropy of universe increases",
      },
    ],
  },
];
