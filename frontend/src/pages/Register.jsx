import React, { useState } from "react";
import axios from "axios";
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

const Register = () => {
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

  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGlobalError("");

    try {
      const response = await axios.post("http://localhost:8080/api/auth/signup", formData);
      if (response.status === 200 || response.status === 201) {
        alert("Successfully registered!");
      }
    } catch (error) {
      const data = error.response?.data;
      if (data?.errors) {
        const errorObj = {};
        data.errors.forEach((err) => {
          const [label, msg] = err.split(": ");
          const key = Object.entries(fieldLabels).find(([, lab]) => lab === label.trim())?.[0];
          if (key) errorObj[key] = msg;
        });
        setErrors(errorObj);
      } else {
        setGlobalError("Registration failed: " + (data || error.message));
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Register</h2>
        {globalError && <p className="global-error">{globalError}</p>}
        <form onSubmit={handleSubmit} className="register-form">
          {Object.entries(fieldLabels).map(([key, label]) => {
            if (key === "role") {
              return (
                <div key={key} className="form-group">
                  <label>{label}</label>
                  <select name={key} value={formData[key]} onChange={handleChange} required>
                    {roles.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                  {errors[key] && <p className="error">{errors[key]}</p>}
                </div>
              );
            }
            if (key === "city") {
              return (
                <div key={key} className="form-group">
                  <label>{label}</label>
                  <select name={key} value={formData[key]} onChange={handleChange} required>
                    {turkishCities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  {errors[key] && <p className="error">{errors[key]}</p>}
                </div>
              );
            }
            return (
              <div key={key} className="form-group">
                <label>{label}</label>
                <input
                  type={key === "password" ? "password" : "text"}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  required
                />
                {errors[key] && <p className="error">{errors[key]}</p>}
              </div>
            );
          })}
          <button type="submit" className="submit-btn">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
