// src/pages/Register.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const fieldLabels = {
  email: "Email",
  password: "Password",
  name: "Name",
  surname: "Surname",
  role: "Role",
  city: "City",
  phoneNumber: "Phone Number",
  specificAddress: "Specific Address",
};

const turkishCities = [
  "ADANA", "ADIYAMAN", "AFYONKARAHISAR", "AĞRI", "AMASYA", "ANKARA", "ANTALYA",
  "ARTVİN", "AYDIN", "BALIKESİR", "BİLECİK", "BİNGÖL", "BİTLİS", "BOLU", "BURDUR",
  "BURSA", "ÇANAKKALE", "ÇANKIRI", "ÇORUM", "DENİZLİ", "DİYARBAKIR", "EDİRNE",
  "ELAZIĞ", "ERZİNCAN", "ERZURUM", "ESKİŞEHİR", "GAZİANTEP", "GİRESUN", "GÜMÜŞHANE",
  "HAKKARİ", "HATAY", "ISPARTA", "MERSİN", "İSTANBUL", "İZMİR", "KARS", "KASTAMONU",
  "KAYSERİ", "KIRKLARELİ", "KIRŞEHİR", "KOCAELİ", "KONYA", "KÜTAHYA", "MALATYA",
  "MANİSA", "KARAMAN", "KIRIKKALE", "BATMAN", "ŞIRNAK", "BARTIN", "ARDAHAN",
  "IĞDIR", "YALOVA", "KARABÜK", "KİLİS", "OSMANİYE", "DÜZCE"
];

const roles = ["Customer", "Product Manager", "Sales Manager"];

export default function Register() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    role: roles[0],
    city: turkishCities[0],
    specificAddress: "",
    phoneNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(fd => ({ ...fd, [name]: value }));
    setErrors(err => ({ ...err, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGlobalError("");

    try {
      const res = await axios.post(
        "http://localhost:8080/api/auth/signup",
        formData
      );

      if (res.status === 200 || res.status === 201) {
        navigate("/login");
      }
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        const fieldErrs = {};
        data.errors.forEach(msg => {
          const [label, detail] = msg.split(": ");
          const key = Object.entries(fieldLabels)
            .find(([, lab]) => lab === label.trim())?.[0];
          if (key) fieldErrs[key] = detail;
        });
        setErrors(fieldErrs);
      } else if (data?.message) {
        setGlobalError(data.message);
      } else {
        setGlobalError("Registration failed: " + (err.message || "Unknown error."));
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Register</h2>
        {globalError && <p className="global-error">{globalError}</p>}
        <form onSubmit={handleSubmit} className="register-form">
          {Object.entries(fieldLabels).map(([key, label]) => (
            <div key={key} className="form-group">
              <label>{label}</label>
              {key === "role" ? (
                <select name={key} value={formData[key]} onChange={handleChange}>
                  {roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              ) : key === "city" ? (
                <select name={key} value={formData[key]} onChange={handleChange}>
                  {turkishCities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              ) : (
                <input
                  type={key === "password" ? "password" : "text"}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  required
                />
              )}
              {errors[key] && <p className="error">{errors[key]}</p>}
            </div>
          ))}
          <button type="submit" className="submit-btn">Sign Up</button>
        </form>
      </div>
    </div>
  );
}
