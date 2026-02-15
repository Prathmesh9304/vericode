import { useState, useRef, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Send, Code, Zap, FileText, Sparkles, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css";
import ChatSidebar from "./Components/ChatSidebar";
import ChatTopbar from "./Components/ChatTopbar";

function Chat() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("");
  const [availableModels, setAvailableModels] = useState([]);
  const [refreshSidebar, setRefreshSidebar] = useState(0); // Trigger for sidebar refresh
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Load models
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/models");
        const data = await response.json();
        if (data.models && data.models.length > 0) {
            setAvailableModels(data.models);
            setSelectedModel(data.models[0].name);
        }
      } catch (error) {
        console.error("Failed to fetch models:", error);
      }
    };
    fetchModels();
  }, []);

  // Load Chat History
  useEffect(() => {
    if (id) {
        fetchChatHistory(id);
    } else {
        setMessages([]); // Reset for new chat
    }
  }, [id]);

  const fetchChatHistory = async (chatId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/chats/${chatId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            const data = await response.json();
            // Transform messages to UI format
            const formattedMessages = data.messages.map(msg => ({
                type: msg.role === 'user' ? 'user' : 'model',
                content: msg.content
            }));
            setMessages(formattedMessages);
        } else {
            // Handle not found or unauthorized
            navigate('/chat');
        }
    } catch (error) {
        console.error("Failed to load chat", error);
        navigate('/chat');
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = { type: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:3000/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
            code: userMessage.content,
            model: selectedModel,
            chatId: id // Pass current chat ID if exists
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get analysis");
      }

      const data = await response.json();
      const aiMessage = { type: "model", content: data.content };
      setMessages((prev) => [...prev, aiMessage]);

      // If we created a new chat, update URL and Sidebar
      if (!id && data.chatId) {
          setRefreshSidebar(prev => prev + 1);
          navigate(`/chat/${data.chatId}`);
      }

    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "model",
          content: "Sorry, I encountered an error analyzing your code. Please check if the backend is running and try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    navigate('/chat');
    setMessages([]);
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else if (e.key === "Tab") {
      e.preventDefault();
      const { target } = e;
      const { selectionStart, selectionEnd, value } = target;
      const newValue =
        value.substring(0, selectionStart) +
        "    " +
        value.substring(selectionEnd);
      setMessage(newValue);
      setTimeout(() => {
        target.setSelectionRange(selectionStart + 4, selectionStart + 4);
      }, 0);
    }
  };

  return (
    <div className="h-screen bg-[#0a0a0a] text-white flex overflow-hidden font-sans selection:bg-emerald-500/30">
      {/* Sidebar */}
      <ChatSidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onNewChat={handleNewChat}
        refreshTrigger={refreshSidebar}
      />

      {/* Main Chat Area */}
      <div
        className={`flex-1 flex flex-col lg:${
          isSidebarOpen ? "ml-80" : "ml-20"
        } transition-all duration-300 h-screen relative`}
      >
        {/* Background Gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px]" />
        </div>

        {/* Header */}
        <ChatTopbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Messages Area */}
        <div className="relative z-10 flex-1 overflow-y-auto custom-scrollbar">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full px-4 py-6">
              <div className="text-center max-w-2xl w-full mx-auto animate-fade-in-up">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center justify-center mx-auto mb-6 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                  <Sparkles className="text-emerald-400" size={40} />
                </div>
                <h2 className="text-3xl font-bold mb-3 tracking-tight">
                  How can I help you <span className="text-emerald-400">build</span> today?
                </h2>
                <p className="text-gray-400 mb-10 text-lg">
                  I can analyze your code, explain complex logic, or help you refactor for performance.
                </p>
                <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto px-4">
                  {[
                      { icon: <Code size={20} />, title: "Analyze Code", desc: "Check for bugs & errors" },
                      { icon: <Zap size={20} />, title: "Refactor", desc: "Optimize performance" },
                      { icon: <FileText size={20} />, title: "Document", desc: "Generate comments" }
                  ].map((item, i) => (
                    <button key={i} className="flex flex-col items-start p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 hover:border-emerald-500/30 transition-all group text-left">
                        <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <span className="text-emerald-400">{item.icon}</span>
                        </div>
                        <div className="font-semibold text-white mb-1">{item.title}</div>
                        <div className="text-xs text-gray-500">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 p-6 max-w-5xl mx-auto pb-32">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-4xl px-6 py-4 rounded-2xl ${
                      msg.type === "user"
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20 rounded-br-none"
                        : "bg-white/5 border border-white/10 text-gray-100 rounded-bl-none w-full"
                    }`}
                  >
                    {msg.type === "user" ? (
                      <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed m-0 overflow-x-auto">
                        {msg.content}
                      </pre>
                    ) : (
                      <div className="prose prose-invert prose-emerald max-w-none text-sm leading-relaxed">
                        <ReactMarkdown
                          rehypePlugins={[rehypeHighlight]}
                          components={{
                            code: ({ node, inline, className, children, ...props }) => {
                              const match = /language-(\w+)/.exec(className || "");
                              return !inline && match ? (
                                <div className="rounded-lg overflow-hidden my-4 border border-white/10 bg-[#1e1e1e] shadow-lg">
                                  <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-white/5">
                                    <span className="text-xs font-mono text-gray-400">{match[1]}</span>
                                    <div className="flex space-x-1.5">
                                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50" />
                                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50" />
                                    </div>
                                  </div>
                                  <div className="p-4 overflow-x-auto">
                                    <code className={className} {...props}>
                                      {children}
                                    </code>
                                  </div>
                                </div>
                              ) : (
                                <code className={`${className} bg-white/10 rounded px-1.5 py-0.5 text-emerald-300 font-mono text-xs`} {...props}>
                                  {children}
                                </code>
                              );
                            },
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                   <div className="bg-white/5 border border-white/10 text-gray-100 rounded-2xl rounded-bl-none px-6 py-4 flex items-center space-x-3">
                      <Loader2 className="animate-spin text-emerald-400 opacity-80" size={20} />
                      <span className="text-gray-400 text-sm animate-pulse">Analyzing code...</span>
                   </div>
                </div>
              )}
               <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="relative z-10 bg-[#0a0a0a]/80 backdrop-blur-md border-t border-white/5 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-black/50 border border-white/10 rounded-xl flex items-end p-2 focus-within:border-emerald-500/50 focus-within:ring-0 focus-within:outline-none transition-colors">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Paste your code here to analyze..."
                        className="w-full bg-transparent border-none text-white placeholder-gray-500 focus:ring-0 focus:outline-none resize-none py-3 px-3 max-h-32 font-mono text-sm"
                        rows={1}
                        style={{ minHeight: '44px' }}
                        disabled={isLoading}
                    />
                    
                    {/* Model Selector */}
                    <div className="mb-1 mr-2 relative group-select">
                        <select
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            className="appearance-none bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/30 text-xs text-gray-400 hover:text-white rounded-lg px-3 py-1.5 pr-6 outline-none transition-all cursor-pointer font-medium max-w-[150px] truncate"
                            disabled={isLoading}
                        >
                            {availableModels.map((model) => (
                                <option key={model.name} value={model.name} className="bg-[#0a0a0a] text-white">
                                    {model.displayName}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                             <span className="text-[10px]">▼</span>
                        </div>
                    </div>

                    <button
                        onClick={handleSendMessage}
                        disabled={!message.trim() || isLoading}
                        className="p-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-800 disabled:text-gray-600 rounded-lg transition-colors text-white mb-1 mr-1 shadow-lg shadow-emerald-500/20"
                    >
                        {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    </button>
                </div>
            </div>
            <div className="flex items-center justify-center mt-3 text-xs text-gray-600">
               VeriCode can make mistakes. Consider checking important information.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
