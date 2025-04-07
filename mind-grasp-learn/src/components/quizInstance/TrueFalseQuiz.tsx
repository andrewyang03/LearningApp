"use client"
import { useState } from "react";
import { TrueFalseQuestion } from "@/schemas/definitions";
interface TakingQuizProps {
    data: TrueFalseQuestion;
    onSubmit: (arg: boolean) => void;
    onNext: () => void;
}

const TrueFalseQuiz: React.FC<TakingQuizProps> = ({ data, onSubmit, onNext }) => {
    const [selectedOption, setSelectedOption] = useState<boolean | null>(null);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(false);
    const [answered, setAnswered] = useState(false);

    const checkAnswer = () => {
        if (selectedOption === null) {
            setFeedback("Please select an answer.");
            setIsCorrect(null);
            return;
        }

        const correct = data.correct_answer === selectedOption;
        setIsCorrect(correct);
        setFeedback(correct ? 
          `Correct! ${data.explanation}` : 
          `Incorrect. The correct answer is: ${data.correct_answer ? 'True' : 'False'}. ${data.explanation}`
        );
        
        onSubmit(correct);
        setAnswered(true);

    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">True or False</h3>
          <p className="mb-4">{data.question}</p>
          
          <div className="flex flex-col space-y-2">
            <label className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
              <input
                type="radio"
                name="trueFalse"
                checked={selectedOption === true}
                onChange={() => setSelectedOption(true)}
                className="h-4 w-4"
              />
              <span>True</span>
            </label>
            <label className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
              <input
                type="radio"
                name="trueFalse"
                checked={selectedOption === false}
                onChange={() => setSelectedOption(false)}
                className="h-4 w-4"
              />
              <span>False</span>
            </label>
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
}
export default TrueFalseQuiz;