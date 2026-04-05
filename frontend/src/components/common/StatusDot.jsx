export function StatusDot({ state }) {
  const colors = { healthy: "var(--color-healthy)", warning: "var(--color-warning)", danger: "var(--color-danger)" };
  return (
    <span style={{
      display: "inline-block",
      width: 8, height: 8,
      borderRadius: "50%",
      background: colors[state] || "var(--text-secondary)",
      marginRight: 6,
      flexShrink: 0
    }} />
  );
}
