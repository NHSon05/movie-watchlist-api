import jwt from 'jsonwebtoken';
import { prisma } from '../config/db.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

// Read the token from the request
// Check if token is valid
export const authMiddleware = async (req, res, next) => {
  console.log('Auth middlewares reach');
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]; // ["Bearer", "sdjashdjkas"]
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .json({ error: 'Not authorization, no token provided' });
  }
  try {
    // Verify token and extract the user Id
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ error: 'User no longer exists' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .json({ error: `Not authorization: ${error},` });
  }
};
