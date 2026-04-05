import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
  Filler
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip, Filler);

export function RealTimeChart({ history }) {
  const chartLabels = history.map((_, i) => `${i * 3}s`);
  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Chest (cm)",
        data: history.map(h => Math.round(h.chest)),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.15)",
        tension: 0.4,
        fill: true,
        pointRadius: 3
      },
      {
        label: "Face (cm)",
        data: history.map(h => Math.round(h.face)),
        borderColor: "#22c55e",
        backgroundColor: "rgba(34,197,94,0.1)",
        tension: 0.4,
        fill: true,
        pointRadius: 3
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    color: "#a1a1aa",
    plugins: {
      legend: { position: "top", labels: { font: { size: 12 }, boxWidth: 10, color: "#f4f4f5" } },
      tooltip: { mode: "index", intersect: false }
    },
    scales: {
      y: {
        min: 30, max: 80,
        grid: { color: "rgba(255,255,255,0.05)" },
        ticks: { font: { size: 11 }, color: "#a1a1aa" }
      },
      x: {
        grid: { display: false },
        ticks: {
          font: { size: 10 },
          color: "#a1a1aa",
          maxTicksLimit: 8,
          maxRotation: 0
        }
      }
    },
    animation: { duration: 400 }
  };

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div className="card-label">Real-Time Sensor Feed</div>
        <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>Last {history.length * 3}s of data</div>
      </div>
      <div style={{ height: 200 }}>
        <Line data={chartData} options={{ ...chartOptions, maintainAspectRatio: false }} />
      </div>
      <div style={{
        display: "flex", gap: 20, marginTop: 12,
        paddingTop: 10, borderTop: "1px solid var(--border-color)"
      }}>
        {[
          { label: "Safe zone", desc: "Chest ≥ 50 cm", color: "var(--color-healthy)" },
          { label: "Warning zone", desc: "Chest 45–50 cm", color: "var(--color-warning)" },
          { label: "Danger zone", desc: "Chest < 45 cm", color: "var(--color-danger)" }
        ].map(z => (
          <div key={z.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--text-secondary)" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: z.color, flexShrink: 0, display: "inline-block" }} />
            <span><strong style={{ color: "var(--text-primary)" }}>{z.label}</strong> — {z.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
