export const client = {
  entities: {
    Project: {
      list: async (sortBy) => {
        const username = localStorage.getItem('currentUser');

        let profile;
        if (window.electron?.readUserProfile) {
          profile = window.electron.readUserProfile(username);
        } else {
          // fallback for browser dev
          profile = JSON.parse(localStorage.getItem('mockProfile') || '{"projects": []}');
        }

        let projects = profile.projects || [];

        if (sortBy === '-created_date') {
          projects = projects.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
        }

        return projects;
      },

      create: async (data) => {
        const username = localStorage.getItem('currentUser');

        let profile;
        if (window.electron?.readUserProfile) {
          profile = window.electron.readUserProfile(username);
        } else {
          profile = JSON.parse(localStorage.getItem('mockProfile') || '{"projects": []}');
        }

        const newProject = {
          id: Date.now().toString(),
          name: data.name,
          description: data.description || '',
          created_date: new Date().toISOString(),
          tasks: [],
        };

        profile.projects = [newProject, ...(profile.projects || [])];

        if (window.electron?.saveUserProfile) {
          window.electron.saveUserProfile(username, profile);
        } else {
          localStorage.setItem('mockProfile', JSON.stringify(profile));
        }

        return newProject;
      },

      // …do the same for update and delete
    },
  },
};
