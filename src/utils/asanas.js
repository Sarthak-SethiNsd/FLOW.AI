import fs from 'fs';
import path from 'path';

export function getAllAsanas() {
  const asanasDirectory = path.join(process.cwd(), 'public', 'asanas');
  if (!fs.existsSync(asanasDirectory)) {
    return [];
  }
  
  const folders = fs.readdirSync(asanasDirectory);
  const asanas = folders
    .map(folder => {
      const configPath = path.join(asanasDirectory, folder, 'config.json');
      if (fs.existsSync(configPath)) {
        try {
          const fileContents = fs.readFileSync(configPath, 'utf8');
          return JSON.parse(fileContents);
        } catch (e) {
          console.error(`Error parsing config for ${folder}:`, e);
          return null;
        }
      }
      return null;
    })
    .filter(Boolean);
    
  return asanas;
}

export function getAsanaById(id) {
  const asanasDirectory = path.join(process.cwd(), 'public', 'asanas');
  const configPath = path.join(asanasDirectory, id, 'config.json');
  
  if (fs.existsSync(configPath)) {
    try {
      const fileContents = fs.readFileSync(configPath, 'utf8');
      return JSON.parse(fileContents);
    } catch (e) {
      console.error(`Error parsing config for ${id}:`, e);
      return null;
    }
  }
  return null;
}
