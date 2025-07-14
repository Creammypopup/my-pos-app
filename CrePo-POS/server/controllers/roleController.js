import asyncHandler from 'express-async-handler';
import Role from '../models/Role.js';

const getRoles = asyncHandler(async (req, res) => {
  const roles = await Role.find({});
  res.json(roles);
});

const getRoleById = asyncHandler(async (req, res) => {
  const role = await Role.findById(req.params.id);
  if (role) {
    res.json(role);
  } else {
    res.status(404);
    throw new Error('Role not found');
  }
});

const createRole = asyncHandler(async (req, res) => {
  const { name, permissions } = req.body;
  const role = new Role({ name, permissions });
  const createdRole = await role.save();
  res.status(201).json(createdRole);
});

const updateRole = asyncHandler(async (req, res) => {
  const { name, permissions } = req.body;
  const role = await Role.findById(req.params.id);
  if (role) {
    role.name = name || role.name;
    role.permissions = permissions || role.permissions;
    const updatedRole = await role.save();
    res.json(updatedRole);
  } else {
    res.status(404);
    throw new Error('Role not found');
  }
});

const deleteRole = asyncHandler(async (req, res) => {
  const role = await Role.findById(req.params.id);
  if (role) {
    await role.deleteOne();
    res.json({ message: 'Role removed' });
  } else {
    res.status(404);
    throw new Error('Role not found');
  }
});

export { getRoles, getRoleById, createRole, updateRole, deleteRole };
