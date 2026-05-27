import React from 'react';

interface SuccessModalProps {
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-[#f7f4ef] border-2 border-[#1e201e] p-8 text-center max-w-md w-full indie-shadow-lg animate-slide-up relative">
        <div className="w-48 h-48 mx-auto mb-4 flex items-center justify-center bg-white border border-[#1e201e]/20 rounded-full overflow-hidden p-4">
          <svg className="w-24 h-24 text-indie-terracotta stroke-current transform rotate-6" fill="none" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        </div>
        
        <h2 className="font-serif-indie text-3xl font-bold text-[#1e201e] mb-3">
          Letter Sent
        </h2>
        <p className="font-serif-indie italic text-neutral-600 mb-6">
          Your message has been safely delivered to the She Can inbox.
        </p>
        
        <button
          onClick={onClose}
          className="w-full bg-[#1e201e] hover:bg-neutral-800 text-white font-mono-indie text-xs tracking-widest uppercase font-bold py-3.5 border-2 border-[#1e201e] transition-all duration-200 indie-shadow indie-shadow-active"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;