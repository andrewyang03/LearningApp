"use client"
import { FillInTheBlankQuestion } from "@/schemas/definitions";
import React, { useState } from "react";

interface TakingQuizProps {
    data: FillInTheBlankQuestion;
    onSubmit: (arg: boolean) => void;
    onNext: () => void;
}

const FillInTheBlankQuiz: React.FC<TakingQuizProps> = ({data, onSubmit, onNext}) => {
    const [answer, setAnswer] = useState<string>("");
    const [feedback, setFeedback] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(false);
    const [answered, setAnswered] = useState(false);

    const checkAnswer = () => {
        if (!answer.trim()) {
            setFeedback("Please fill in the blank.");
            return;
        }

        const correct = data.correct_answer.toLowerCase() === answer.toLowerCase();
        setIsCorrect(correct);
        setFeedback(correct ? 
            `Correct! ${data.explanation}` : 
            `Incorrect. The correct answer is: ${data.correct_answer}. ${data.explanation}`
        );

        onSubmit(correct);
        setAnswered(true);
        
    }
    

    // Replace blank markers with actual input field
  const questionParts = data.question.split('___');
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Fill in the Blank</h3>
        
        <div className="mb-4">
            {questionParts.map((part, index) => (
            <span key={index}>
                {part}
                {index < questionParts.length - 1 && (
                <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="mx-1 p-1 border-b-2 border-blue-400 focus:outline-none focus:border-blue-600 w-32"
                />
                )}
            </span>
            ))}
        </div>
        
        {feedback && (
            <div className={`mt-4 p-3 rounded ${isCorrect ? 'bg-green-100 text-green-800' : isCorrect === false ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {feedback}
            </div>
        )}
        
        <div className="flex space-x-4 mt-6">
            {!answered ? (
            <button 
                onClick={checkAnswer}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Submit Answer
            </button>
            ) : (
            <button 
                onClick={onNext}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
                Next Question
            </button>
            )}
        </div>
    </div>
    );
};

export default FillInTheBlankQuiz;