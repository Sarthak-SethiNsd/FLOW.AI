import os
import json
import subprocess

# Paths
FFPROBE_BIN = r"C:\Users\LENOVO\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.2-full_build\bin\ffprobe.exe"
BASE_DIR = r"c:\Users\LENOVO\Desktop\Websites\Yoga-Project\public\asanas"

def get_video_duration(video_path):
    """Retrieve the exact duration of a video file using ffprobe."""
    cmd = [
        FFPROBE_BIN,
        "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        video_path
    ]
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        return float(result.stdout.strip())
    except Exception as e:
        print(f"Error reading duration for {video_path}: {e}")
        return None

def process_asanas():
    # Scan all directories in the asanas directory
    for folder_name in os.listdir(BASE_DIR):
        folder_path = os.path.join(BASE_DIR, folder_name)
        if not os.path.isdir(folder_path):
            continue
        
        config_path = os.path.join(folder_path, "config.json")
        video_path = os.path.join(folder_path, "demo.mp4")
        
        if not os.path.isfile(config_path):
            continue
        
        if not os.path.isfile(video_path):
            print(f"[WARNING] No video file found for {folder_name} at {video_path}")
            continue
            
        duration = get_video_duration(video_path)
        if duration is None:
            print(f"[ERROR] Could not retrieve duration for {folder_name}")
            continue
            
        print(f"\nPose: {folder_name}")
        print(f"  Video Duration: {duration:.2f} seconds")
        
        # Load config
        with open(config_path, "r", encoding="utf-8") as f:
            config = json.load(f)
            
        steps = config.get("steps", [])
        num_steps = len(steps)
        if num_steps == 0:
            print(f"  [SKIP] No steps found in config.json")
            continue
            
        step_duration = duration / num_steps
        print(f"  Splitting {num_steps} steps of {step_duration:.2f} seconds each:")
        
        for idx, step in enumerate(steps):
            video_start = round(idx * step_duration, 2)
            video_end = round((idx + 1) * step_duration, 2)
            
            # Avoid out of bounds or negative rounding quirks
            if idx == num_steps - 1:
                video_end = round(duration, 2)
                
            step["video_start"] = video_start
            step["video_end"] = video_end
            print(f"    Step {step.get('step_number')}: {video_start}s to {video_end}s")
            
        # Update overall duration of the asana
        config["duration_seconds"] = round(duration, 2)
        
        # Write back config
        with open(config_path, "w", encoding="utf-8") as f:
            json.dump(config, f, indent=2, ensure_ascii=False)
            
        print(f"  [OK] Saved config.json")

if __name__ == "__main__":
    process_asanas()
