const path = require('path');

const GEMINI_MODELS = [
    {
        name: "gemini-pro",
        displayName: "Gemini Pro",
        type: "cloud"
    },
    {
        name: "gemini-2.0-flash",
        displayName: "Gemini 2.0 Flash",
        type: "cloud"
    },
    {
        name: "gemini-1.5-flash",
        displayName: "Gemini 1.5 Flash",
        type: "cloud"
    }
];

const LOCAL_MODELS = [
    {
        name: "phi-3-mini",
        displayName: "Local (Phi-3 Mini)",
        type: "local",
        path: path.join(__dirname, '../../llmModel/Phi-3-mini-4k-instruct.Q4_0.gguf')
    }
];

module.exports = {
    GEMINI_MODELS,
    LOCAL_MODELS,
    ALL_MODELS: [...GEMINI_MODELS, ...LOCAL_MODELS]
};
