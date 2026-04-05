function StretchRecommendations({ postureState, totalSittingTime }) {

  const suggestions = [];

  if (totalSittingTime > 45) {
    suggestions.push({ title: "Stand & Walk", desc: "Take a short walk." });
  }

  if (postureState === "warning") {
    suggestions.push({ title: "Neck Stretch", desc: "Tilt head slowly." });
  }

  if (postureState === "danger") {
    suggestions.push({ title: "Back Stretch", desc: "Straighten spine." });
  }

  if (totalSittingTime > 30) {
    suggestions.push({ title: "Eye Break", desc: "20-20-20 rule." });
  }

  return (
    <div style={styles.container}>
      {suggestions.map((item, i) => (
        <div key={i} style={styles.card}>
          <h4>{item.title}</h4>
          <p>{item.desc}</p>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "15px"
  },

  card: {
    background: "#ffffff",
    padding: "12px",
    borderRadius: "10px",
    borderLeft: "4px solid #3b82f6",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
  }
};

export default StretchRecommendations;