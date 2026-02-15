import sys
import os
from gpt4all import GPT4All

import platform
import subprocess
import io

# Force UTF-8 for stdin/stdout to avoid encoding errors on Windows
sys.stdin = io.TextIOWrapper(sys.stdin.buffer, encoding='utf-8')
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def get_cpu_name():
    try:
        return platform.processor()
    except:
        return "Unknown CPU"

def get_gpu_name():
    try:
        # Simple check for NVIDIA GPU on Windows/Linux
        output = subprocess.check_output("nvidia-smi --query-gpu=name --format=csv,noheader", shell=True)
        return output.decode('utf-8').strip()
    except:
        return "No NVIDIA GPU Detected (or nvidia-smi missing)"

def main():
    # Read prompt from stdin
    prompt = sys.stdin.read().strip()
    
    if not prompt:
        print("Error: No prompt provided")
        return

    # Special flag for connection/device check
    # Special flag for connection/device check
    if prompt == "SYSTEM_CHECK":
        cpu = get_cpu_name()
        gpu = get_gpu_name()
        print(f"CPU: {cpu}")
        print(f"GPU: {gpu}")
        return

    # Check for model path argument
    model_full_path = ""
    if len(sys.argv) > 1:
        model_full_path = sys.argv[1]

    # Fallback/Default (though service should always provide it)
    if not model_full_path or not os.path.exists(model_full_path):
         script_dir = os.path.dirname(os.path.abspath(__file__))
         default_path = os.path.join(os.path.dirname(script_dir), "llmModel", "Phi-3-mini-4k-instruct.Q4_0.gguf")
         if os.path.exists(default_path):
             model_full_path = default_path
         else:
             print(f"Error: Model not found at {model_full_path} or default location.")
             return

    model_dir = os.path.dirname(model_full_path)
    model_filename = os.path.basename(model_full_path)
    
    # Initialize GPT4All (Auto-select device or use env)
    requested_device = os.environ.get("LLM_MODE", "CPU")
    device = requested_device

    if requested_device.upper() == "GPU":
        available_gpus = GPT4All.list_gpus()
        if available_gpus:
            device = available_gpus[0]
            print(f"Auto-selected GPU: {device}", file=sys.stderr)
        else:
            print("Warning: No GPUs detected. Falling back to CPU.", file=sys.stderr)
            device = "cpu"
    
    try:
        model = GPT4All(model_filename, model_path=model_dir, allow_download=False, device=device)
    except Exception as e:
        print(f"Warning: Failed to initialize on device '{device}'. Error: {e}", file=sys.stderr)
        print("Falling back to CPU...", file=sys.stderr)
        try:
            model = GPT4All(model_filename, model_path=model_dir, allow_download=False, device="cpu")
        except Exception as e_cpu:
            print(f"Critical Error: Failed to initialize on CPU as well. {e_cpu}", file=sys.stderr)
            return
    
    # Generate response
    with model.chat_session():
        response = model.generate(prompt, max_tokens=1024)
        print(response)

if __name__ == "__main__":
    main()
