import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();
// Secret key for JWT
const SECRET = process.env.JWT_SECRET || 'ivy_homes_super_secret_key';

// 1. Login Endpoint
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  // Creating a user session dynamically
  const user = { 
    id: Date.now().toString(), 
    email: email, 
    name: email.split('@')[0] 
  };

  // Generate Tokens (Requirement 1: 30 minutes session)
  const accessToken = jwt.sign(user, SECRET, { expiresIn: '30m' });
  const refreshToken = jwt.sign(user, SECRET, { expiresIn: '7d' });

  res.json({ accessToken, refreshToken, user });
});

// 2. Refresh Token Endpoint
router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) return res.status(401).json({ message: 'No refresh token provided' });

  jwt.verify(refreshToken, SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid refresh token' });
    
    // Generate new access token
    const newAccessToken = jwt.sign({ id: user.id, email: user.email, name: user.name }, SECRET, { expiresIn: '30m' });
    res.json({ accessToken: newAccessToken });
  });
});

export default router;