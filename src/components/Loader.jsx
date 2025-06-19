export default function Loader() {
  const loaderContainerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "500px",
  };
  
  const loaderStyle = {
    border: "6px solid #f3f3f3",
    borderTop: "6px solid #3498db",
    borderRadius: "50%",
    width: "60px",
    height: "60px",
    animation: "spin 1s linear infinite",
  };

  const keyframesStyle = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  return (
    <div style={loaderContainerStyle}>
      <style>{keyframesStyle}</style>
      <div style={loaderStyle}></div>
      <p>Loading, please wait...</p>
    </div>
  );
}
