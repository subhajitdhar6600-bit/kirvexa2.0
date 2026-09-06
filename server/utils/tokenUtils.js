import jwt from 'jsonwebtoken';

const getJwtSecret = () => process.env.JWT_SECRET || 'farma_jwt_access_secret_super_secure_key_2026';
const getRefreshSecret = () => process.env.REFRESH_SECRET || 'farma_jwt_refresh_secret_super_secure_key_2026';
const getExpiresIn = () => process.env.JWT_EXPIRES_IN || '7d';
const getRefreshExpiresIn = () => process.env.REFRESH_EXPIRES_IN || '30d';

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id || user._id,
      role: user.role,
      phone: user.phone,
      email: user.email,
      kccStatus: user.kccStatus,
    },
    getJwtSecret(),
    { expiresIn: getExpiresIn() }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.id || user._id,
      role: user.role,
    },
    getRefreshSecret(),
    { expiresIn: getRefreshExpiresIn() }
  );
};

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, getJwtSecret());
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, getRefreshSecret());
  } catch (error) {
    return null;
  }
};

export default {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
