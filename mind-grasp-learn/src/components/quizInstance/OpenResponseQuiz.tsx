"use client"
import { useState } from "react";
import { OpenResponseQuestion } from "@/schemas/definitions";
interface TakingQuizProps {
    data: OpenResponseQuestion;
    onSubmit: (arg: boolean) => void;
    onNext: () => void;
}

const OpenResponseQuiz: React.FC<TakingQuizProps> = ({ data, onSubmit, onNext }) => {
    const [response, setResponse] = useState('');
    const [answered, setAnswered] = useState(false)
    
    const handleSubmit = () => {
        if (!response.trim()) {
            return;
        }
        onSubmit(true); 
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
                    <div className="mt-4 p-4 bg-blue-50 rounded-md">
                        <h4 className="font-medium">Sample Answer:</h4>
                        <p className="mt-2">{data.answer}</p>
                        
                        <h4 className="font-medium mt-4">Follow-up Question:</h4>
                        <p className="mt-2">{data.follow_up_question}</p>
                    </div>
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