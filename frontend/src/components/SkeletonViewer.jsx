import skeleton from "../assets/skeleton.png";

function SkeletonViewer({ postureState }) {

  let message = "Posture within healthy ergonomic range.";

  if (postureState === "warning") {
    message = "Forward head posture detected. Neck strain possible.";
  }

  if (postureState === "danger") {
    message = "Prolonged slouching detected. Lower back strain risk.";
  }

  return (
    <div style={styles.container}>

      <div style={styles.wrapper}>

        <img src={skeleton} alt="Skeleton" style={styles.image} />

        {postureState === "healthy" && (
          <div style={styles.spine}></div>
        )}

        {postureState === "warning" && (
          <div style={styles.neck}></div>
        )}

        {postureState === "danger" && (
          <div style={styles.lowerBack}></div>
        )}

      </div>

      <p style={styles.message}>{message}</p>

      <p style={styles.note}>
        Visualization indicates potential strain zones based on posture.
      </p>

    </div>
  );
}

const styles = {

  container: {
    textAlign: "center",
    padding: "10px"
  },

  wrapper: {
    position: "relative",
    display: "inline-block"
  },

  image: {
    height: "260px"
  },

  /* Healthy spine glow */
  spine: {
    position: "absolute",
    top: "110px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "14px",
    height: "80px",
    background: "rgba(46,204,113,0.6)",
    borderRadius: "8px",
    filter: "blur(6px)"
  },

  /* Neck strain highlight */
  neck: {
    position: "absolute",
    top: "60px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "40px",
    height: "40px",
    background: "rgba(243,156,18,0.6)",
    borderRadius: "50%",
    filter: "blur(10px)"
  },

  /* Lower back strain highlight */
  lowerBack: {
    position: "absolute",
    top: "160px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "50px",
    height: "50px",
    background: "rgba(231,76,60,0.7)",
    borderRadius: "50%",
    filter: "blur(12px)"
  },

  message: {
    marginTop: "10px",
    fontWeight: "600",
    fontSize: "15px"
  },

  note: {
    fontSize: "12px",
    color: "#777"
  }

};

export default SkeletonViewer;