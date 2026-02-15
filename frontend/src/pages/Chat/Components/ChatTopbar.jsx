import { Link } from "react-router-dom";
import { Code, PanelLeft } from "lucide-react"; // Import PanelLeft

const ChatTopbar = ({ onToggleSidebar }) => {
  return (
    <div className="relative z-10 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {/* Sidebar Toggle Button (Desktop & Mobile) */}
        <button
           onClick={onToggleSidebar}
           className="p-2 -ml-2 mr-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
           title="Toggle Sidebar"
        >
            <PanelLeft size={20} />
        </button>


        <div className="h-4 w-px bg-white/10"></div>
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-emerald-500 to-blue-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Code className="text-white" size={14} />
          </div>
          <span className="font-semibold text-sm bg-clip-text text-transparent bg-gradient-to-r from-emerald-100 to-white">
            VeriCode Assistant
          </span>
          <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase tracking-wide">
            Beta
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatTopbar;
