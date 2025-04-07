"use client"

import React from "react";

interface PreviewProps {
    onClose: () => void;
}

const MultipleChoicePreview: React.FC<PreviewProps> = ({onClose}) => (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-xl font-bold text-[#0077b6] mb-4">Multiple Choice Example</h3>
        <div className="mb-6">
            <p className="font-medium mb-3">What is the capital of France?</p>
            <div className="space-y-2">
                <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
                    <input type="radio" id="paris" name="capital" className="h-4 w-4 text-[#0077b6]" />
                    <label htmlFor="paris" className="cursor-pointer">Paris</label>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
                    <input type="radio" id="london" name="capital" className="h-4 w-4 text-[#0077b6]" />
                    <label htmlFor="london" className="cursor-pointer">London</label>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
                    <input type="radio" id="rome" name="capital" className="h-4 w-4 text-[#0077b6]" />
                    <label htmlFor="rome" className="cursor-pointer">Rome</label>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
                    <input type="radio" id="madrid" name="capital" className="h-4 w-4 text-[#0077b6]" />
                    <label htmlFor="madrid" className="cursor-pointer">Madrid</label>
                </div>
            </div>
        </div>
        <div className="mt-4 text-center">
            <button 
                onClick={onClose}
                className="px-4 py-2 bg-[#0077b6] text-white rounded-md hover:bg-[#005f92] transition-all duration-200"
            >
                Close Preview
            </button>
        </div>
    </div>
);

export default MultipleChoicePreview;