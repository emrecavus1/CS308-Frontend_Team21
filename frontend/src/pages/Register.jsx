import React, { useState } from 'react';

const fieldLabels = {
  email: 'Email',
  password: 'Password',
  name: 'Name',
  surname: 'Surname',
  role: 'Role',
  city: 'City',
  phoneNumber: 'Phone Number',
  specificAddress: 'Specific Address',
};

// dropdown options
const turkishCities = [
  'ADANA','ADIYAMAN','AFYONKARAHISAR','AĞRI','AMASYA','ANKARA','ANTALYA','ARTVİN','AYDIN',
  'BALIKESİR','BİLECİK','BİNGÖL','BİTLİS','BOLU','BURDUR','BURSA','ÇANAKKALE','ÇANKIRI',
  'ÇORUM','DENİZLİ','DİYARBAKIR','EDİRNE','ELAZIĞ','ERZİNCAN','ERZURUM','ESKİŞEHİR',
  'GAZİANTEP','GİRESUN','GÜMÜŞHANE','HAKKARİ','HATAY','ISPARTA','MERSİN','İSTANBUL',
  'İZMİR','KARS','KASTAMONU','KAYSERİ','KIRKLARELİ','KIRŞEHİR','KOCAELİ','KONYA','KÜTAHYA',
  'MALATYA','MANİSA','KARAMAN','KIRIKKALE','BATMAN','ŞIRNAK','BARTIN','ARDAHAN','IĞDIR',
  'YALOVA','KARABÜK','KİLİS','OSMANİYE','DÜZCE'
];
const roles = ['Customer', 'Product Manager', 'Sales Manager'];

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    surname: '',
    role: roles[0],
    city: turkishCities[0],
    phoneNumber: '',
    specificAddress: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [globalError, setGlobalError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setGlobalError('');

    try {
      const response = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Successfully registered!');
        return;
      }

      const data = await response.json();
      if (data.errors) {
        const errors = {};
        data.errors.forEach(err => {
          const [label, msg] = err.split(': ');
          const key = Object.entries(fieldLabels)
            .find(([, lab]) => lab === label.trim())?.[0];
          if (key) errors[key] = msg;
        });
        setFieldErrors(errors);
      } else {
        setGlobalError(data);
      }
    } catch (err) {
      setGlobalError('Network error: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-xl bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6">Register</h2>

        {globalError && (
          <div className="flex items-center text-red-600 mb-4 text-base">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-[1em] h-[1em] inline-block mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{globalError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {Object.entries(fieldLabels).map(([key, label]) => {
            // render dropdown for role
            if (key === 'role') {
              return (
                <div key={key} className="flex flex-col">
                  <label htmlFor={key} className="mb-2 font-medium">
                    {label}:
                  </label>
                  <select
                    id={key}
                    name={key}
                    value={formData.role}
                    onChange={handleChange}
                    required
                    className="w-1/2 h-30 px-4 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    {roles.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  {fieldErrors.role && (
                    <div className="flex items-center text-red-600 mt-1 text-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-[1em] h-[1em] inline-block mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor" strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{fieldErrors.role}</span>
                    </div>
                  )}
                </div>
              );
            }

            // render dropdown for city
            if (key === 'city') {
              return (
                <div key={key} className="flex flex-col">
                  <label htmlFor={key} className="mb-2 font-medium">
                    {label}:
                  </label>
                  <select
                    id={key}
                    name={key}
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-1/2 h-30 px-4 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    {turkishCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  {fieldErrors.city && (
                    <div className="flex items-center text-red-600 mt-1 text-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-[1em] h-[1em] inline-block mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor" strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{fieldErrors.city}</span>
                    </div>
                  )}
                </div>
              );
            }

            // render text/password inputs
            return (
              <div key={key} className="flex flex-col">
                <label htmlFor={key} className="mb-2 font-medium">
                  {label}:
                </label>
                <input
                  id={key}
                  name={key}
                  type={key === 'password' ? 'password' : 'text'}
                  value={formData[key]}
                  onChange={handleChange}
                  required
                  className="w-1/2 h-30 px-4 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {fieldErrors[key] && (
                  <div className="flex items-center text-red-600 mt-1 text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-[1em] h-[1em] inline-block mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{fieldErrors[key]}</span>
                  </div>
                )}
              </div>
            );
          })}

          <button
            type="submit"
            className="mt-8 bg-blue-500 text-white text-xl font-semibold py-3 px-8 rounded-xl hover:bg-blue-600 transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
