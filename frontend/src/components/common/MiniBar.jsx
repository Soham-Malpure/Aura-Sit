export function MiniBar({ pct, color }) {
  return (
    <div style={{ height: 6, background: "var(--bg-muted)", borderRadius: 4, overflow: "hidden", flex: 1 }}>
      <div style={{
        height: "100%", width: `${pct}%`,
        background: color, borderRadius: 4,
        transition: "width 0.5s ease"
      }} />
    </div>
  );
}
