const { contextBridge } = require('electron');
const fs = require('fs');
const path = require('path');

const userProfilesPath = path.join(__dirname, 'userProfiles.json');

// Expose functions to the renderer safely
contextBridge.exposeInMainWorld('electron', {
  readUserProfile: (username) => {
    if (!fs.existsSync(userProfilesPath)) return null;
    const allProfiles = JSON.parse(fs.readFileSync(userProfilesPath, 'utf-8'));
    return allProfiles[username] || { projects: [] };
  },
  saveUserProfile: (username, profile) => {
    let allProfiles = {};
    if (fs.existsSync(userProfilesPath)) {
      allProfiles = JSON.parse(fs.readFileSync(userProfilesPath, 'utf-8'));
    }
    allProfiles[username] = profile;
    fs.writeFileSync(userProfilesPath, JSON.stringify(allProfiles, null, 2));
  },
});
