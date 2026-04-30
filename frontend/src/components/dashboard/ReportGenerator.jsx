import React from 'react';
import html2canvas from 'html2canvas';

export default function ReportGenerator({ sessionDate = null }) {
  const handleDownload = async () => {
    const reportContainer = document.getElementById("session-report-container");
    if (!reportContainer) return;
    
    try {
      // Create canvas from the visible report container
      const canvas = await html2canvas(reportContainer, {
        backgroundColor: '#1E1E20', // Matching dark theme
        scale: 2, // High resolution for clear text
        useCORS: true
      });
      
      const image = canvas.toDataURL('image/png');
      
      const dateStr = new Date(sessionDate || Date.now()).toISOString().split('T')[0];
      const filename = `aura-sit-report-${dateStr}.png`;
      
      const link = document.createElement('a');
      link.href = image;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to generate report snapshot:", err);
    }
  };


  return (
    <div className="rg-container">
      <style>{`
        .rg-container {
          display: inline-block;
        }
        .rg-button {
          background: #2291FF;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 12px rgba(34, 145, 255, 0.2);
        }
        .rg-button:hover {
          background: #0077ED;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(34, 145, 255, 0.3);
        }
        .rg-button:active {
          transform: translateY(1px);
        }
        
      `}</style>

      <button className="rg-button" onClick={handleDownload}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        Download Session Report
      </button>
    </div>
  );
}
