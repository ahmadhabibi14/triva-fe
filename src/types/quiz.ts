// Quiz
export type Quiz = {
    id: number;
    name: string;
    description: string;
    questions: QuizQuestion[];
};

// QuizQuestion
export type QuizQuestion = {
    id: number;
    name: string;
    choices: QuizChoice[];
};

// QuizChoice
export type QuizChoice = {
    id: number;
    name: string;
    correct: boolean;
};

export type Player = {
    id: string;
    name: string;
};

export const COLORS: string[] = [
    "bg-pink-500",
    "bg-blue-500",
    "bg-yellow-500",
    "bg-purple-500",
];
