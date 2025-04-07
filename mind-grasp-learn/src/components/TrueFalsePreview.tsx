"use client"
interface PreviewProps {
    onClose: () => void;
}

const TrueFalsePreview: React.FC<PreviewProps> = ({onClose}) => (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-xl font-bold text-[#0077b6] mb-4">True/False Example</h3>
        <div className="space-y-6">
            <div className="p-3 border-b">
                <p className="font-medium mb-3">The Earth revolves around the Sun.</p>
                <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                        <input type="radio" id="q1-true" name="q1" className="h-4 w-4 text-[#0077b6]" />
                        <label htmlFor="q1-true" className="cursor-pointer">True</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input type="radio" id="q1-false" name="q1" className="h-4 w-4 text-[#0077b6]" />
                        <label htmlFor="q1-false" className="cursor-pointer">False</label>
                    </div>
                </div>
            </div>
            
            <div className="p-3 border-b">
                <p className="font-medium mb-3">Humans can breathe underwater naturally.</p>
                <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                        <input type="radio" id="q2-true" name="q2" className="h-4 w-4 text-[#0077b6]" />
                        <label htmlFor="q2-true" className="cursor-pointer">True</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input type="radio" id="q2-false" name="q2" className="h-4 w-4 text-[#0077b6]" />
                        <label htmlFor="q2-false" className="cursor-pointer">False</label>
                    </div>
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

export default TrueFalsePreview;