const { GoogleGenerativeAI } = require("@google/generative-ai");
const { spawn } = require('child_process');
const path = require('path');
const { LOCAL_MODELS } = require('../utils/constants');

const analyzeCode = async (code, modelName) => {
  const llmOpMode = process.env.LLM_OP_MODE || 'cloud'; // 'cloud' or 'local'

  if (llmOpMode.toLowerCase() === 'local') {
      // Find model path from constants
      const modelConfig = LOCAL_MODELS.find(m => m.name === modelName) || LOCAL_MODELS[0];
      return await analyzeWithLocalLLM(code, modelConfig.path);
  } else {
      return await analyzeWithGemini(code, modelName || process.env.GEMINI_MODEL);
  }
};

const analyzeWithLocalLLM = (code, modelPath) => {
    return new Promise((resolve, reject) => {
        const scriptPath = path.join(__dirname, '../../scripts/run_llm.py');
        const pythonProcess = spawn('python', [scriptPath, modelPath]); // Pass model path arg

        let result = '';
        let errorOutput = '';

        // Initialize Prompt
        const prompt = `
      You are VeriCode, an intelligent code analysis assistant.
      
      USER INPUT:
      ${code}
      
      INSTRUCTIONS:
       1. **Analyze the Input**: Determine if the input is a conversational message (e.g., "Hi", "Hello", "How are you", "Explain this") or a reusable code snippet.
      
      2. **IF CONVERSATIONAL / NOT CODE**:
         - Respond naturally, concisely, and helpfully.
         - Do NOT generate a "Report".
      
      3. **IF CODE SNIPPET**:
         - Generate a structured, clean **VeriCode Analysis Report** in Markdown.
         - **Format**:
           - **Header**: Start immediately with a H2 header identifying the quality: \`## 🟢 Code Quality: Good\` (or valid emoji/rating).
           - **Summary**: One line summary of what the code does.
           - **Input**: Show the user's code in a code block under \`### 📝 Source Code\`.
           - **Analysis**: Use these clear sections:
             - \`### ⚠️ Issues & Smells\` (Bulleted list, be concise)
             - \`### 🛠️ Refactoring\` (Provide the fixed code block)
             - \`### 💡 Best Practices\` (Bulleted list)
         - **Style**:
           - Use emojis for visual hierarchy.
           - Keep text concise and readable.
    `;

        // Send code to script via stdin
        pythonProcess.stdin.write(prompt);
        pythonProcess.stdin.end();

        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
             errorOutput += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                console.error(`Local LLM process exited with code ${code}`);
                console.error(`Error Output: ${errorOutput}`);
                reject(new Error(`Local LLM failed: ${errorOutput}`));
            } else {
                resolve(result);
            }
        });
        
         pythonProcess.on('error', (err) => {
            reject(new Error(`Failed to spawn python process: ${err.message}`));
        });
    });
};

