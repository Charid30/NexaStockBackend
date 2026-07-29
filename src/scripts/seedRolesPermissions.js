// src/scripts/seedRolesPermissions.js
require('dotenv').config();
const { sequelize, Role, Permission } = require('../models');

const ROLES = [
  // ─── NexaLab ───────────────────────────────────────────────────────────────
  { type: 'nexalab', name: 'super_admin',          label: 'Super Administrateur',  description: 'Accès complet à la plateforme NexaStock',               is_system: 1 },
  { type: 'nexalab', name: 'nexalab_technique',    label: 'Équipe Technique',       description: 'Gestion technique de la plateforme',                    is_system: 1 },
  { type: 'nexalab', name: 'nexalab_commercial',   label: 'Équipe Commerciale',     description: 'Suivi des organisations et abonnements',                is_system: 1 },
  { type: 'nexalab', name: 'nexalab_support',      label: 'Support Client',         description: 'Assistance aux utilisateurs de la plateforme',          is_system: 1 },
  // ─── Tenant ────────────────────────────────────────────────────────────────
  { type: 'tenant',  name: 'tenant_admin',         label: 'Administrateur',         description: 'Accès complet à l\'organisation',                       is_system: 1 },
  { type: 'tenant',  name: 'manager',              label: 'Manager',                description: 'Gestion opérationnelle sans administration des comptes', is_system: 1 },
  { type: 'tenant',  name: 'caissier',             label: 'Caissier',               description: 'Enregistrement des ventes uniquement',                  is_system: 1 },
  { type: 'tenant',  name: 'magasinier',           label: 'Magasinier',             description: 'Gestion du stock et réception des commandes',            is_system: 1 },
  { type: 'tenant',  name: 'auditeur',             label: 'Auditeur',               description: 'Lecture seule sur tous les modules',                    is_system: 1 },
  { type: 'tenant',  name: 'livreur',              label: 'Livreur',                description: 'Consultation des commandes à livrer',                   is_system: 1 },
];

const MODULES = [
  { key: 'produits',      label: 'Produits' },
  { key: 'categories',    label: 'Catégories' },
  { key: 'unites',        label: 'Unités' },
  { key: 'stock',         label: 'Stock' },
  { key: 'fournisseurs',  label: 'Fournisseurs' },
  { key: 'commandes',     label: 'Commandes' },
  { key: 'alertes',       label: 'Alertes' },
  { key: 'rapports',      label: 'Rapports' },
  { key: 'ventes',        label: 'Ventes' },
  { key: 'utilisateurs',  label: 'Utilisateurs' },
  { key: 'sites',         label: 'Sites' },
  { key: 'entreprise',    label: 'Entreprise' },
];

const ACTIONS = [
  { key: 'read',   label: 'Lire' },
  { key: 'create', label: 'Créer' },
  { key: 'update', label: 'Modifier' },
  { key: 'delete', label: 'Supprimer' },
];

// Permissions par rôle : { role_name: Set of "module.action" }
const ROLE_PERMISSIONS = {
  tenant_admin: '*',
  manager: [
    'produits.read', 'produits.create', 'produits.update', 'produits.delete',
    'categories.read', 'categories.create', 'categories.update', 'categories.delete',
    'unites.read', 'unites.create', 'unites.update', 'unites.delete',
    'stock.read', 'stock.create', 'stock.update',
    'fournisseurs.read', 'fournisseurs.create', 'fournisseurs.update',
    'commandes.read', 'commandes.create', 'commandes.update',
    'alertes.read',
    'rapports.read',
    'ventes.read', 'ventes.create',
    'utilisateurs.read', 'utilisateurs.create', 'utilisateurs.update',
    'sites.read',
    'entreprise.read',
  ],
  caissier: [
    'produits.read',
    'categories.read',
    'unites.read',
    'ventes.read', 'ventes.create',
    'alertes.read',
  ],
  magasinier: [
    'produits.read', 'produits.create', 'produits.update',
    'categories.read',
    'unites.read',
    'stock.read', 'stock.create', 'stock.update',
    'fournisseurs.read',
    'commandes.read', 'commandes.update',
    'alertes.read',
  ],
  auditeur: [
    'produits.read', 'categories.read', 'unites.read',
    'stock.read', 'fournisseurs.read', 'commandes.read',
    'alertes.read', 'rapports.read', 'ventes.read',
    'utilisateurs.read', 'sites.read', 'entreprise.read',
  ],
  livreur: [
    'commandes.read',
  ],
};

async function seed() {
  await sequelize.authenticate();
  console.log('✔ Connexion DB ok');

  // 1. Upsert roles
  for (const r of ROLES) {
    const [role] = await Role.findOrCreate({ where: { name: r.name }, defaults: r });
    await role.update({ label: r.label, description: r.description, is_system: r.is_system });
  }
  console.log(`✔ ${ROLES.length} rôles insérés/mis à jour`);

  // 2. Upsert permissions
  const permMap = {};
  for (const mod of MODULES) {
    for (const act of ACTIONS) {
      const key = `${mod.key}.${act.key}`;
      const [perm] = await Permission.findOrCreate({
        where: { module: mod.key, action: act.key },
        defaults: { module: mod.key, action: act.key, label: `${mod.label} — ${act.label}` },
      });
      permMap[key] = perm;
    }
  }
  console.log(`✔ ${Object.keys(permMap).length} permissions insérées/mises à jour`);

  // 3. Associer permissions aux rôles tenant
  for (const [roleName, perms] of Object.entries(ROLE_PERMISSIONS)) {
    const role = await Role.findOne({ where: { name: roleName } });
    if (!role) continue;

    if (perms === '*') {
      await role.setPermissions(Object.values(permMap));
    } else {
      await role.setPermissions(perms.map((k) => permMap[k]).filter(Boolean));
    }
    console.log(`✔ Permissions définies pour "${roleName}"`);
  }

  console.log('\n✅ Seed terminé avec succès');
  await sequelize.close();
}

seed().catch((err) => {
  console.error('❌ Erreur seed:', err.message);
  process.exit(1);
});
