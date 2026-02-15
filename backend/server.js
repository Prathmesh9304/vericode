require('dotenv').config();
console.log("-----------------------------------");
console.log("Vericode Backend Starting...");
console.log("-----------------------------------");
const express = require('express');
const cors = require('cors');
const chatRoutes = require('./src/routes/chatRoutes');

const mongoose = require('mongoose');
const authRoutes = require('./src/routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Database Connection
const dbMode = process.env.DB_MODE || 'local';
const dbName = process.env.DB_NAME || 'vericode';
const mongoURI = dbMode === 'cloud' ? process.env.MONGODB_URI_CLOUD : process.env.MONGODB_URI_LOCAL;

console.log(`Using Database Mode: ${dbMode}`);
console.log(`Using Database Name: ${dbName}`);

mongoose.connect(mongoURI, { 
    dbName: dbName,
    serverSelectionTimeoutMS: 5000 // Fail after 5 seconds if no connection
  })
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => {
      console.error('❌ MongoDB Connection Error:', err.message);
      console.error('   (Ensure your IP is whitelisted in MongoDB Atlas or check internet connection)');
  });

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', chatRoutes);
const path = require('path');
if (process.env.IMG_UPLOAD === 'local') {
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
    console.log("Serving static files from:", path.join(__dirname, 'uploads'));
} else {
    console.log("Static uploads disabled (IMG_UPLOAD is not 'local')");
}

const { GEMINI_MODELS, LOCAL_MODELS, ALL_MODELS } = require('./src/utils/constants');

app.get('/api/models', (req, res) => {
    // Filter models based on LLM_OP_MODE
    const opMode = process.env.LLM_OP_MODE || 'cloud';
    
    let availableModels = [];
    if (opMode === 'cloud') {
        availableModels = GEMINI_MODELS;
    } else if (opMode === 'local') {
        availableModels = LOCAL_MODELS;
    } else {
        availableModels = ALL_MODELS;
    }

    res.json({ models: availableModels });
});

app.get('/', (req, res) => {
  res.send('Vericode Backend is running');
});

// DEBUG: Test route to serve a file manually
app.get('/test-image', (req, res) => {
    const fs = require('fs');
    const path = require('path');
    const uploadDir = path.join(__dirname, 'uploads');
    
    // List files in uploads
    fs.readdir(uploadDir, (err, files) => {
        if (err) return res.status(500).send("Could not list uploads: " + err.message);
        if (files.length === 0) return res.status(404).send("No files in uploads folder");
        
        // Serve the first file found
        const firstFile = files[0];
        res.sendFile(path.join(uploadDir, firstFile));
    });
});

const llmService = require('./src/services/llmService');

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("-----------------------------------");
  console.log("Checking LLM Connection...");
  
  const llmOpMode = process.env.LLM_OP_MODE || 'cloud';
  const isConnected = await llmService.testConnection(); // This now handles logging for local mode too

  if (isConnected && llmOpMode === 'cloud') {
    const models = await llmService.getAvailableModels();
    console.log("Available Models:", models.map(m => m.name).join(", "));
  }
  console.log("-----------------------------------");
});
