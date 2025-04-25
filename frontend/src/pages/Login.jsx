// src/pages/Login.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [fieldErrors, setFieldErrors] = useState({})
  const [globalError, setGlobalError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData(f => ({ ...f, [e.target.name]: e.target.value }))
    setFieldErrors(fe => ({ ...fe, [e.target.name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGlobalError('')
    setFieldErrors({})

    try {
      const res = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        if (res.status === 401) {
          // explicit 401 handling
          setGlobalError('Either email or password is wrong, please check again.')
          return
        }

        // for any other error, try to parse JSON if present
        let errBody = {}
        try {
          errBody = await res.json()
        } catch (_) {
          // ignore JSON parse failures
        }

        if (errBody.field) {
          setFieldErrors(fe => ({ ...fe, [errBody.field]: errBody.message }))
        } else {
          setGlobalError(errBody.message || 'Login failed')
        }
        return
      }

      const { token } = await res.json()
      localStorage.setItem('token', token)
      navigate('/')
    } catch (err) {
      setGlobalError('Network error: ' + err.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6">Log In</h2>

        {globalError && (
          <div className="flex items-center text-red-600 mb-4 text-base">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-[1em] h-[1em] inline-block mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{globalError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1 font-medium">
              Email:
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-1/2 h-30 px-4 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {fieldErrors.email && (
              <div className="flex items-center text-red-600 mt-1 text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[1em] h-[1em] inline-block mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{fieldErrors.email}</span>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 font-medium">
              Password:
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-1/2 h-30 px-4 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {fieldErrors.password && (
              <div className="flex items-center text-red-600 mt-1 text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[1em] h-[1em] inline-block mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{fieldErrors.password}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="mt-8 bg-blue-500 text-white text-xl font-semibold py-3 px-8 rounded-xl hover:bg-blue-600 transition"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}
