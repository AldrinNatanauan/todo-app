import fs from 'fs';
import path from 'path';
import { app } from 'electron';

const basePath = app?.getPath ? app.getPath('userData') : path.resolve('data');

const dbPath = path.join(basePath, 'projects.json');

function ensureDirectory() {
  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath, { recursive: true });
  }
}

export function loadProjects() {
  try {
    ensureDirectory();

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
    ensureDirectory();
    fs.writeFileSync(dbPath, JSON.stringify(projects, null, 2), { flag: 'w' });
  } catch (err) {
    console.error('Failed to save projects:', err);
  }
}