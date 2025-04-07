"use client"

import React from "react";

interface PreviewProps {
    onClose: () => void;
}

const FillInTheBlankPreview: React.FC<PreviewProps> = ({onClose}) => (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-xl font-bold text-[#0077b6] mb-4">Fill In The Blank Example</h3>
        <div className="space-y-6">
            <div className="p-3 border rounded-md bg-gray-50">
                <p className="mb-3">
                    Water is composed of hydrogen and <input type="text" className="border-b-2 border-[#0077b6] bg-transparent w-28 focus:outline-none px-1" placeholder="______" /> atoms.
                </p>
            </div>
            
            <div className="p-3 border rounded-md bg-gray-50">
                <p className="mb-3">
                    The process of plants making their own food using sunlight is called <input type="text" className="border-b-2 border-[#0077b6] bg-transparent w-32 focus:outline-none px-1" placeholder="______" />.
                </p>
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

export default FillInTheBlankPreview;