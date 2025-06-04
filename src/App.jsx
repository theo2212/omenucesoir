// Omenucesoir - Carte plein écran + Emoji personnalisé + Responsive complet

import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate
} from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

const styles = {
  layout: {
    backgroundColor: "#1e1e1e",
    color: "#fff",
    fontFamily: "'Segoe UI', sans-serif",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column"
  },
  nav: {
    display: "flex",
    justifyContent: "space-around",
    backgroundColor: "#111",
    padding: "10px 0",
    position: "sticky",
    top: 0,
    zIndex: 10
  },
  link: {
    color: "#1abc9c",
    textDecoration: "none",
    fontSize: 18
  },
  content: {
    flexGrow: 1,
    padding: 20,
    maxWidth: 800,
    margin: "0 auto",
    width: "100%"
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    backgroundColor: "#2c2c2c",
    color: "#fff",
    border: "1px solid #555",
    borderRadius: 8,
    fontSize: "16px"
  },
  button: {
    padding: 14,
    backgroundColor: "#27ae60",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    width: "100%",
    fontSize: "16px",
    marginTop: 10
  },
  card: {
    backgroundColor: "#2a2a2a",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20
  }
};

const customIcon = L.divIcon({
  className: "custom-icon",
  html: "🍽️",
  iconSize: [24, 24],
  iconAnchor: [12, 24]
});

function Home({ restaurants }) {
  return (
    <div style={{ height: "calc(100vh - 60px)" }}>
      <MapContainer center={[47, 2]} zoom={5} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {restaurants.map((r, i) =>
          r.coords ? (
            <Marker key={i} position={[r.coords.lat, r.coords.lon]} icon={customIcon}>
              <Popup>
                <strong>{r.nom}</strong>
                <br />
                {r.lieu}
              </Popup>
            </Marker>
          ) : null
        )}
      </MapContainer>
    </div>
  );
}

function List({ restaurants, onEdit, onDelete }) {
  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>📋 Liste des restaurants</h2>
      {restaurants.map((r, i) => (
        <div key={i} style={styles.card}>
          <h3>{r.nom} ({r.lieu})</h3>
          <p>{r.date} - {r.plats}</p>
          <p><strong>Notes :</strong> E:{r.notes.emplacement} A:{r.notes.atmosphere} N:{r.notes.nourriture} S:{r.notes.service}</p>
          <p><strong>Anecdote :</strong> {r.anecdote}</p>
          <button onClick={() => onEdit(i)} style={{ ...styles.button, backgroundColor: "#2980b9" }}>✏️ Modifier</button>
          <button onClick={() => onDelete(i)} style={{ ...styles.button, backgroundColor: "#c0392b", marginTop: 8 }}>🗑️ Supprimer</button>
        </div>
      ))}
    </div>
  );
}

function Form({ initial, onSave }) {
  const [form, setForm] = useState(initial);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in form.notes) {
      setForm({ ...form, notes: { ...form.notes, [name]: parseInt(value) } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSave = async () => {
    const res = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: form.lieu,
        format: "json"
      }
    });
    const coords = res.data[0] ? { lat: parseFloat(res.data[0].lat), lon: parseFloat(res.data[0].lon) } : null;
    onSave({ ...form, coords });
    navigate("/");
  };

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>{initial.index >= 0 ? "✏️ Modifier" : "➕ Ajouter"} un restaurant</h2>
      <input name="nom" placeholder="Nom" value={form.nom} onChange={handleChange} style={styles.input} />
      <input name="lieu" placeholder="Lieu" value={form.lieu} onChange={handleChange} style={styles.input} />
      <input name="date" placeholder="Date" value={form.date} onChange={handleChange} style={styles.input} />
      <input name="plats" placeholder="Plats" value={form.plats} onChange={handleChange} style={styles.input} />
      <input name="typeCuisine" placeholder="Cuisine" value={form.typeCuisine} onChange={handleChange} style={styles.input} />
      <input name="prix" placeholder="Prix (€)" value={form.prix} onChange={handleChange} style={styles.input} />
      <textarea name="anecdote" placeholder="Anecdote" value={form.anecdote} onChange={handleChange} style={{ ...styles.input, height: 60 }} />
      <input name="emplacement" placeholder="Note emplacement" value={form.notes.emplacement} onChange={handleChange} style={styles.input} />
      <input name="atmosphere" placeholder="Note atmosphère" value={form.notes.atmosphere} onChange={handleChange} style={styles.input} />
      <input name="nourriture" placeholder="Note nourriture" value={form.notes.nourriture} onChange={handleChange} style={styles.input} />
      <input name="service" placeholder="Note service" value={form.notes.service} onChange={handleChange} style={styles.input} />
      <button onClick={handleSave} style={styles.button}>💾 Enregistrer</button>
    </div>
  );
}

function emptyForm() {
  return {
    nom: "",
    lieu: "",
    date: "",
    plats: "",
    typeCuisine: "",
    prix: "",
    anecdote: "",
    notes: { emplacement: 0, atmosphere: 0, nourriture: 0, service: 0 },
    coords: null
  };
}

export default function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [current, setCurrent] = useState({ index: -1, ...emptyForm() });

  const handleSave = (data) => {
    if (data.index >= 0) {
      const copy = [...restaurants];
      copy[data.index] = data;
      setRestaurants(copy);
    } else {
      setRestaurants([...restaurants, data]);
    }
    setCurrent({ index: -1, ...emptyForm() });
  };

  const handleEdit = (index) => {
    setCurrent({ index, ...restaurants[index] });
  };

  const handleDelete = (index) => {
    setRestaurants(restaurants.filter((_, i) => i !== index));
  };

  return (
    <Router>
      <div style={styles.layout}>
        <nav style={styles.nav}>
          <Link to="/" style={styles.link}>Carte</Link>
          <Link to="/liste" style={styles.link}>Liste</Link>
          <Link to="/form" style={styles.link}>Ajouter</Link>
        </nav>
        <div style={styles.content}>
          <Routes>
            <Route path="/" element={<Home restaurants={restaurants} />} />
            <Route path="/liste" element={<List restaurants={restaurants} onEdit={handleEdit} onDelete={handleDelete} />} />
            <Route path="/form" element={<Form initial={current} onSave={handleSave} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
