// components/Loader.jsx
const Loader = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "40px 0",
    }}
  >
    <div
      style={{
        border: "4px solid rgba(36, 238, 137, 0.2)",
        borderTop: "4px solid rgb(36, 238, 137)",
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        animation: "spin 1s linear infinite",
      }}
    />
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
  </div>
);

export default Loader;
