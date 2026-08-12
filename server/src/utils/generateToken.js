import jwt from 'jsonwebtoken';

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'spotify_clone_secret_key_12345', {
    expiresIn: '30d',
  });
};