const analyzeWithGemini = async (code, modelName) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is missing in environment variables");
    }

    if (!modelName) {
        throw new Error("Model name is required");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: modelName });

    const prompt = `
      You are VeriCode, an intelligent code analysis assistant.
      
      USER INPUT:
      ${code}
      
      INSTRUCTIONS:
      1. **Analyze the Input**: Determine if the input is a conversational message (e.g., "Hi", "Hello", "How are you", "Explain this") or a reusable code snippet.
      
      2. **IF CONVERSATIONAL / NOT CODE**:
         - Respond naturally, concisely, and helpfully.
         - Do NOT generate a "Report".
         - Do NOT analyze the string "Hello" as code.
      
      3. **IF CODE SNIPPET**:
         - Generate a structured, clean **VeriCode Analysis Report** in Markdown.
         - **Format**:
           - **Header**: Start immediately with a H2 header identifying the quality: \`## 🟢 Code Quality: Good\` (or valid emoji/rating).
           - **Summary**: One line summary of what the code does.
           - **Input**: Show the user's code in a code block under \`### 📝 Source Code\`.
           - **Analysis**: Use these clear sections:
             - \`### ⚠️ Issues & Smells\` (Bulleted list, be concise)
             - \`### 🛠️ Refactoring\` (Provide the fixed code block)
             - \`### 💡 Best Practices\` (Bulleted list)
         - **Style**:
           - Use emojis for visual hierarchy.
           - Keep text concise and readable.
           - Do not be overly verbose.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error("Gemini API Error:", error.message, error); // Log detailed error
    throw new Error(`Failed to analyze code: ${error.message}`);
  }
};

const testConnection = async () => {
  const llmOpMode = process.env.LLM_OP_MODE || 'cloud';

  if (llmOpMode.toLowerCase() === 'local') {
      return new Promise((resolve) => {
          // Use first local model for testing connection
          const modelConfig = LOCAL_MODELS[0];
          const modelPath = modelConfig?.path; 
          const modelName = modelConfig?.displayName || "Unknown Model";

          const scriptPath = path.join(__dirname, '../../scripts/run_llm.py');
          const pythonProcess = spawn('python', [scriptPath, modelPath]);
          
          let output = '';

          pythonProcess.stdin.write("SYSTEM_CHECK");
          pythonProcess.stdin.end();

          pythonProcess.stdout.on('data', (data) => {
              output += data.toString();
          });

          pythonProcess.on('close', (code) => {
              if (code === 0) {
                  const configuredDevice = process.env.LLM_MODE || 'CPU';
                  console.log(`✅ Local (${modelName}) module loaded`);
                  console.log(`✅ Configured Device: ${configuredDevice}`);
                  
                  // Parse output for CPU/GPU info
                  const lines = output.split('\n');
                  lines.forEach(line => {
                      if (configuredDevice === 'CPU' && line.startsWith('CPU:')) {
                           console.log(`   🔸 Detected ${line.trim()}`);
                      } else if (configuredDevice === 'GPU' && line.startsWith('GPU:')) {
                           console.log(`   🔸 Detected ${line.trim()}`);
                      }
                  });
                  resolve(true);
              } else {
                  console.error("❌ Local LLM Connection Failed: Script exited with error");
                  resolve(false);
              }
          });

          pythonProcess.on('error', (err) => {
                console.error("❌ Local LLM Connection Failed:", err.message);
                resolve(false);
          });
      });
  }


    // Cloud Mode Checking
    try {
        if (!process.env.GEMINI_API_KEY) {
            console.error("❌ Gemini Connection Failed: API Key missing");
            return false;
        }

        let testModelName = process.env.GEMINI_MODEL;
        
        if (!testModelName) {
             // Dynamically find a model to test with if not specified in env
             const models = await getAvailableModels();
             if (models.length === 0) {
                 console.error("❌ Gemini Connection Failed: No available models found for this API key.");
                 return false;
             }
             testModelName = models[0].name;
        }

        console.log(`Checking connection using model: ${testModelName}...`);

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: testModelName });

        // Verify by generating a token response (minimal)
        await model.generateContent("Test connection"); 
        console.log("✅ Successfully connected to Gemini API");
        return true;
    } catch (error) {
        if (error.status === 429) {
             console.error(`❌ Gemini Quota Exceeded for model ${process.env.GEMINI_MODEL || 'auto-selected'}.`);
        } else if (error.message.includes("fetch failed")) {
             console.error("❌ Gemini Connection Failed: Network error (Check internet connection or firewall/proxy).");
        } else {
             console.error("❌ Gemini Connection Failed:", error.message);
        }
        return false;
    }
};

const getAvailableModels = async () => {
    // Return static models from constants to ensure consistency
    // This is mainly used for server start-up checks
    const { GEMINI_MODELS } = require('../utils/constants');
    return GEMINI_MODELS;
};

module.exports = {
  analyzeCode,
  testConnection,
  getAvailableModels
};
