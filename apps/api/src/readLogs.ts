import fs from 'fs';
import readline from 'readline';

const file = 'C:\\Users\\CHRISTIN JOHNY\\.gemini\\antigravity-ide\\brain\\93484ae1-9e1a-4dd2-828b-555e930bc19c\\.system_generated\\logs\\transcript.jsonl';

const run = async () => {
  const fileStream = fs.createReadStream(file);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  
  let count = 0;
  for await (const line of rl) {
    if (line.toLowerCase().includes('phase 7') || line.toLowerCase().includes('blog') || line.toLowerCase().includes('tiptap')) {
      console.log(`Line ${count}: ${line.substring(0, 300)}...`);
    }
    count++;
  }
  console.log(`Finished searching ${count} lines.`);
};

run();
