import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '12h',
  });
};

const verifyToken = (token) => {
  // console.log(`Verifying token: ${token}`);
  
  return jwt.verify(token, process.env.JWT_SECRET);
}

export { generateToken, verifyToken };
