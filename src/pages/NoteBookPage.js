function NotebookPage() {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <iframe
        src="http://localhost:8888"
        style={{ width: "100%", height: "100%", border: "none" }}
        title="ML Notebook Demo"
      />
    </div>
  );
}

export default NotebookPage;
