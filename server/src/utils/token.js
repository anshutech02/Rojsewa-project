import jwt from 'jsonwebtoken';

export const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '2m',
  });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
  });
};

export const sendTokenResponse = (user, statusCode, res) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  console.log("new access token", accessToken);
  console.log("new refresh token", refreshToken)
  const isProd = process.env.NODE_ENV === "production";



  // Set cookie options
 const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  path: "/",
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
};

  res.cookie('refreshToken', refreshToken, cookieOptions);
  

  res.status(statusCode).json({
    success: true,
    accessToken,
    user,
  });
};
