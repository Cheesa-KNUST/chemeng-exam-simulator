export type MCQQuestion = {
  id: string;
  kind: "mcq";
  question: string;
  options: string[];
  answer: string;
  image?: string;
};

export type TrueFalseQuestion = {
  id: string;
  kind: "true_false";
  question: string;
  options: ["True", "False"];
  answer: "True" | "False";
};

export type FillInQuestion =
  | {
      id: string;
      kind: "fill_in";
      answerType?: "text";
      question: string;
      answer: string;
      options?: never;
    }
  | {
      id: string;
      kind: "fill_in";
      answerType: "number";
      question: string;
      answer: number;
      tolerance?: number;
      options?: never;
    }
  | {
      id: string;
      kind: "fill_in";
      answerType: "range";
      question: string;
      answerMin: number;
      answerMax: number;
      answer: string;
      options?: never;
    };

export type PictorialMCQQuestion = {
  id: string;
  kind: "pictorial_mcq";
  question: string;
  image: string;
  options: string[];
  answer: string;
};

export type ExamQuestion =
  | MCQQuestion
  | TrueFalseQuestion
  | FillInQuestion
  | PictorialMCQQuestion;

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
    duration: 90,
    difficulty: "Easy",
    type: "MCQ's",
    questions: [
      {
        id: "q1",
        kind: "mcq",
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
        id: "q2",
        kind: "mcq",
        question: "Which quantity is always conserved?",
        options: ["Energy", "Temperature", "Pressure", "Volume"],
        answer: "Energy",
      },
      {
        id: "q3",
        kind: "true_false",
        question: "Entropy of an isolated system can decrease spontaneously.",
        options: ["True", "False"],
        answer: "False",
      },
      {
        id: "q4",
        kind: "fill_in",
        question: "The SI unit of energy is the ___.",
        answer: "joule",
      },
      {
        id: "q5",
        kind: "fill_in",
        answerType: "number",
        question:
          "What is the value of the universal gas constant R (in J·mol⁻¹·K⁻¹)?",
        answer: 8.314,
        tolerance: 0.01,
      },
      {
        id: "q6",
        kind: "fill_in",
        answerType: "range",
        question:
          "A piston compresses an ideal gas isothermally and the volume halves from an initial pressure of 200 kPa. What is the final pressure in kPa?",
        answerMin: 390,
        answerMax: 410,
        answer: "390-410 kPa",
      },
      {
        id: "q7",
        kind: "pictorial_mcq",
        question: "What process does this P-V diagram represent?",
        image:
          "https://ik.imagekit.io/i7gyrkpch/traditionallllllll.jpg?updatedAt=1690667730115",
        options: [
          "Carnot cycle",
          "Rankine cycle",
          "Otto cycle",
          "Brayton cycle",
        ],
        answer: "Carnot cycle",
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
        id: "q1",
        kind: "mcq",
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
        id: "q1",
        kind: "mcq",
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
        id: "q1",
        kind: "mcq",
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
        id: "q2",
        kind: "mcq",
        question: "Which quantity is always conserved?",
        options: ["Energy", "Temperature", "Pressure", "Volume"],
        answer: "Energy",
      },
    ],
  },
];
