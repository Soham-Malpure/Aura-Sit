import { getHistoryFromFirebase } from "./storage";

export async function generateCSVReport(deviceId) {
  const savedLogs = await getHistoryFromFirebase(deviceId);
  
  if (savedLogs.length === 0) {
    alert("No saved sessions found to export. Try completing and saving a session first!");
    return;
  }

  // Define CSV Headers
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Date,Session Duration (min),Posture Quality Score (PQS),Avg Chest Distance (cm),Bad Posture %\n";

  // Append Data
  savedLogs.forEach(row => {
    const dateStr = new Date(row.date).toLocaleString();
    csvContent += `"${dateStr}",${row.totalMin},${row.pqs},${row.avgChest},${row.badPct}\n`;
  });

  // Calculate summary stats
  const totalSessions = savedLogs.length;
  const totalMinutes = savedLogs.reduce((sum, row) => sum + row.totalMin, 0);
  const avgPqs = totalSessions > 0 ? Math.round(savedLogs.reduce((sum, row) => sum + row.pqs, 0) / totalSessions) : 0;

  // Add Summary Footer
  csvContent += `\n--- LIFETIME SUMMARY ---\n`;
  csvContent += `Total Sessions Logged:,${totalSessions}\n`;
  csvContent += `Total Minutes Tracked:,${totalMinutes} min\n`;
  csvContent += `Lifetime PQS Average:,${avgPqs}%\n`;
  csvContent += `Generated At:,${new Date().toLocaleString()}\n`;

  // Trigger Download
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `aura_sit_lifetime_report_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link); // Required for Firefox
  link.click();
  document.body.removeChild(link);
}
