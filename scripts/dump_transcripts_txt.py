import sys
sys.path.append("scripts")
import parse_vtt
import os

SCRATCH_DIR = r"C:\Users\LENOVO\Desktop\Websites\Yoga-Project\scratch"
OUTPUT_FILE = r"C:\Users\LENOVO\Desktop\Websites\Yoga-Project\scratch\video_transcripts.txt"

with open(OUTPUT_FILE, "w", encoding="utf-8") as out:
    for f_name in sorted(os.listdir(SCRATCH_DIR)):
        if not f_name.endswith('.vtt'):
            continue
        pose_name = f_name.replace('.en.vtt', '')
        out.write(f"\n{'='*70}\nPOSE: {pose_name}\n{'='*70}\n")
        cues = parse_vtt.parse_vtt(os.path.join(SCRATCH_DIR, f_name))
        for start, end, text in cues:
            if text.strip() in ["[Music]", "hmm"]:
                continue
            out.write(f"[{start[:8]} -> {end[:8]}] {text}\n")

print("Dumped transcripts to scratch/video_transcripts.txt")
