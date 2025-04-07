"use client"
interface PreviewProps {
    onClose: () => void;
}


const MatchingGamePreview: React.FC<PreviewProps>= ({ onClose }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-xl font-bold text-[#0077b6] mb-4">Matching Game Example</h3>
        <div className="flex flex-col space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-4">
                    <div className="bg-[#e6f3ff] p-3 rounded-md border border-[#b3d7ff]">
                        <p className="font-medium">Photosynthesis</p>
                    </div>
                    <div className="bg-[#e6f3ff] p-3 rounded-md border border-[#b3d7ff]">
                        <p className="font-medium">Mitosis</p>
                    </div>
                    <div className="bg-[#e6f3ff] p-3 rounded-md border border-[#b3d7ff]">
                        <p className="font-medium">Osmosis</p>
                    </div>
                </div>
                
                <div className="flex flex-col space-y-4">
                    <div className="bg-[#f0f8e6] p-3 rounded-md border border-[#c5e0b4]">
                        <p className="font-medium">Cell division process</p>
                    </div>
                    <div className="bg-[#f0f8e6] p-3 rounded-md border border-[#c5e0b4]">
                        <p className="font-medium">Movement of water molecules</p>
                    </div>
                    <div className="bg-[#f0f8e6] p-3 rounded-md border border-[#c5e0b4]">
                        <p className="font-medium">Converts light to energy</p>
                    </div>
                </div>
            </div>
            
            <div className="flex justify-center">
                <div className="flex flex-col items-center">
                    <p className="text-sm text-gray-500 mb-2">Draw lines to connect matching pairs</p>
                    <svg width="200" height="40" viewBox="0 0 200 40">
                        <path d="M10,10 C40,10 40,30 70,30" stroke="#0077b6" strokeWidth="2" fill="none"/>
                        <path d="M10,20 C40,20 40,10 70,10" stroke="#0077b6" strokeWidth="2" fill="none"/>
                        <path d="M10,30 C40,30 40,20 70,20" stroke="#0077b6" strokeWidth="2" fill="none"/>
                    </svg>
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

export default MatchingGamePreview;