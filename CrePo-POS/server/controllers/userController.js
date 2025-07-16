import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import User from '../models/User.js';
import Role from '../models/Role.js';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username }).populate('role', 'name permissions');
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      username: user.username,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
  }
});

// @desc    Register a new user (by Admin)
// @route   POST /api/users
// @access  Private/Admin
const registerUser = asyncHandler(async (req, res) => {
  const { name, username, password, role: roleId } = req.body;

  const userExists = await User.findOne({ username });
  if (userExists) {
    res.status(400);
    throw new Error('ชื่อผู้ใช้นี้มีในระบบแล้ว');
  }

  const role = await Role.findById(roleId);
  if (!role) {
    res.status(400);
    throw new Error('ไม่พบตำแหน่งที่ระบุ');
  }

  const user = await User.create({ name, username, password, role: role._id });

  if (user) {
    const createdUser = await User.findById(user._id).select('-password').populate('role');
    res.status(201).json(createdUser);
  } else {
    res.status(400);
    throw new Error('ข้อมูลผู้ใช้ไม่ถูกต้อง');
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password').populate('role', 'name permissions');
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.name = req.body.name || user.name;
        user.username = req.body.username || user.username;
        if (req.body.password) {
            user.password = req.body.password;
        }
        const updatedUser = await user.save();
        const populatedUser = await User.findById(updatedUser._id).select('-password').populate('role');
        res.json({
            _id: populatedUser._id,
            name: populatedUser.name,
            username: populatedUser.username,
            role: populatedUser.role,
            token: generateToken(populatedUser._id),
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get all users (for Admin)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password').populate('role');
  res.json(users);
});

// @desc    Delete user (for Admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        if (user.username === 'admin') {
            res.status(400);
            throw new Error('ไม่สามารถลบบัญชีผู้ดูแลระบบหลักได้');
        }
        await user.deleteOne();
        res.json({ id: req.params.id, message: 'User removed' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get user by ID (for Admin)
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password').populate('role');
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user (for Admin)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        user.name = req.body.name || user.name;
        user.username = req.body.username || user.username;
        
        if (req.body.password) {
          user.password = req.body.password;
        }

        if (req.body.role) {
            const role = await Role.findById(req.body.role);
            if (!role) {
                res.status(400);
                throw new Error('Invalid role specified');
            }
            user.role = role._id;
        }

        const updatedUser = await user.save();
        const populatedUser = await User.findById(updatedUser._id).select('-password').populate('role');
        res.json(populatedUser);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});


export {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};