import { createUser, findByEmail, generateAccessToken, generateRefreshToken } from './service.js';
import { errorResponse, successResponse } from '../../utils/helpers.js';

export const register = async (req, res, next) => {
  try {
    const { email, password, full_name, role } = req.body;

    if (!email || !password) {
      return res.status(400).json(errorResponse('Email and password are required', 400));
    }

    const existingUser = await findByEmail(email);
    if (existingUser) {
      return res.status(409).json(errorResponse('Email already exists', 409));
    }

    const user = await createUser({ email, password, full_name, role });

    return res.status(201).json(
      successResponse(
        {
          id: user._id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
        },
        'User registered successfully',
        201
      )
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json(errorResponse('Email and password are required', 400));
    }

    const user = await findByEmail(email);
    if (!user) {
      return res.status(401).json(errorResponse('Invalid credentials', 401));
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json(errorResponse('Invalid credentials', 401));
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return res.status(200).json(
      successResponse(
        {
          accessToken,
          refreshToken,
          tokenType: 'Bearer',
          user: {
            id: user._id,
            email: user.email,
            full_name: user.full_name,
            role: user.role,
          },
        },
        'Login successful',
        200
      )
    );
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res) => {
  return res.status(200).json(
    successResponse(
      {
        status: 'mock',
        message: 'Email verification flow will be completed in the next phase',
      },
      'Email verification endpoint ready',
      200
    )
  );
};