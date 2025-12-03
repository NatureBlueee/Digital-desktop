import React from 'react';
import { ChevronDown, Plus, Mic, AudioLines, Clock } from 'lucide-react';

const ChatGPTLogo = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 509.639" className={className} fill="currentColor">
    <path fillRule="nonzero" d="M412.037 221.764a90.834 90.834 0 004.648-28.67 90.79 90.79 0 00-12.443-45.87c-16.37-28.496-46.738-46.089-79.605-46.089-6.466 0-12.943.683-19.264 2.04a90.765 90.765 0 00-67.881-30.515h-.576c-.059.002-.149.002-.216.002-39.807 0-75.108 25.686-87.346 63.554-25.626 5.239-47.748 21.31-60.682 44.03a91.873 91.873 0 00-12.407 46.077 91.833 91.833 0 0023.694 61.553 90.802 90.802 0 00-4.649 28.67 90.804 90.804 0 0012.442 45.87c16.369 28.504 46.74 46.087 79.61 46.087a91.81 91.81 0 0019.253-2.04 90.783 90.783 0 0067.887 30.516h.576l.234-.001c39.829 0 75.119-25.686 87.357-63.588 25.626-5.242 47.748-21.312 60.682-44.033a91.718 91.718 0 0012.383-46.035 91.83 91.83 0 00-23.693-61.553l-.004-.005zM275.102 413.161h-.094a68.146 68.146 0 01-43.611-15.8 56.936 56.936 0 002.155-1.221l72.54-41.901a11.799 11.799 0 005.962-10.251V241.651l30.661 17.704c.326.163.55.479.596.84v84.693c-.042 37.653-30.554 68.198-68.21 68.273h.001zm-146.689-62.649a68.128 68.128 0 01-9.152-34.085c0-3.904.341-7.817 1.005-11.663.539.323 1.48.897 2.155 1.285l72.54 41.901a11.832 11.832 0 0011.918-.002l88.563-51.137v35.408a1.1 1.1 0 01-.438.94l-73.33 42.339a68.43 68.43 0 01-34.11 9.12 68.359 68.359 0 01-59.15-34.11l-.001.004zm-19.083-158.36a68.044 68.044 0 0135.538-29.934c0 .625-.036 1.731-.036 2.5v83.801l-.001.07a11.79 11.79 0 005.954 10.242l88.564 51.13-30.661 17.704a1.096 1.096 0 01-1.034.093l-73.337-42.375a68.36 68.36 0 01-34.095-59.143 68.412 68.412 0 019.112-34.085l-.004-.003zm251.907 58.621l-88.563-51.137 30.661-17.697a1.097 1.097 0 011.034-.094l73.337 42.339c21.109 12.195 34.132 34.746 34.132 59.132 0 28.604-17.849 54.199-44.686 64.078v-86.308c.004-.032.004-.065.004-.096 0-4.219-2.261-8.119-5.919-10.217zm30.518-45.93c-.539-.331-1.48-.898-2.155-1.286l-72.54-41.901a11.842 11.842 0 00-5.958-1.611c-2.092 0-4.15.558-5.957 1.611l-88.564 51.137v-35.408l-.001-.061a1.1 1.1 0 01.44-.88l73.33-42.303a68.301 68.301 0 0134.108-9.129c37.704 0 68.281 30.577 68.281 68.281a68.69 68.69 0 01-.984 11.545v.005zm-191.843 63.109l-30.668-17.704a1.09 1.09 0 01-.596-.84v-84.692c.016-37.685 30.593-68.236 68.281-68.236a68.332 68.332 0 0143.689 15.804 63.09 63.09 0 00-2.155 1.222l-72.54 41.9a11.794 11.794 0 00-5.961 10.248v.068l-.05 102.23zm16.655-35.91l39.445-22.782 39.444 22.767v45.55l-39.444 22.767-39.445-22.767v-45.535z"/>
  </svg>
);

export const ClaudeChat: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col h-full bg-white relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
         <div className="flex items-center gap-1 text-gray-500 text-lg font-medium cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-lg transition-colors">
            <span className="text-gray-800">ChatGPT</span>
            <span className="text-gray-500">5.1 Thinking</span>
            <ChevronDown size={16} className="text-gray-400" />
         </div>
         <div className="flex items-center gap-4">
            {/* Right side icons if needed */}
         </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full px-4 pb-20">
        {/* Greeting / Logo */}
        <div className="flex flex-col items-center gap-6 mb-10">
          {/* Replaced ClaudeLogo with ChatGPTLogo */}
          <div className="w-16 h-16 text-gray-800">
            <ChatGPTLogo className="w-full h-full" />
          </div>
          <h1 className="text-3xl font-medium text-gray-800">有什么可以帮忙的？</h1>
        </div>

        {/* Input Area */}
        <div className="w-full max-w-2xl relative">
          <div className="bg-[#f4f4f4] rounded-[2rem] px-4 py-3 flex flex-col gap-2 min-h-[52px]">
            <input
              type="text"
              placeholder="询问任何问题"
              className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 text-base px-2"
            />
            
            <div className="flex items-center justify-between mt-1 px-1">
              <div className="flex items-center gap-3">
                <button className="text-gray-500 hover:text-gray-700 transition-colors">
                  <Plus size={20} />
                </button>
                <button className="flex items-center gap-1 text-blue-500 text-sm font-medium hover:bg-blue-50 px-2 py-0.5 rounded-full transition-colors">
                   <Clock size={14} />
                   <span>思考</span>
                   <ChevronDown size={12} />
                </button>
              </div>
              <div className="flex items-center gap-3">
                 <button className="text-gray-500 hover:text-gray-700 transition-colors">
                    <Mic size={20} />
                 </button>
                 <button className="w-8 h-8 bg-[#6941C6] rounded-full flex items-center justify-center text-white hover:opacity-90 transition-opacity">
                    <AudioLines size={16} />
                 </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
