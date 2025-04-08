"use client"
import UploadCard from "@/components/UploadCard";
import "../globals.css";
import { useState } from "react";
import { fetchData } from "@/utils/apis";
import { useQuizContext } from "@/contexts/quiz-context";
import { QuizAPIResponse, MatchingGame, FillInTheBlankQuestion, OpenResponseQuestion, MultipleChoiceQuestion, TrueFalseQuestion } from "@/schemas/definitions";

const UploadPage = () => {
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { quizzes, setQuizzes, clearQuizzes, clearQuizChoice } = useQuizContext();
    const [hoveredQuiz, setHoveredQuiz] = useState<string | null>(null);
    const [selectedQuizzes, setSelectedQuizzes] = useState<string[]>([]);
    const [showClearModal, setShowClearModal] = useState(false);

    // Quiz type icons
    const quizIcons = {
        "Matching Game": "🔄",
        "Multiple Choice": "🔘",
        "True and False": "✓✗",
        "Open Response": "✏️",
        "Fill In the Blank": "➖"
    };

    const handleUpload = (file: File | null) => {  
        setPdfFile(file);
        if (file) {
            console.log("File selected:", file);
        } else {
            console.log("File Cleared");
        }
    }

    const toggleQuizSelection = (quizType: string) => {
        setSelectedQuizzes((prevSelected) => 
            prevSelected.includes(quizType)
                ? prevSelected.filter((type) => type !== quizType)
                : [...prevSelected, quizType]
        );
    }

    const generateQuizzes = async () => {
        if (!pdfFile) {
            console.error("No file selected");
            return;
        }

        setIsLoading(true);

        try {
            const res: QuizAPIResponse = await fetchData(pdfFile, selectedQuizzes);
            setQuizzes(res);
            
            window.location.href = "/quizzes";
        } catch (error) {
            console.error("Error uploading file:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleClearQuizData = () => {
        clearQuizzes();
        setShowClearModal(true);
        setTimeout(() => setShowClearModal(false), 2000);
    }

    return (
        <div className="min-h-screen bg-[#f9f7f3] p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl text-center font-bold mb-8 text-[#0077b6]">MindGrasp Quiz Creator</h1>
                
                {/* Main content container */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left column - Upload section */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-semibold text-[#0077b6] mb-6">1. Upload Your PDF</h2>
                        <div className="mb-8">
                            <UploadCard onFileUpload={handleUpload}/>
                        </div>
                        <div className="border-t border-gray-200 pt-4 mt-4">
                            <p className="text-sm text-gray-600 mb-4">
                                {pdfFile ? `File selected: ${pdfFile.name}` : "No file selected"}
                            </p>
                        </div>
                    </div>

                    {/* Right column - Quiz options */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-semibold text-[#0077b6] mb-6">2. Select Quiz Types</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            {Object.entries(quizIcons).map(([quizType, icon]) => (
                                <div
                                    key={quizType}
                                    className={`bg-[#f9f7f3] rounded-lg border-2 overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer ${
                                        selectedQuizzes.includes(quizType) 
                                            ? "border-[#0077b6] bg-[#caf0f8] bg-opacity-30" 
                                            : "border-gray-200"
                                    }`}
                                    onMouseEnter={() => setHoveredQuiz(quizType)}
                                    onMouseLeave={() => setHoveredQuiz(null)}
                                    onClick={() => toggleQuizSelection(quizType)}
                                >
                                    <div className="p-4 flex items-center">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 
                                            ${selectedQuizzes.includes(quizType) ? "bg-[#0077b6] text-white" : "bg-white border border-gray-300"}`}>
                                            {selectedQuizzes.includes(quizType) && "✓"}
                                        </div>
                                        <div className="mr-3 text-xl">{icon}</div>
                                        <h3 className="font-medium">{quizType}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="text-sm text-gray-600 mb-4">
                            {selectedQuizzes.length === 0 
                                ? "Select at least one quiz type" 
                                : `${selectedQuizzes.length} quiz type${selectedQuizzes.length > 1 ? 's' : ''} selected`}
                        </div>
                    </div>
                </div>

                {/* Action buttons - Centered below the two columns */}
                <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                    <button 
                        className={`px-6 py-3 rounded-md bg-[#0077b6] text-white font-semibold text-lg shadow-md transition-all 
                            ${(!pdfFile || selectedQuizzes.length === 0 || isLoading) 
                                ? 'opacity-50 cursor-not-allowed' 
                                : 'hover:bg-[#005f92] hover:shadow-lg transform hover:-translate-y-1'}`} 
                        onClick={generateQuizzes}
                        disabled={!pdfFile || selectedQuizzes.length === 0 || isLoading}
                    >
                        {isLoading ? "Processing..." : "Generate Quizzes"}
                    </button>

                    <button
                    className={`px-6 py-3 rounded-md font-semibold text-lg shadow-md transition-all
                        ${
                        !quizzes || Object.keys(quizzes).length === 0
                            ? "bg-gray-400 text-white cursor-not-allowed"
                            : "bg-red-600 text-white hover:bg-red-700"
                        }`}
                    onClick={handleClearQuizData}
                    disabled={!quizzes || Object.keys(quizzes).length === 0}
                    >
                    Clear Saved Quizzes
                    </button>
                </div>

                {/* Loading overlay */}
                {isLoading && (
                    <div 
                        className="fixed inset-0 flex items-center justify-center z-50"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                    >
                        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                            <div className="flex flex-col items-center">
                                <div className="relative h-16 w-16 mb-4">
                                    <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                                    <div className="absolute inset-0 rounded-full border-4 border-[#0077b6] border-t-transparent animate-spin"></div>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Generating Quizzes</h3>
                                <p className="text-gray-600 text-center">
                                    We are scanning your PDF to create high quality questions. Hold tight, this may take a few minutes...
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                {showClearModal && (
                    <div 
                        className="fixed inset-0 flex items-center justify-center text-white px-6 py-3 rounded-lg shadow-lg z-50"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                    >
                        Old quiz data has been cleared.
                    </div>
                )}
            </div>
        </div>
    );
}

export default UploadPage;