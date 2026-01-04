import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import './Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await userAPI.login(username, password);
      
      if (response.data.success) {
        // Čuvanje tokena i korisničkih podataka
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Preusmjeravanje na admin panel ili početnu stranicu
        if (response.data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Greška pri prijavi. Molimo pokušajte ponovo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="login-container">
        <div className="login-card card fade-in">
          <div className="login-header">
            <h1 className="login-title">Prijava</h1>
            <p className="login-subtitle">Prijavite se za pristup sistemu</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="error-message">
                <span>⚠️</span> {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="username">Korisničko ime</label>
              <input
                id="username"
                type="text"
                className="input"
                placeholder="Unesite korisničko ime"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Lozinka</label>
              <input
                id="password"
                type="password"
                className="input"
                placeholder="Unesite lozinku"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading"></span>
                  Prijavljivanje...
                </>
              ) : (
                'Prijavi se'
              )}
            </button>
          </form>

          <div className="login-info">
            <p>Test korisnik: <strong>admin</strong> / <strong>admin123</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}
