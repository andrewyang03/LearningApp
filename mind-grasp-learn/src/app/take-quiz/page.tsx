'use client'

import { useState, useEffect } from 'react';
import { useQuizContext } from "@/contexts/quiz-context";
import { MatchingGame, MultipleChoiceQuestion, TrueFalseQuestion, OpenResponseQuestion, FillInTheBlankQuestion, QuizAPIResponse } from '@/schemas/definitions';
import MatchingGameQuiz from "@/components/quizInstance/MatchingGameQuiz";
import MultipleChoiceQuiz from "@/components/quizInstance/MultipleChoiceQuiz";
import TrueFalseQuiz from "@/components/quizInstance/TrueFalseQuiz";
import OpenResponseQuiz from "@/components/quizInstance/OpenResponseQuiz";
import FillInTheBlankQuiz from "@/components/quizInstance/FillInTheBlankQuiz";
import { exportAsHTML, exportAsPDF } from '@/utils/export';

interface QuizContextType {
  quizzes: QuizAPIResponse | null; // quizzes can be null initially
  setQuizzes: (quizzes: QuizAPIResponse) => void;
}


const TakeQuiz = () => {
  const { quizzes, quizChoice } = useQuizContext();
  const type = quizChoice as keyof QuizAPIResponse;

  const [quizData, setQuizData] = useState<MatchingGame[] |MultipleChoiceQuestion[] | TrueFalseQuestion[] | OpenResponseQuestion[] | FillInTheBlankQuestion[]>([]);
  const [currQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const mapping: Record<string, keyof QuizAPIResponse> = {
    "fill_in_the_blank": "fill_in_the_blank",
    "multiple_choice": "multiple_choice",
    "open_response": "open_response",
    "true_and_false": "true_and_false",
    "matching_games": "matching_games",
  }

  useEffect(() => {
    if (type && quizzes) {
      const quizKey = mapping[type];
      if (quizKey) {
        const selectedQuizzes = quizzes[quizKey];

        if (selectedQuizzes && selectedQuizzes.length > 0) {
          shuffleQuestions(selectedQuizzes, quizKey)

          setCurrentQuestionIndex(0);
          setScore(0);
          setQuizCompleted(false);
        }
      }
    }
  }, [type, quizzes]);

  // Uses type any since we know for sure it's coming from the verified mapping. Otherwise we aren't using this function
  const shuffleQuestions = (selectedQuizzes: any, quizKey: any) => {
    const shuffledQuizzes = [...selectedQuizzes].sort(() => Math.random() - 0.5);
    const length = Math.min(5, shuffledQuizzes.length);
    const randomQuestions = shuffledQuizzes.slice(0, length);

    // Narrow the type of selectedQuizzes and set the state
    if (quizKey === "matching_games") {
      setQuizData(randomQuestions as MatchingGame[]);
    } else if (quizKey === "multiple_choice") {
      setQuizData(randomQuestions as MultipleChoiceQuestion[]);
    } else if (quizKey === "true_and_false") {
      setQuizData(randomQuestions as TrueFalseQuestion[]);
    } else if (quizKey === "fill_in_the_blank") {
      setQuizData(randomQuestions as FillInTheBlankQuestion[]);
    } else if (quizKey === "open_response") {
      setQuizData(randomQuestions as OpenResponseQuestion[]);
    }
  }

  const handleOpenResponseSubmit = (isCorrect: string) => {
    if (isCorrect == "correct") {
      setScore(prev => prev + 1);
    } else if (isCorrect == "partially correct") {
      setScore(prev => prev + 0.5)
    }
  }

  const handleQuestionSubmit = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const toNextQuestion = () => {
    if (currQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      setQuizCompleted(true)
    }
  }

  const restartQuiz = () => {
    // Reshuffle questions
    if (type && quizzes) {
      const quizKey = mapping[type];
      if (quizKey) {
        const selectedQuizzes = quizzes[quizKey];
        
        if (selectedQuizzes && selectedQuizzes.length > 0) {
          shuffleQuestions(selectedQuizzes, quizKey)
        }
      }
    }

    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizCompleted(false);
  };

  const navigateToQuizzes = () => {
    window.location.href = "/quizzes";
  }

  if (!quizzes || !type || quizData.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Take Quiz</h1>
        <div className="p-8 bg-white rounded-lg shadow-md text-center">
          <p>Loading quiz or no quiz questions available...</p>
        </div>
      </div>
    );
  }

  const renderQuestion = () => {
    if (quizCompleted) {
      return (
        <div className="p-6 bg-white rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
          <p className="text-xl mb-6">Your score: {score} out of {quizData.length}</p>
          <div className = "flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={restartQuiz}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Take this Quiz Again
            </button>
            <button
              onClick={navigateToQuizzes}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Try Other Quizzes
            </button>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Export Quiz:</h3>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => exportAsHTML(score, quizData, mapping, type)}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Download as HTML
              </button>
              <button
                onClick={() => exportAsPDF(score, quizData, mapping, type)}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                Save as PDF
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    const currentQuestion = quizData[currQuestionIndex];
    
    if (mapping[type] === "matching_games") {
        return <MatchingGameQuiz 
          key={currQuestionIndex}
          data={currentQuestion as MatchingGame} 
          onSubmit={handleQuestionSubmit} 
          onNext={toNextQuestion}
        />;
      } else if (mapping[type] === "multiple_choice") {
        return <MultipleChoiceQuiz 
          key={currQuestionIndex}
          data={currentQuestion as MultipleChoiceQuestion} 
          onSubmit={handleQuestionSubmit} 
          onNext={toNextQuestion}
        />;
      } else if (mapping[type] === "true_and_false") {
        return <TrueFalseQuiz 
          key={currQuestionIndex}
          data={currentQuestion as TrueFalseQuestion} 
          onSubmit={handleQuestionSubmit} 
          onNext={toNextQuestion}
        />;
      } else if (mapping[type] === "fill_in_the_blank") {
        return <FillInTheBlankQuiz 
          key={currQuestionIndex}
          data={currentQuestion as FillInTheBlankQuestion} 
          onSubmit={handleQuestionSubmit} 
          onNext={toNextQuestion}
        />;
      } else if (mapping[type] === "open_response") {
        return <OpenResponseQuiz 
          key={currQuestionIndex}
          data={currentQuestion as OpenResponseQuestion} 
          onSubmit={handleOpenResponseSubmit} 
          onNext={toNextQuestion}
        />;
      }
      
      return null;
    };
  

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Take Quiz</h1>
      <p className="mb-6">Take a quiz on a specific topic.</p>
      
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-medium">Question {currQuestionIndex + 1} of {quizData.length}</span>
          </div>
          <div>
            <span className="font-medium">Score: {score}</span>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${((currQuestionIndex + 1) / quizData.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {renderQuestion()}
    </div>
  );
}
export default TakeQuiz;