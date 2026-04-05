export function generateCSVReport(history, sessionDurationMin) {
  // Define CSV Headers
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Timestamp (sec),Chest Distance (cm),Face Distance (cm),Posture State\n";

  // Append Data
  history.forEach(row => {
    csvContent += `${row.time},${Math.round(row.chest)},${Math.round(row.face)},${row.state}\n`;
  });

  // Calculate summary stats
  const totalRecords = history.length;
  const badRecords = history.filter(h => h.state !== "healthy").length;
  const healthPct = totalRecords > 0 ? Math.round(((totalRecords - badRecords) / totalRecords) * 100) : 100;

  // Add Summary Footer
  csvContent += `\n--- SESSION SUMMARY ---\n`;
  csvContent += `Total Session Time:,${sessionDurationMin} minutes\n`;
  csvContent += `Overall Posture Quality:,${healthPct}%\n`;
  csvContent += `Generated At:,${new Date().toLocaleString()}\n`;

  // Trigger Download
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `aura_sit_report_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link); // Required for Firefox
  link.click();
  document.body.removeChild(link);
}
