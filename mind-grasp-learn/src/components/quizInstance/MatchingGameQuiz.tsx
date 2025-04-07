"use client"
import { useState } from "react";
import { MatchingGame } from "@/schemas/definitions";
import { stringify } from "querystring";
interface TakingQuizProps {
    data: MatchingGame;
    onSubmit: (arg: boolean) => void;
    onNext: () => void;
}

const MatchingGameQuiz: React.FC<TakingQuizProps> = ({ data, onSubmit, onNext }) => {
    const [connections, setConnections] = useState<Record<string, string>>({});
    const [feedback, setFeedback] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(false);
    const [answered, setAnswered] = useState(false);

    const handleConnect = (question: string, option: string) => {
        setConnections((prev) => ({
            ...prev,
            [question]: option,
        }));
    };

    const checkAnswers = () => {
        const isAllCorrect = Object.entries(connections).every(
            ([question, selectedOption]) => data.correct_match[question] === selectedOption
        );
        
        const allQuestionsAnswered = data.questions.every(q => connections[q]);

        if(!allQuestionsAnswered) {
            setFeedback("Please answer all questions.");
            setIsCorrect(null);
            return;
        }

        if (isAllCorrect) {
            setFeedback("All answers are correct!");
            setIsCorrect(true);
        } else {
            setFeedback("There are incorrect answers. Please try again.");
            setIsCorrect(false);
        }

        onSubmit(isAllCorrect)
        setAnswered(true);
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Matching Game</h3>
          
          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col space-y-4">
              <h4 className="font-medium">Questions</h4>
              {data.questions.map((question, index) => (
                <div key={index} className="p-3 bg-blue-50 rounded-md border border-blue-200">
                  {question}
                  <div className="mt-2">
                    <select 
                      className="w-full p-2 border rounded"
                      value={connections[question] || ''}
                      onChange={(e) => handleConnect(question, e.target.value)}
                    >
                      <option value="">Select a match</option>
                      {data.options.map((option, idx) => (
                        <option key={idx} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col space-y-4">
              <h4 className="font-medium">Options</h4>
              {data.options.map((option, index) => (
                <div key={index} className="p-3 bg-green-50 rounded-md border border-green-200">
                  {option}
                </div>
              ))}
            </div>
          </div>
          
          {feedback && (
            <div className={`mt-4 p-3 rounded ${isCorrect ? 'bg-green-100 text-green-800' : isCorrect === false ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {feedback}
            </div>
          )}
          
          <div className="flex space-x-4 mt-6">
            {!answered ? (
              <button 
                  onClick={checkAnswers}
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
export default MatchingGameQuiz;