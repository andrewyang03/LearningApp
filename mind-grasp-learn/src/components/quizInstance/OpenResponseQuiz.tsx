"use client"
import { useState } from "react";
import { OpenResponseQuestion } from "@/schemas/definitions";
import { checkOpenResponse } from "@/utils/apis";
interface TakingQuizProps {
    data: OpenResponseQuestion;
    onSubmit: (arg: string) => void;
    onNext: () => void;
}

const OpenResponseQuiz: React.FC<TakingQuizProps> = ({ data, onSubmit, onNext }) => {
    const [response, setResponse] = useState('');
    const [answered, setAnswered] = useState(false)
    const [isCorrect, setIsCorrect] = useState<string | null>("");
    const [feedback, setFeedback] = useState<string | null>(null);
    
    const handleSubmit = async () => {
        if (!response.trim()) {
            return;
        }
        const feedback = await checkOpenResponse(data, response)
        let outputStr = feedback["output"]
        if (typeof outputStr === "string") {
            outputStr = outputStr.replace(/```json|```/g, "").trim()
        }

        const output = JSON.parse(outputStr)
        
        const correct = output["decision"]
        const explanation = output["explanation"]

        setIsCorrect(correct);
        setFeedback(correct === 'correct' ? 
            `Correct! ${explanation}` : correct === 'incorrect' ?
            `Incorrect. An example answer is: ${data.answer}. ${explanation}` :
            `Partially Correct. ${explanation}`
          );
        onSubmit(correct); 
        setAnswered(true);

    };


    return(
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Open Response Question</h3>
            <p className="mb-4">{data.question}</p>
            
            <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                className="w-full p-3 border rounded-md h-32"
                placeholder="Type your answer here..."
                disabled={answered}
            />
            
            {!answered ? (
                <button 
                    onClick={handleSubmit}
                    className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    disabled={!response.trim()}
                >
                    Submit Response
                </button>

            ) : (
                <div className="flex flex-col gap-4 mt-6">
                    {feedback && (
                        <div className={`mt-4 p-3 rounded ${isCorrect === 'correct' ? 'bg-green-100 text-green-800' : isCorrect === 'incorrect' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {feedback}
                        </div>
                    )}
                    <button 
                        onClick={onNext}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Next Question
                    </button>
                </div>
            )}
        </div>
    );
}
export default OpenResponseQuiz;