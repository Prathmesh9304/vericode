const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

// All chat routes should be protected
router.post('/analyze', protect, chatController.analyze);
router.get('/chats', protect, chatController.getChats);
router.get('/chats/:id', protect, chatController.getChat);
router.put('/chats/:id', protect, chatController.renameChat);
router.delete('/chats/:id', protect, chatController.deleteChat);

module.exports = router;
