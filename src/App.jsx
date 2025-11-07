import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://immigration-app-backend-1.onrender.com";


function App() {
  const [clients, setClients] = useState([]);
  const [selected, setSelected] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [newMsg, setNewMsg] = useState("");

  // cargar clientes al inicio
  useEffect(() => {
    axios.get(`${API}/clients`).then((res) => {
      setClients(res.data);
    });
  }, []);

  const refreshClients = async (keepId) => {
    const res = await axios.get(`${API}/clients`);
    setClients(res.data);
    if (keepId) {
      const again = res.data.find((c) => c._id === keepId);
      if (again) setSelected(again);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selected) return;
    await axios.put(`${API}/clients/${selected._id}/status`, {
      status: newStatus,
    });
    setNewStatus("");
    refreshClients(selected._id);
  };

  const handleSendMessage = async () => {
    if (!selected) return;
    await axios.post(`${API}/clients/${selected._id}/messages`, {
      from: "office",
      text: newMsg,
    });
    setNewMsg("");
    refreshClients(selected._id);
  };

  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
      {/* LISTA DE CLIENTES */}
      <div style={{ width: "35%", borderRight: "1px solid #ddd" }}>
        <h2 style={{ marginBottom: "10px" }}>Clients</h2>
        {clients.length === 0 && <p>No clients yet.</p>}
        {clients.map((c) => (
          <div
            key={c._id}
            onClick={() => setSelected(c)}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              cursor: "pointer",
              background:
                selected && selected._id === c._id ? "#eef" : "transparent",
            }}
          >
            <strong>{c.name}</strong>
            <div style={{ fontSize: "12px" }}>{c.processType}</div>
            <div style={{ fontSize: "12px" }}>
              Status: <b>{c.status}</b>
            </div>
          </div>
        ))}
      </div>

      {/* DETALLE DEL CLIENTE */}
      <div style={{ width: "65%" }}>
        {selected ? (
          <>
            <h2>{selected.name}</h2>
            <p>
              <b>Email:</b> {selected.email}
            </p>
            <p>
              <b>Phone:</b> {selected.phone}
            </p>
            <p>
              <b>Case #:</b> {selected.caseNumber}
            </p>
            <p>
              <b>Process:</b> {selected.processType}
            </p>
            <p>
              <b>Status:</b> {selected.status}
            </p>

            <h3 style={{ marginTop: "20px" }}>Update status</h3>
            <input
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              placeholder="e.g. Sent to USCIS on 11/07/2025"
              style={{ width: "60%", padding: "6px" }}
            />
            <button onClick={handleStatusUpdate} style={{ marginLeft: "10px" }}>
              Save
            </button>

            <h3 style={{ marginTop: "20px" }}>Messages</h3>
            <div
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                maxHeight: "150px",
                overflowY: "auto",
                marginBottom: "10px",
              }}
            >
              {selected.messages && selected.messages.length > 0 ? (
                selected.messages.map((m, i) => (
                  <div key={i} style={{ marginBottom: "6px" }}>
                    <b>{m.from === "office" ? "Office" : "Client"}:</b>{" "}
                    {m.text}
                  </div>
                ))
              ) : (
                <div>No messages yet.</div>
              )}
            </div>

            <input
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              placeholder="Write a message to client..."
              style={{ width: "60%", padding: "6px" }}
            />
            <button onClick={handleSendMessage} style={{ marginLeft: "10px" }}>
              Send
            </button>
          </>
        ) : (
          <p>Select a client on the left.</p>
        )}
      </div>
    </div>
  );
}

export default App;
