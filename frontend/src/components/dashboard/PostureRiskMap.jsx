import skeletonImg from "../../assets/skeleton.png";

export function PostureRiskMap({ postureState }) {
  return (
    <div className="card" style={{ textAlign: "center" }}>
      <div className="card-label" style={{ marginBottom: 12 }}>Posture Risk Map</div>
      <div style={{ position: "relative", width: "100%", height: 280, margin: "0 auto", display: "flex", justifyContent: "center", alignItems: "center" }}>
        {/* Neck Highlight (Warning) */}
        {postureState === "warning" && (
          <div style={{ title: "Adjust 'top' to align with neck", position: "absolute", top: "25%", left: "50%", transform: "translate(-50%, -50%)", width: 50, height: 50, background: "rgba(245, 158, 11, 0.7)", filter: "blur(12px)", borderRadius: "50%", zIndex: 2 }} />
        )}
        {/* Lower Back Highlight (Danger) */}
        {postureState === "danger" && (
          <div style={{ title: "Adjust 'top' to align with lower back", position: "absolute", top: "60%", left: "50%", transform: "translate(-50%, -50%)", width: 60, height: 60, background: "rgba(239, 68, 68, 0.7)", filter: "blur(15px)", borderRadius: "50%", zIndex: 2 }} />
        )}
        {/* Spine Highlight (Healthy) */}
        {postureState === "healthy" && (
          <div style={{ title: "Adjust 'top' and 'height' for spine", position: "absolute", top: "45%", left: "50%", transform: "translate(-50%, -50%)", width: 40, height: 110, background: "rgba(34, 197, 94, 0.5)", filter: "blur(15px)", borderRadius: "50%", zIndex: 2 }} />
        )}
        <img src={skeletonImg} alt="Posture Monitor Skeleton" style={{ maxWidth: "100%", maxHeight: "100%", position: "relative", zIndex: 1, objectFit: "contain" }} />
      </div>
      <div style={{
        marginTop: 16, fontSize: 14, fontWeight: 700,
        color: { healthy: "var(--color-healthy)", warning: "var(--color-warning)", danger: "var(--color-danger)" }[postureState]
      }}>
        {postureState === "healthy" && "Optimal Alignment: Balanced Spine"}
        {postureState === "warning" && "Warning: Neck (Cervical Spine) Strain"}
        {postureState === "danger" && "Danger: Lower Back (Lumbar Spine) Compression"}
      </div>
      <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 6, lineHeight: 1.4 }}>
        {postureState === "healthy" && "Your head is balanced perfectly over your shoulders. The spine maintains its natural, healthy S-curve without excess tension."}
        {postureState === "warning" && "Leaning forward acts like a lever, magnifying the weight of your head and causing severe muscle tension on the upper neck and shoulders."}
        {postureState === "danger" && "Slouching flattens the natural curve of your lower back, pinching your lumbar discs and increasing the risk of radiating nerve pain."}
      </div>

      {/* Legend */}
      <div style={{ marginTop: 12, display: "flex", justifyContent: "center", gap: 14 }}>
        {[
          { color: "rgba(34,197,94,0.6)", label: "Spinal Neutral" },
          { color: "rgba(245,158,11,0.6)", label: "Cervical Tension" },
          { color: "rgba(239,68,68,0.6)", label: "Lumbar Compression" }
        ].map(l => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--text-secondary)" }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: l.color, display: "inline-block" }} />
            {l.label}
          </div>
        ))}
      </div>
    </div>
  );
}
