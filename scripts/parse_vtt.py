import re
import os

SCRATCH_DIR = r"C:\Users\LENOVO\Desktop\Websites\Yoga-Project\scratch"

def clean_html(text):
    """Remove HTML/VTT style tags and word-level timestamps."""
    # Remove tags like <00:00:00.560> and <c> or </c>
    text = re.sub(r'<\d{2}:\d{2}:\d{2}\.\d{3}>', '', text)
    text = re.sub(r'<[^>]+>', '', text)
    text = text.replace('\n', ' ').strip()
    
    # Remove duplicate consecutive words
    words = text.split()
    cleaned_words = []
    for w in words:
        if not cleaned_words or cleaned_words[-1].lower() != w.lower():
            cleaned_words.append(w)
    return ' '.join(cleaned_words)

def parse_vtt(file_path):
    """Parse WebVTT file with extra formatting flags."""
    if not os.path.isfile(file_path):
        return []
        
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Match 00:00:00.000 --> 00:00:00.000 plus optional layout settings
    pattern = r'(\d{2}:\d{2}:\d{2}\.\d{3})\s+-->\s+(\d{2}:\d{2}:\d{2}\.\d{3})[^\n]*\n(.*?)(?=\n\d{2}:\d{2}:\d{2}\.\d{3}\s+-->|\Z)'
    matches = re.findall(pattern, content, re.DOTALL)
    
    parsed = []
    for start, end, text in matches:
        cleaned_text = clean_html(text)
        if cleaned_text:
            parsed.append((start, end, cleaned_text))
            
    # Group consecutive cues with similar text to avoid redundancy
    grouped = []
    for start, end, text in parsed:
        if not grouped:
            grouped.append((start, end, text))
        else:
            prev_start, prev_end, prev_text = grouped[-1]
            # If the current text starts with the previous text or is very similar, update end time
            if text.startswith(prev_text) or prev_text.startswith(text):
                # keep the longer text
                longer_text = text if len(text) > len(prev_text) else prev_text
                grouped[-1] = (prev_start, end, longer_text)
            else:
                grouped.append((start, end, text))
                
    return grouped

def main():
    for f_name in os.listdir(SCRATCH_DIR):
        if not f_name.endswith('.vtt'):
            continue
        pose_name = f_name.replace('.en.vtt', '')
        print(f"\n============================================================\nPOSE: {pose_name}\n============================================================")
        cues = parse_vtt(os.path.join(SCRATCH_DIR, f_name))
        for start, end, text in cues[:30]:
            print(f"[{start[:8]} -> {end[:8]}] {text}")

if __name__ == "__main__":
    main()
