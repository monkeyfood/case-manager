// Storage utility
// Data is saved in localStorage so it persists across sessions on the same device.
// To sync across devices, export/import JSON (buttons in settings).

const STORAGE_KEY = 'adhd_case_manager_v1';

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load data:', e);
    return null;
  }
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Failed to save data:', e);
    return false;
  }
}

export function exportData(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `case-manager-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importData(file, callback) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      callback(null, data);
    } catch (err) {
      callback('Invalid file format');
    }
  };
  reader.readAsText(file);
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
