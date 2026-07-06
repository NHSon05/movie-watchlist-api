import { prisma } from '../config/db.js';
import bcrypt from 'bcryptjs';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { generateToken } from '../utils/generateToken.js';

const register = async (req, res) => {
  const { name, email, password } = req.body;

  // check if user already exists
  const userExists = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (userExists) {
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ message: 'User already exists' });
  }

  // Hashed password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create new user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // Generate JWT token

  res.status(HTTP_STATUS.CREATED).json({
    status: 'success',
    data: {
      user: {
        id: user.id,
        name: name,
        email: email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    },
    message: 'User created successfully',
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // check if user already exists
  const userExists = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!userExists) {
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ message: 'User not found' });
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, userExists.password);

  if (!isPasswordValid) {
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ message: 'Invalid password' });
  }

  // Generate JWT token
  const token = generateToken(userExists.id, res);

  res.status(HTTP_STATUS.OK).json({
    status: 'success',
    data: {
      user: {
        id: userExists.id,
        name: userExists.name,
        email: userExists.email,
        createdAt: userExists.createdAt,
        updatedAt: userExists.updatedAt,
      },
      token,
    },
    message: 'User logged in successfully',
  });
};

const logout = async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(HTTP_STATUS.OK).json({
    status: 'success',
    message: 'User logged out successfully',
  });
};

export { register, login, logout };
