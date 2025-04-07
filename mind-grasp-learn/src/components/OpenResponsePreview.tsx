"use client"
interface PreviewProps {
    onClose: () => void;
}

const OpenResponsePreview: React.FC<PreviewProps> = ({onClose}) => (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-xl font-bold text-[#0077b6] mb-4">Open Response Example</h3>
        <div className="space-y-4">
            <div>
                <p className="font-medium mb-2">Explain how climate change affects biodiversity.</p>
                <textarea 
                    className="w-full h-32 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0077b6]"
                    placeholder="Type your answer here..."
                ></textarea>
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

export default OpenResponsePreview;