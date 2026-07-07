import subprocess
import os
import sys

# Force UTF-8 output (fixes Windows cp1252 encoding errors)
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# Exact confirmed paths on this machine
FFMPEG_BIN = r"C:\Users\LENOVO\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.2-full_build\bin\ffmpeg.exe"
BASE_DIR   = r"c:\Users\LENOVO\Desktop\Websites\Yoga-Project\public\asanas"

# Add ffmpeg bin to PATH so yt-dlp can use it if needed
os.environ["PATH"] = (
    r"C:\Users\LENOVO\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.2-full_build\bin"
    + ";" + os.environ.get("PATH", "")
)

# Each pose with a focused search query
poses = [
    { "folder": "tadasana",             "query": "tadasana mountain pose yoga demonstration" },
    { "folder": "surya-namaskar",       "query": "surya namaskar steps yoga demonstration" },
    { "folder": "vrikshasana",          "query": "vrikshasana tree pose yoga demonstration" },
    { "folder": "adho-mukha-svanasana", "query": "downward dog yoga pose demonstration" },
    { "folder": "virabhadrasana-ii",    "query": "warrior 2 yoga pose demonstration" },
    { "folder": "balasana",             "query": "balasana childs pose yoga demonstration" },
    { "folder": "bhujangasana",         "query": "cobra pose bhujangasana yoga demonstration" },
    { "folder": "trikonasana",          "query": "triangle pose yoga demonstration" },
    { "folder": "utkatasana",           "query": "chair pose yoga utkatasana demonstration" },
    { "folder": "cat-cow-flow",         "query": "cat cow yoga pose demonstration" },
]

def try_download(query, tmp_path, max_dur):
    """Attempt yt-dlp download using the android client to bypass SABR restrictions."""
    cmd = [
        "yt-dlp",
        f"ytsearch5:{query}",
        # Target format 18 (360p pre-merged mp4) or fallbacks
        "-f", "18/best[height<=360]/best",
        "--no-playlist",
        "--match-filter", f"duration < {max_dur}",
        "--max-downloads", "1",
        "--output", tmp_path + ".%(ext)s",
        "--no-warnings",
        "--extractor-args", "youtube:player_client=android",
        "--extractor-retries", "3",
    ]

    result = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', errors='replace')
    return result

def find_tmp(tmp_path):
    """Find any temp file that was created."""
    for ext in ["mp4", "webm", "mkv", "mov", "m4v"]:
        c = tmp_path + f".{ext}"
        if os.path.isfile(c) and os.path.getsize(c) > 50_000:
            return c
    return None

success_count = 0
fail_list = []

for pose in poses:
    folder   = os.path.join(BASE_DIR, pose["folder"])
    os.makedirs(folder, exist_ok=True)
    out_path = os.path.join(folder, "demo.mp4")
    tmp_path = os.path.join(folder, "_tmp_raw")

    if os.path.isfile(out_path) and os.path.getsize(out_path) > 50_000:
        print(f"[SKIP]  {pose['folder']} - demo.mp4 already exists")
        success_count += 1
        continue

    print(f"\n{'='*60}")
    print(f"[POSE]  {pose['folder']}")
    print(f"[FIND]  {pose['query']}")

    tmp_found = None

    for max_dur in [180, 360, 600]:
        print(f"  >> Searching videos under {max_dur}s...")
        try_download(pose["query"], tmp_path, max_dur)
        tmp_found = find_tmp(tmp_path)
        if tmp_found:
            print(f"  >> Downloaded: {os.path.basename(tmp_found)}")
            break

    if not tmp_found:
        print(f"  [FAILED] No video found for {pose['folder']}")
        fail_list.append(pose["folder"])
        continue

    # Strip audio + re-encode at 360p small size
    print(f"  [ENCODE] Stripping audio, encoding to 360p ...")
    ff_cmd = [
        FFMPEG_BIN, "-y",
        "-i",  tmp_found,
        "-an",                      # NO audio
        "-vf", "scale=-2:360",      # 360p
        "-c:v", "libx264",
        "-crf", "30",
        "-preset", "fast",
        "-movflags", "+faststart",
        out_path,
    ]
    ff = subprocess.run(ff_cmd, capture_output=True, text=True, encoding='utf-8', errors='replace')

    try:
        os.remove(tmp_found)
    except Exception:
        pass

    if os.path.isfile(out_path) and os.path.getsize(out_path) > 50_000:
        kb = os.path.getsize(out_path) // 1024
        print(f"  [OK] demo.mp4 saved ({kb} KB)")
        success_count += 1
    else:
        print(f"  [FAIL] ffmpeg encode failed: {ff.stderr[-300:]}")
        fail_list.append(pose["folder"])

# Clean up test video if any
if os.path.isfile("test_video.mp4"):
    try:
        os.remove("test_video.mp4")
    except Exception:
        pass

print(f"\n\n{'='*60}")
print(f"DONE: {success_count}/10 videos saved successfully.")
if fail_list:
    print(f"FAILED poses: {', '.join(fail_list)}")
print("="*60)
