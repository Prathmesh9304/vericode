const llmService = require('../services/llmService');
const Chat = require('../models/Chat');

const analyze = async (req, res) => {
  try {
    const { code, model, chatId } = req.body;
    const userId = req.user.id; // From authMiddleware

    console.log("---------------------------------------------------");
    console.log("Received Analyze Request");
    console.log("Model:", model);
    console.log("Code Snippet Length:", code ? code.length : "undefined");
    console.log("Chat ID:", chatId || "New Chat");
    console.log("---------------------------------------------------");

    if (!code) {
      return res.status(400).json({ error: "Code snippet is required" });
    }

    let chat;
    if (chatId) {
        chat = await Chat.findOne({ _id: chatId, userId });
        if (!chat) return res.status(404).json({ error: "Chat not found" });
    } else {
        // Create new chat
        chat = new Chat({ 
            userId, 
            messages: [],
            title: code.substring(0, 30) + (code.length > 30 ? "..." : "") // Default title
        });
    }

    // Add user message to history (in memory first)
    chat.messages.push({ role: 'user', content: code });

    // Get analysis
    const analysis = await llmService.analyzeCode(code, model);
    
    // Add model response
    chat.messages.push({ role: 'model', content: analysis });

    // Save to DB
    await chat.save();

    res.json({ 
      role: 'model',
      content: analysis,
      chatId: chat._id,
      title: chat.title
    });
  } catch (error) {
    console.error("Analysis Error:", error);
    res.status(500).json({ error: "Internal server error analyzing code" });
  }
};

const getChats = async (req, res) => {
    try {
        const chats = await Chat.find({ userId: req.user.id })
            .select('title updatedAt createdAt')
            .sort({ updatedAt: -1 });
        res.json(chats);
    } catch (error) {
        console.error("Get Chats Error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

const getChat = async (req, res) => {
    try {
        const chat = await Chat.findOne({ _id: req.params.id, userId: req.user.id });
        if (!chat) return res.status(404).json({ error: "Chat not found" });
        res.json(chat);
    } catch (error) {
        console.error("Get Chat Error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

const renameChat = async (req, res) => {
    try {
        const { title } = req.body;
        const chat = await Chat.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { title },
            { new: true }
        );
        if (!chat) return res.status(404).json({ error: "Chat not found" });
        res.json(chat);
    } catch (error) {
        console.error("Rename Chat Error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

const deleteChat = async (req, res) => {
    try {
        const chat = await Chat.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!chat) return res.status(404).json({ error: "Chat not found" });
        res.json({ message: "Chat deleted" });
    } catch (error) {
        console.error("Delete Chat Error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = {
  analyze,
  getChats,
  getChat,
  renameChat,
  deleteChat
};
