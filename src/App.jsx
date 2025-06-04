// Omenucesoir - App complète avec thème foncé, carte interactive et navigation

import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const darkTheme = {
  backgroundColor: "#1e1e1e",
  color: "#ffffff",
  fontFamily: "sans-serif",
  minHeight: "100vh",
  padding: "20px"
};

const inputStyle = {
  padding: "10px",
  marginBottom: "10px",
  border: "1px solid #555",
  borderRadius: "8px",
  width: "100%",
  fontSize: "16px",
  backgroundColor: "#2c2c2c",
  color: "white"
};

function Accueil({ restaurants }) {
  return (
    <div>
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>📍 Carte des restaurants</h1>
      <MapContainer center={[48.8566, 2.3522]} zoom={5} style={{ height: "70vh", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        {restaurants.map((r, i) => (
          <Marker key={i} position={[48.8566, 2.3522]}>
            <Popup>
              <strong>{r.nom}</strong><br />
              {r.lieu}<br />
              {r.date}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

function Liste({ restaurants }) {
  return (
    <div>
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>📋 Liste des restaurants</h1>
      {restaurants.map((r, i) => (
        <div key={i} style={{ backgroundColor: "#2a2a2a", padding: 20, borderRadius: 12, marginBottom: 20 }}>
          <h2>{r.nom} <span style={{ fontWeight: "normal" }}>({r.lieu})</span></h2>
          <p><strong>📅 Date :</strong> {r.date}</p>
          <p><strong>🍽️ Plats :</strong> {r.plats}</p>
          <p><strong>👨‍🍳 Cuisine :</strong> {r.typeCuisine} — <strong>💶 Prix :</strong> {r.prix} €</p>
          <p><strong>⭐ Notes :</strong> E:{r.notes.emplacement} / A:{r.notes.atmosphere} / N:{r.notes.nourriture} / S:{r.notes.service}</p>
          <p><strong>💬 Anecdote :</strong> {r.anecdote}</p>
        </div>
      ))}
    </div>
  );
}

function Ajouter({ onAdd }) {
  const [form, setForm] = useState({
    nom: "",
    lieu: "",
    date: "",
    plats: "",
    typeCuisine: "",
    prix: "",
    anecdote: "",
    notes: {
      emplacement: 0,
      atmosphere: 0,
      nourriture: 0,
      service: 0,
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in form.notes) {
      setForm({ ...form, notes: { ...form.notes, [name]: parseInt(value) } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = () => {
    onAdd(form);
    setForm({
      nom: "",
      lieu: "",
      date: "",
      plats: "",
      typeCuisine: "",
      prix: "",
      anecdote: "",
      notes: { emplacement: 0, atmosphere: 0, nourriture: 0, service: 0 },
    });
  };

  return (
    <div>
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>➕ Ajouter un restaurant</h1>
      <input name="nom" placeholder="Nom" value={form.nom} onChange={handleChange} style={inputStyle} />
      <input name="lieu" placeholder="Lieu" value={form.lieu} onChange={handleChange} style={inputStyle} />
      <input name="date" placeholder="Date" value={form.date} onChange={handleChange} style={inputStyle} />
      <input name="plats" placeholder="Plats" value={form.plats} onChange={handleChange} style={inputStyle} />
      <input name="typeCuisine" placeholder="Cuisine" value={form.typeCuisine} onChange={handleChange} style={inputStyle} />
      <input name="prix" placeholder="Prix (€)" value={form.prix} onChange={handleChange} style={inputStyle} />
      <textarea name="anecdote" placeholder="Anecdote" value={form.anecdote} onChange={handleChange} style={{ ...inputStyle, height: 60 }} />
      <input name="emplacement" placeholder="Note emplacement" value={form.notes.emplacement} onChange={handleChange} style={inputStyle} />
      <input name="atmosphere" placeholder="Note atmosphère" value={form.notes.atmosphere} onChange={handleChange} style={inputStyle} />
      <input name="nourriture" placeholder="Note nourriture" value={form.notes.nourriture} onChange={handleChange} style={inputStyle} />
      <input name="service" placeholder="Note service" value={form.notes.service} onChange={handleChange} style={inputStyle} />
      <button onClick={handleSubmit} style={{ ...inputStyle, backgroundColor: "#27ae60", color: "white", cursor: "pointer" }}>Ajouter</button>
    </div>
  );
}

export default function App() {
  const [restaurants, setRestaurants] = useState([]);

  const ajouterRestaurant = (data) => {
    setRestaurants([...restaurants, data]);
  };

  return (
    <Router>
      <div style={darkTheme}>
        <nav style={{ marginBottom: 20 }}>
          <Link to="/" style={{ marginRight: 20, color: "#1abc9c", textDecoration: "none" }}>Carte</Link>
          <Link to="/liste" style={{ marginRight: 20, color: "#1abc9c", textDecoration: "none" }}>Liste</Link>
          <Link to="/ajouter" style={{ color: "#1abc9c", textDecoration: "none" }}>Ajouter</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Accueil restaurants={restaurants} />} />
          <Route path="/liste" element={<Liste restaurants={restaurants} />} />
          <Route path="/ajouter" element={<Ajouter onAdd={ajouterRestaurant} />} />
        </Routes>
      </div>
    </Router>
  );
}
