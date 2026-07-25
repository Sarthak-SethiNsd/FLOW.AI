const fs = require('fs');

try {
  let buffer = fs.readFileSync('parent_transcript.txt');
  let encoding = 'utf8';
  let skipBytes = 0;
  
  if (buffer[0] === 0xff && buffer[1] === 0xfe) {
    encoding = 'utf16le';
    skipBytes = 2;
  } else if (buffer[0] === 0xfe && buffer[1] === 0xff) {
    encoding = 'utf16be';
    skipBytes = 2;
  } else if (buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf) {
    encoding = 'utf8';
    skipBytes = 3;
  }
  
  const text = buffer.subarray(skipBytes).toString(encoding);
  const lines = text.split('\n');
  console.log(`Found ${lines.length} lines in parent transcript.`);
  
  let found = false;
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim();
    if (!line) continue;
    
    try {
      const data = JSON.parse(line);
      if (data.content && data.content.includes('YogaGuide.js') && data.content.includes('FILE 6')) {
        console.log(`Found matching step at index ${data.step_index}`);
        fs.writeFileSync('parent_instructions.txt', data.content, 'utf8');
        found = true;
        break;
      }
    } catch (e) {
      // Ignore JSON parse errors for incomplete/empty lines
    }
  }
  
  if (!found) {
    console.log('Could not find step containing FILE 6 and YogaGuide.js');
  }
} catch (err) {
  console.error('Error processing parent file:', err);
}
