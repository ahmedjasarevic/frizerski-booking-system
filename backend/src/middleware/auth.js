// Middleware za autentifikaciju korisnika
import jwt from 'jsonwebtoken';

// Provjera JWT tokena
export const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: 'Token nije priložen' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded; // Dodavanje korisničkih podataka u request
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      error: 'Neispravan ili istekao token' 
    });
  }
};

// Provjera da li je korisnik admin
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      success: false, 
      error: 'Pristup odbijen. Potrebne su admin dozvole.' 
    });
  }
};
