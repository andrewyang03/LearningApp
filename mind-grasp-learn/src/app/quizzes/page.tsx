"use client"
import { useState, useEffect } from "react";
import { useQuizContext } from "@/contexts/quiz-context";
import MatchingGamePreview from "@/components/MatchingGamePreview";
import MultipleChoicePreview from "@/components/MultipleChoicePreview";
import TrueFalsePreview from "@/components/TrueFalsePreview";
import OpenResponsePreview from "@/components/OpenResponsePreview";
import FillInTheBlankPreview from "@/components/FillInTheBlankPreview";

const Quizzes = () => {
    const { quizzes, quizChoice, setQuizChoice } = useQuizContext();
    const [hoveredQuiz, setHoveredQuiz] = useState<string | null>(null);
    const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
    const [showPreview, setShowPreview] = useState<string | null>(null);
    console.log(quizzes)

    const quizIcons = {
        "Matching Games": "🔄",
        "Multiple Choice": "🔘",
        "True and False": "✓✗",
        "Open Response": "✏️",
        "Fill In the Blank": "➖"
    };

    const handleQuizSelect = (quizType: string) => {
        const isSameQuiz = quizType === selectedQuiz;
        const quizTypeParam = quizType.toLowerCase().replace(/ /g, '_');
        setSelectedQuiz(isSameQuiz ? null : quizType);
        setQuizChoice(isSameQuiz ? null : quizTypeParam);
    };

    useEffect(() => {
        console.log(quizChoice)
    }, [quizChoice])
    
    const handleTakeQuiz = () => {
        if (selectedQuiz) { 
            window.location.href = `/take-quiz`;
        }
    }

    // Close preview when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest(".preview-modal-content") && !target.closest(".preview-button")) {
                setShowPreview(null);
            }
        };

        if (showPreview) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showPreview]);

    // Render the appropriate preview based on the preview state
    const renderPreview = () => {
        switch(showPreview) {
            case "Matching Games":
                return <MatchingGamePreview onClose={() => setShowPreview(null)} />;
            case "Multiple Choice":
                return <MultipleChoicePreview onClose={() => setShowPreview(null)} />;
            case "True and False":
                return <TrueFalsePreview onClose={() => setShowPreview(null)} />;
            case "Fill In the Blank":
                return <FillInTheBlankPreview onClose={() => setShowPreview(null)}/>;
            case "Open Response":
                return <OpenResponsePreview onClose={() => setShowPreview(null)} />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#f9f7f3] p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-[#0077b6] mb-8">Quiz Options</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Matching Games */}
                        {quizzes?.matching_games && (
                           <div
                                className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
                                onMouseEnter={() => setHoveredQuiz("Matching Games")}
                                onMouseLeave={() => setHoveredQuiz(null)}
                                onClick={() => handleQuizSelect("Matching Games")}
                            >
                                <div className={`h-2 ${(hoveredQuiz === "Matching Games" || selectedQuiz === "Matching Games") ? 'bg-[#0077b6]' : 'bg-[#caf0f8]'}`}></div>
                                <div className="p-6">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-lg font-bold text-[#0077b6]">Matching Games {quizIcons["Matching Games"]}</h2>
                                        <button 
                                            className="px-4 py-2 bg-[#0077b6] text-white rounded-md hover:bg-[#005f92] transition-colors duration-200 text-sm font-medium"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowPreview("Matching Games");
                                            }}
                                        >
                                            {quizzes.matching_games.length >= 5 ? 5 : quizzes.matching_games.length} Preview
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {quizzes?.fill_in_the_blank && (
                           <div
                                className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
                                onMouseEnter={() => setHoveredQuiz("Fill In the Blank")}
                                onMouseLeave={() => setHoveredQuiz(null)}
                                onClick={() => handleQuizSelect("Fill In the Blank")}
                            >
                                <div className={`h-2 ${(hoveredQuiz === "Fill In the Blank" || selectedQuiz === "Fill In the Blank")? 'bg-[#0077b6]' : 'bg-[#caf0f8]'}`}></div>
                                <div className="p-6">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-lg font-bold text-[#0077b6]">Fill In the Blank {quizIcons["Fill In the Blank"]}</h2>
                                        <button 
                                        className="px-4 py-2 bg-[#0077b6] text-white rounded-md hover:bg-[#005f92] transition-colors duration-200 text-sm font-medium"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowPreview("Fill In the Blank");
                                        }}
                                        >
                                            {quizzes.fill_in_the_blank.length >= 5 ? 5 : quizzes.fill_in_the_blank.length} Preview
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {quizzes?.open_response && (
                           <div
                                className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
                                onMouseEnter={() => setHoveredQuiz("Open Response")}
                                onMouseLeave={() => setHoveredQuiz(null)}
                                onClick={() => handleQuizSelect("Open Response")}
                            >
                                <div className={`h-2 ${(hoveredQuiz === "Open Response" || selectedQuiz === "Open Response") ? 'bg-[#0077b6]' : 'bg-[#caf0f8]'}`}></div>
                                <div className="p-6">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-lg font-bold text-[#0077b6]">Open Response {quizIcons["Open Response"]}</h2>
                                        <button 
                                        className="px-4 py-2 bg-[#0077b6] text-white rounded-md hover:bg-[#005f92] transition-colors duration-200 text-sm font-medium"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowPreview("Open Response");
                                        }}
                                        >
                                            {quizzes.open_response.length >= 5 ? 5 : quizzes.open_response.length} Preview
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {quizzes?.multiple_choice && (
                            <div
                                className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
                                onMouseEnter={() => setHoveredQuiz("Multiple Choice")}
                                onMouseLeave={() => setHoveredQuiz(null)}
                                onClick={() => handleQuizSelect("Multiple Choice")}
                            >
                                <div className={`h-2 ${(hoveredQuiz === "Multiple Choice" || selectedQuiz === "Multiple Choice") ? 'bg-[#0077b6]' : 'bg-[#caf0f8]'}`}></div>
                                <div className="p-6">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-lg font-bold text-[#0077b6]">Multiple Choice {quizIcons["Multiple Choice"]}</h2>
                                        <button 
                                        className="px-4 py-2 bg-[#0077b6] text-white rounded-md hover:bg-[#005f92] transition-colors duration-200 text-sm font-medium"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowPreview("Multiple Choice");
                                        }}
                                        >
                                            {quizzes.multiple_choice.length >= 5 ? 5 : quizzes.multiple_choice.length} Preview
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {quizzes?.true_and_false && (
                            <div
                                className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
                                onMouseEnter={() => setHoveredQuiz("True and False")}
                                onMouseLeave={() => setHoveredQuiz(null)}
                                onClick={() => handleQuizSelect("True and False")}
                            >
                                <div className={`h-2 ${(hoveredQuiz === "True and False" || selectedQuiz === "True and False") ? 'bg-[#0077b6]' : 'bg-[#caf0f8]'}`}></div>
                                <div className="p-6">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-lg font-bold text-[#0077b6]">True and False {quizIcons["True and False"]}</h2>
                                        <button 
                                        className="m-2 px-4 py-2 bg-[#0077b6] text-white rounded-md hover:bg-[#005f92] transition-colors duration-200 text-sm font-medium"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowPreview("True and False");
                                        }}
                                        >
                                            {quizzes.true_and_false.length >= 5 ? 5 : quizzes.true_and_false.length} Preview
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                </div>
                <div className="mt-10 flex justify-center">
                    <button 
                        onClick={handleTakeQuiz}
                        className="px-8 py-3 bg-[#0077b6] text-white text-lg font-bold rounded-md hover:bg-[#005f92] transition-all duration-300 transform hover:scale-105 shadow-md flex items-center gap-2"
                        disabled={!selectedQuiz}
                    >
                        <span>Take {selectedQuiz || "Quiz" }</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </div>
                {/* Preview Modal */}
                {showPreview && (
                    <div 
                        className="fixed inset-0 flex items-center justify-center z-50 p-4"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
                    >
                        <div className="preview-modal-content animate-fade-in">
                            {renderPreview()}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
export default Quizzes;