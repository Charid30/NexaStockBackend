// src/controllers/admin.roles.controller.js
const svc                = require('../services/admin.roles.service');
const { success, error } = require('../utils/response.util');

const listRoles = async (req, res) => {
  try {
    const { type } = req.query;
    const roles = await svc.listRoles(type);
    return success(res, roles);
  } catch (err) {
    return error(res, err.message);
  }
};

const getRole = async (req, res) => {
  try {
    const role = await svc.getRole(req.params.id);
    return success(res, role);
  } catch (err) {
    return error(res, err.message);
  }
};

const createRole = async (req, res) => {
  try {
    const role = await svc.createRole(req.body);
    return success(res, role, 'Rôle créé avec succès', 201);
  } catch (err) {
    return error(res, err.message);
  }
};

const updateRole = async (req, res) => {
  try {
    const role = await svc.updateRole(req.params.id, req.body);
    return success(res, role, 'Rôle mis à jour');
  } catch (err) {
    return error(res, err.message);
  }
};

const deleteRole = async (req, res) => {
  try {
    const result = await svc.deleteRole(req.params.id);
    return success(res, result, 'Rôle supprimé');
  } catch (err) {
    return error(res, err.message);
  }
};

const listPermissions = async (req, res) => {
  try {
    const perms = await svc.listPermissions();
    return success(res, perms);
  } catch (err) {
    return error(res, err.message);
  }
};

const getRolePermissions = async (req, res) => {
  try {
    const perms = await svc.getRolePermissions(req.params.id);
    return success(res, perms);
  } catch (err) {
    return error(res, err.message);
  }
};

const setRolePermissions = async (req, res) => {
  try {
    const { permission_ids } = req.body;
    const perms = await svc.setRolePermissions(req.params.id, permission_ids || []);
    return success(res, perms, 'Permissions mises à jour');
  } catch (err) {
    return error(res, err.message);
  }
};

module.exports = {
  listRoles, getRole, createRole, updateRole, deleteRole,
  listPermissions, getRolePermissions, setRolePermissions,
};
