import os
import subprocess

BASE_DIR = r"c:\Users\LENOVO\Desktop\Websites\Yoga-Project\public\asanas"
os.makedirs("scratch", exist_ok=True)

# Poses queries
poses = [
    { "folder": "tadasana",              "query": "tadasana mountain pose yoga demonstration" },
    { "folder": "surya-namaskar",        "query": "surya namaskar steps yoga demonstration" },
    { "folder": "vrikshasana",           "query": "vrikshasana tree pose yoga demonstration" },
    { "folder": "adho-mukha-svanasana",  "query": "downward dog yoga pose demonstration" },
    { "folder": "virabhadrasana-ii",     "query": "warrior 2 yoga pose demonstration" },
    { "folder": "balasana",              "query": "balasana childs pose yoga demonstration" },
    { "folder": "bhujangasana",          "query": "cobra pose bhujangasana yoga demonstration" },
    { "folder": "trikonasana",           "query": "triangle pose yoga demonstration" },
    { "folder": "utkatasana",            "query": "chair pose yoga utkatasana demonstration" },
    { "folder": "cat-cow-flow",          "query": "cat cow yoga pose demonstration" },
]

for pose in poses:
    print(f"\nPose: {pose['folder']}")
    # Download subtitles only (manual or auto-generated)
    cmd = [
        "yt-dlp",
        f"ytsearch1:{pose['query']}",
        "--extractor-args", "youtube:player_client=android",
        "--skip-download",
        "--write-subs",
        "--write-auto-subs",
        "--sub-langs", "en",
        "--output", f"scratch/{pose['folder']}"
    ]
    subprocess.run(cmd)

print("\nDone fetching subtitles!")
