import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Plus,
  History,
  Settings,
  LogOut,
  X,
  User as UserIcon,
  ChevronUp,
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  MessageSquare,
  AlertTriangle
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { getImageUrl } from "../../../utils/imageUtils";

function DeleteConfirmationModal({ isOpen, onClose, onConfirm, chatTitle }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-fade-in-up">
                <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4 text-red-500">
                        <AlertTriangle size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Delete Chat?</h3>
                    <p className="text-gray-400 text-sm mb-6">
                        Are you sure you want to delete <span className="text-white font-medium">"{chatTitle}"</span>? This action cannot be undone.
                    </p>
                    <div className="flex gap-3 w-full">
                        <button 
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={onConfirm}
                            className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors font-medium shadow-lg shadow-red-500/20"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ChatSidebar({ isOpen, onToggle, onNewChat, refreshTrigger }) {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [chats, setChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [editingChatId, setEditingChatId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  
  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);

  // Styling for dropdown positioning (Global Fixed Context Menu)
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [activeMenuChat, setActiveMenuChat] = useState(null);

  const menuRef = useRef(null);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const { id: activeChatId } = useParams();

  const commonTransition = "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]";

  useEffect(() => {
    fetchChats();
  }, [refreshTrigger]);

  const fetchChats = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/chats', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            const data = await response.json();
            setChats(data);
        }
    } catch (error) {
        console.error("Failed to fetch chats", error);
    }
  };

  const confirmDelete = (e, chat) => {
    e.stopPropagation();
    setChatToDelete(chat);
    setDeleteModalOpen(true);
    setActiveMenuChat(null); // Close menu
  };

  const handleDeleteChat = async () => {
    if (!chatToDelete) return;
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/chats/${chatToDelete._id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            setChats(chats.filter(c => c._id !== chatToDelete._id));
            if (activeChatId === chatToDelete._id) {
                navigate('/chat');
                onNewChat();
            }
        }
    } catch (error) {
        console.error("Failed to delete chat", error);
    }
    setDeleteModalOpen(false);
    setChatToDelete(null);
  };

  const triggerMenu = (e, chat) => {
      e.stopPropagation();
      if (activeMenuChat?._id === chat._id) {
          setActiveMenuChat(null);
      } else {
          // Calculate position
          const rect = e.currentTarget.getBoundingClientRect();
          setMenuPosition({
              top: rect.bottom + 5,
              left: rect.right - 128 // Width of menu is roughly 128px (w-32)
          });
          setActiveMenuChat(chat);
      }
  };

  const startRenaming = (e, chat) => {
    e.stopPropagation();
    setEditingChatId(chat._id);
    setEditTitle(chat.title);
    setActiveMenuChat(null);
  };

  const saveRename = async () => {
      if (!editTitle.trim()) {
          setEditingChatId(null);
          return;
      }
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/chats/${editingChatId}`, {
            method: 'PUT',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: editTitle })
        });

        if (response.ok) {
            setChats(chats.map(c => c._id === editingChatId ? { ...c, title: editTitle } : c));
        }
    } catch (error) {
        console.error("Failed to rename chat", error);
    }
    setEditingChatId(null);
  };

  const handleRenameKey = (e) => {
    if (e.key === 'Enter') {
        saveRename();
    } else if (e.key === 'Escape') {
        setEditingChatId(null);
    }
  };

  const getInitials = (user) => {
    if (user?.firstName && user?.lastName) {
        return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    if (user?.username) {
        return user.username.substring(0, 2).toUpperCase();
    }
    if (user?.email) {
        return user.email.substring(0, 2).toUpperCase();
    }
    return "??";
  };

  const displayName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user?.username || user?.email || "User";

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // User Menu
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      // Context Menu - Close if clicking outside the menu AND outside the trigger
      if (activeMenuChat && 
          !event.target.closest('.chat-options-menu') && 
          !event.target.closest('.chat-options-trigger')) {
         setActiveMenuChat(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", () => setActiveMenuChat(null), true); // Close on scroll
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", () => setActiveMenuChat(null), true);
    };
  }, [activeMenuChat]);

  const filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <DeleteConfirmationModal 
        isOpen={deleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteChat}
        chatTitle={chatToDelete?.title || "this chat"}
      />

      {/* Global Fixed Context Menu */}
      {activeMenuChat && (
          <div 
             className="fixed z-[100] w-32 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl overflow-hidden chat-options-menu animate-in fade-in zoom-in-95 duration-100"
             style={{ 
                 top: menuPosition.top, 
                 left: menuPosition.left 
             }}
          >
                <div className="p-1">
                    <button 
                    onClick={(e) => startRenaming(e, activeMenuChat)}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-gray-300 hover:bg-white/5 hover:text-white text-left rounded-md transition-colors"
                >
                    <Edit2 size={12} /> <span>Rename</span>
                </button>
                <button 
                    onClick={(e) => confirmDelete(e, activeMenuChat)}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 text-left rounded-md transition-colors"
                >
                    <Trash2 size={12} /> <span>Delete</span>
                </button>
               </div>
          </div>
      )}

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`
          lg:${isOpen ? "w-80" : "w-20"} 
          fixed lg:relative 
          left-0 top-0 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0
          w-80 lg:w-auto
          bg-[#0a0a0a] border-r border-white/10
          ${commonTransition}
          flex flex-col h-screen overflow-hidden 
          z-50 lg:z-auto
          backdrop-blur-xl bg-opacity-95 text-white
        `}
      >
        <div className="flex flex-col h-full w-full">
          {/* Header */}
          <div className={`
            flex 
            ${isOpen ? "flex-row justify-between px-6 items-center" : "flex-col items-center justify-center gap-4"} 
            py-6 border-b border-white/5 
            ${commonTransition}
          `}>
             {/* Logo Section */}
            <div className={`flex items-center ${!isOpen && "justify-center"}`}>
              <Link to="/" className="flex items-center group">
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-500 group-hover:opacity-80 transition-opacity font-mono shrink-0">
                  &lt;/&gt;
                </span>
                <span 
                   className={`
                     ml-2 text-xl font-bold text-white 
                     ${commonTransition} origin-left
                     whitespace-nowrap overflow-hidden
                     ${!isOpen ? "max-w-0 opacity-0 scale-95 ml-0" : "max-w-[200px] opacity-100 scale-100"}
                   `}
                >
                  VeriCode
                </span>
              </Link>
            </div>
            
            {/* Mobile Close Button (lg:hidden) */}
            <div className={`lg:hidden ${!isOpen && "hidden"}`}>
                <button
                  onClick={onToggle}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
            </div>
          </div>

          {/* New Chat Button */}
          <div className={`p-4 ${commonTransition} ${!isOpen ? "flex justify-center" : ""}`}>
            <button 
                onClick={() => {
                    navigate('/chat');
                    onNewChat();
                }}
                className={`
                    flex items-center justify-center space-x-2 
                    bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 
                    text-white rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 font-medium shrink-0 overflow-hidden
                    ${commonTransition}
                    ${isOpen ? "w-full px-4 py-3" : "w-10 h-10 p-0 rounded-full"}
                `}
            >
              <Plus size={20} className="shrink-0" />
              <span 
                className={`
                    ${commonTransition}
                    whitespace-nowrap overflow-hidden
                    ${!isOpen ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100"}
                `}
              >
                  New Analysis
              </span>
            </button>
          </div>

          {/* Search Bar */}
          <div className={`px-4 pb-2 ${!isOpen ? "hidden" : "block"}`}>
             <div className="relative">
                 <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                 <input 
                    type="text" 
                    placeholder="Search chats..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm text-gray-300 focus:outline-none focus:border-emerald-500/50"
                 />
             </div>
          </div>

          {/* Chat History */}
          <div className="px-4 flex-1 flex flex-col overflow-hidden">
            <div className={`flex items-center space-x-2 mb-2 pl-2 ${!isOpen && "justify-center pl-0"} ${commonTransition} min-h-[20px] overflow-hidden`}>
              <History size={14} className="text-gray-500 shrink-0" />
              <h3 
                className={`
                    text-xs font-semibold text-gray-500 uppercase tracking-wider 
                    ${commonTransition}
                    whitespace-nowrap overflow-hidden
                    ${!isOpen ? "max-w-0 opacity-0 ml-0" : "max-w-[200px] opacity-100 ml-2"}
                `}
              >
                Recent
              </h3>
            </div>
            <div className={`space-y-1 overflow-y-auto flex-1 custom-scrollbar ${!isOpen && "hidden"}`}>
               {filteredChats.length === 0 ? (
                   <div className="text-center py-8 text-gray-600 text-sm">
                      {searchTerm ? "No matches found" : "No recent chats"}
                   </div>
               ) : (
                   filteredChats.map(chat => (
                       <div 
                         key={chat._id}
                         className={`group relative flex items-center p-2 rounded-lg cursor-pointer transition-colors ${
                              activeChatId === chat._id ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
                         }`}
                         onClick={() => navigate(`/chat/${chat._id}`)}
                       >
                           <MessageSquare size={16} className="shrink-0 mr-3" />
                           
                           {editingChatId === chat._id ? (
                               <div className="flex-1 flex items-center mr-2">
                                   <input 
                                      autoFocus
                                      type="text" 
                                      value={editTitle}
                                      onChange={(e) => setEditTitle(e.target.value)}
                                      onKeyDown={handleRenameKey}
                                      onBlur={saveRename}
                                      onClick={(e) => e.stopPropagation()}
                                      className="bg-transparent border-b border-emerald-500 focus:outline-none text-sm w-full py-0.5 text-white"
                                   />
                               </div>
                           ) : (
                               <span className="truncate text-sm flex-1 pr-6">{chat.title}</span>
                           )}

                           {/* Options Trigger */}
                           <button 
                               className={`absolute right-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded chat-options-trigger ${activeMenuChat?._id === chat._id ? 'opacity-100 bg-white/10' : ''}`}
                               onClick={(e) => triggerMenu(e, chat)}
                           >
                               <MoreVertical size={14} />
                           </button>
                       </div>
                   ))
               )}
            </div>
          </div>

          {/* Footer Profile */}
          <div className="border-t border-white/5 p-4 relative" ref={menuRef}>
             {/* User Menu Popup */}
             {showUserMenu && isOpen && (
                <div className="absolute bottom-full left-4 right-4 mb-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl overflow-hidden animate-fade-in-up z-50">
                    <div className="p-1">
                        <button 
                            onClick={() => navigate('/settings')}
                            className="w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg hover:bg-white/5 text-sm text-gray-300 hover:text-white transition-colors text-left"
                        >
                            <Settings size={16} className="text-gray-400" />
                            <span>Settings</span>
                        </button>
                        <div className="h-px bg-white/5 my-1" />
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg hover:bg-red-500/10 text-sm text-red-400 hover:text-red-300 transition-colors text-left"
                        >
                            <LogOut size={16} />
                            <span>Log out</span>
                        </button>
                    </div>
                </div>
             )}

             <button 
                onClick={() => isOpen && setShowUserMenu(!showUserMenu)}
                className={`
                    flex items-center space-x-3 p-2 rounded-xl hover:bg-white/5 transition-colors group text-left shrink-0 overflow-hidden w-full
                    ${commonTransition}
                    ${isOpen ? "cursor-pointer" : "cursor-default justify-center"}
             `}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-emerald-900/20 overflow-hidden border border-white/10 bg-emerald-600 text-white font-bold">
                    {user?.profileImage ? (
                        <img 
                          src={getImageUrl(user.profileImage)}
                          alt={displayName} 
                          className="w-full h-full object-cover"
                        />
                    ) : (
                        <span>{getInitials(user)}</span>
                    )}
                </div>
                <div className={`flex-1 min-w-0 overflow-hidden ${commonTransition} ${!isOpen ? "max-w-0 opacity-0 ml-0" : "max-w-[170px] opacity-100 ml-0"}`}>
                    <div className="text-sm font-semibold text-white truncate group-hover:text-emerald-100 transition-colors" title={displayName}>
                        {displayName}
                    </div>
                    <div className="text-xs text-gray-400 truncate group-hover:text-gray-300 transition-colors" title={user?.email}>
                        {user?.email}
                    </div>
                </div>
                <div className={`text-gray-500 group-hover:text-white transition-colors shrink-0 ${commonTransition} ${!isOpen ? "max-w-0 opacity-0" : "max-w-[20px] opacity-100"}`}>
                     {showUserMenu ? <ChevronUp size={16} /> : null}
                </div>
             </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatSidebar;
