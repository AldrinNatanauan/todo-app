import fs from 'fs';
import path from 'path';

const dbPath = path.resolve('data/projects.json');

export function loadProjects() {
  try {
    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, JSON.stringify([], null, 2));
      return [];
    }

    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to load projects:', err);
    return [];
  }
}

export function saveProjects(projects) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(projects, null, 2));
  } catch (err) {
    console.error('Failed to save projects:', err);
  }
}
