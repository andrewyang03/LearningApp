"use client"
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { QuizAPIResponse } from '@/schemas/definitions';

type QuizContextType = {
    quizzes: QuizAPIResponse | null;
    setQuizzes: (quizzes: QuizAPIResponse) => void;
    clearQuizzes: () => void;
    quizChoice: string | null;
    setQuizChoice: (choice: string | null) => void;
    clearQuizChoice: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider = ({ children }: {children: ReactNode}) => {
    const [quizzes, setQuizzesState] = useState<QuizAPIResponse | null>(null);
    const [quizChoice, setQuizChoiceState] = useState<string | null>(null);

    // Load from localStorage
    useEffect(() => {
        const storedQuizzes = localStorage.getItem('quizzes');
        const storedChoice = localStorage.getItem('quizChoice');
        if (storedChoice && typeof storedChoice === 'string') {
            try{
                setQuizChoiceState(storedChoice);
            } catch (error) {
                console.error("Error parsing quizChoice from localStorage:", error);
            }
        }

        if (storedQuizzes) {
            try{
                setQuizzesState(JSON.parse(storedQuizzes));
            } catch (error) {
                console.error("Error parsing quizzes from localStorage:", error);
            }
        }
    }, []);

    // Save to localStorage when things change
    useEffect(() => {
        if (quizzes) {
            localStorage.setItem('quizzes', JSON.stringify(quizzes));
        }
        if (quizChoice) {
            localStorage.setItem('quizChoice', quizChoice);
        }
    }, [quizzes, quizChoice]);

    const setQuizzes = (newQuizzes: QuizAPIResponse) => {
        setQuizzesState(newQuizzes);
    };

    const setQuizChoice = (choice: string | null) => {
        setQuizChoiceState(choice);
    };

    const clearQuizzes = () => {
        setQuizzesState(null);
        localStorage.removeItem('quizzes');
    };
    
    const clearQuizChoice = () => {
        setQuizChoiceState(null);
        localStorage.removeItem('quizChoice');
    };

    return (
        <QuizContext.Provider value={{ quizzes, setQuizzes, clearQuizzes, quizChoice, setQuizChoice, clearQuizChoice }}>
            {children}
        </QuizContext.Provider>
    );
};

export const useQuizContext = () => {
    const context = useContext(QuizContext);
    if (!context) {
        throw new Error('useQuizContext must be used within a QuizProvider');
    }
    return context;
}