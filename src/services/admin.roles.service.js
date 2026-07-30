// src/services/admin.roles.service.js
const { Role, Permission } = require('../models');
const { invalidatePermissionCache } = require('../middlewares/permission.middleware');

const listRoles = async (type) => {
  const where = type ? { type } : {};
  return Role.findAll({ where, order: [['type', 'ASC'], ['label', 'ASC']] });
};

const getRole = async (id) => {
  const role = await Role.findByPk(id, {
    include: [{ association: 'permissions' }],
  });
  if (!role) throw new Error('Rôle introuvable');
  return role;
};

const createRole = async ({ type, name, label, description }) => {
  const existing = await Role.findOne({ where: { name } });
  if (existing) throw new Error('Un rôle avec ce nom existe déjà');

  return Role.create({ type, name, label, description, is_system: 0 });
};

const updateRole = async (id, { label, description }) => {
  const role = await Role.findByPk(id);
  if (!role) throw new Error('Rôle introuvable');

  await role.update({ label, description });
  return role;
};

const deleteRole = async (id) => {
  const role = await Role.findByPk(id);
  if (!role) throw new Error('Rôle introuvable');
  if (role.is_system) throw new Error('Les rôles système ne peuvent pas être supprimés');

  await role.update({ del: 1 });
  return { deleted: true };
};

const listPermissions = async () => {
  return Permission.findAll({ order: [['module', 'ASC'], ['action', 'ASC']] });
};

const getRolePermissions = async (roleId) => {
  const role = await Role.findByPk(roleId, {
    include: [{ association: 'permissions' }],
  });
  if (!role) throw new Error('Rôle introuvable');
  return role.permissions;
};

const setRolePermissions = async (roleId, permissionIds) => {
  const role = await Role.findByPk(roleId);
  if (!role) throw new Error('Rôle introuvable');

  const perms = await Permission.findAll({ where: { id: permissionIds } });
  await role.setPermissions(perms);
  invalidatePermissionCache();

  return getRolePermissions(roleId);
};

module.exports = {
  listRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
  listPermissions,
  getRolePermissions,
  setRolePermissions,
};
