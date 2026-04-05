export function saveSessionToStorage(sessionData) {
  try {
    const existing = getHistoryFromStorage();
    existing.push({
      date: new Date().toISOString(),
      ...sessionData
    });
    // Keep max 30 recent sessions to prevent bloat
    const trimmed = existing.slice(-30);
    localStorage.setItem("aura_history", JSON.stringify(trimmed));
  } catch (err) {
    console.error("Failed to write session to LocalStorage", err);
  }
}

export function getHistoryFromStorage() {
  try {
    return JSON.parse(localStorage.getItem("aura_history") || "[]");
  } catch (err) {
    console.error("Failed to read from LocalStorage", err);
    return [];
  }
}
