export interface MatchingGame {
    questions: string[];
    options: string[];
    explanation: string;
    correct_match: Record<string, string>;
}

export interface MultipleChoiceQuestion {
    question: string;
    options: string[];
    explanation: string;
    correct_answer: string;
    distractors: string[];
}

export interface FillInTheBlankQuestion {
    question: string;
    correct_answer: string;
    distractors: string[];
    explanation: string;
}

export interface OpenResponseQuestion {
    question: string;
    answer: string;
    follow_up_question: string;
}

export interface TrueFalseQuestion {
    question: string;
    correct_answer: boolean;
    explanation: string;
}

export interface QuizAPIResponse {
    matching_games: MatchingGame[];
    fill_in_the_blank: FillInTheBlankQuestion[];
    open_response: OpenResponseQuestion[];
    multiple_choice: MultipleChoiceQuestion[];
    true_and_false: TrueFalseQuestion[];
}