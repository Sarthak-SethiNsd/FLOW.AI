import sys
sys.path.append("scripts")
import parse_vtt
import os

SCRATCH_DIR = r"C:\Users\LENOVO\Desktop\Websites\Yoga-Project\scratch"

for f_name in os.listdir(SCRATCH_DIR):
    if not f_name.endswith('.vtt'):
        continue
    pose_name = f_name.replace('.en.vtt', '')
    print(f"\n{'='*70}\nPOSE: {pose_name}\n{'='*70}")
    cues = parse_vtt.parse_vtt(os.path.join(SCRATCH_DIR, f_name))
    for start, end, text in cues:
        # filter out music-only cues if possible
        if text.strip() in ["[Music]", "hmm"]:
            continue
        print(f"[{start[:8]} -> {end[:8]}] {text}")
