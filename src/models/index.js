// src/models/index.js
const { sequelize } = require('../config/database');

const Role              = require('./Role')(sequelize);
const Permission        = require('./Permission')(sequelize);
const Tenant            = require('./Tenant')(sequelize);
const TenantModule      = require('./TenantModule')(sequelize);
const User              = require('./User')(sequelize);
const RefreshToken      = require('./RefreshToken')(sequelize);
const Site              = require('./Site')(sequelize);
const UserSite          = require('./UserSite')(sequelize);
const Category          = require('./Category')(sequelize);
const Unit              = require('./Unit')(sequelize);
const Product           = require('./Product')(sequelize);
const StockLevel        = require('./StockLevel')(sequelize);
const StockMovement     = require('./StockMovement')(sequelize);
const Supplier          = require('./Supplier')(sequelize);
const PurchaseOrder     = require('./PurchaseOrder')(sequelize);
const PurchaseOrderItem = require('./PurchaseOrderItem')(sequelize);
const Alert             = require('./Alert')(sequelize);
const AlertLog          = require('./AlertLog')(sequelize);
const Sale              = require('./Sale')(sequelize);
const SaleItem          = require('./SaleItem')(sequelize);

// ─── Tenant ↔ TenantModule ────────────────────────────────────────────────────
Tenant.hasMany(TenantModule, { foreignKey: 'tenant_id', as: 'modules' });
TenantModule.belongsTo(Tenant, { foreignKey: 'tenant_id', as: 'tenant' });

// ─── Tenant ↔ User ────────────────────────────────────────────────────────────
Tenant.hasMany(User, { foreignKey: 'tenant_id', as: 'users' });
User.belongsTo(Tenant, { foreignKey: 'tenant_id', as: 'tenant' });

// ─── User ↔ RefreshToken ──────────────────────────────────────────────────────
User.hasMany(RefreshToken, { foreignKey: 'user_id', as: 'refreshTokens' });
RefreshToken.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// ─── Tenant ↔ Site ────────────────────────────────────────────────────────────
Tenant.hasMany(Site, { foreignKey: 'tenant_id', as: 'sites' });
Site.belongsTo(Tenant, { foreignKey: 'tenant_id', as: 'tenant' });

// ─── User ↔ Site (many-to-many via user_sites) ────────────────────────────────
User.belongsToMany(Site, { through: UserSite, foreignKey: 'user_id', as: 'sites' });
Site.belongsToMany(User, { through: UserSite, foreignKey: 'site_id', as: 'users' });

// ─── Tenant ↔ Category (hiérarchie) ──────────────────────────────────────────
Tenant.hasMany(Category, { foreignKey: 'tenant_id', as: 'categories' });
Category.belongsTo(Tenant, { foreignKey: 'tenant_id', as: 'tenant' });
Category.hasMany(Category, { foreignKey: 'parent_id', as: 'children' });
Category.belongsTo(Category, { foreignKey: 'parent_id', as: 'parent' });

// ─── Tenant ↔ Unit ────────────────────────────────────────────────────────────
Tenant.hasMany(Unit, { foreignKey: 'tenant_id', as: 'units' });
Unit.belongsTo(Tenant, { foreignKey: 'tenant_id', as: 'tenant' });

// ─── Tenant ↔ Product ─────────────────────────────────────────────────────────
Tenant.hasMany(Product, { foreignKey: 'tenant_id', as: 'products' });
Product.belongsTo(Tenant, { foreignKey: 'tenant_id', as: 'tenant' });
Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
Unit.hasMany(Product, { foreignKey: 'unit_id', as: 'products' });
Product.belongsTo(Unit, { foreignKey: 'unit_id', as: 'unit' });

// ─── Product ↔ StockLevel ─────────────────────────────────────────────────────
Product.hasMany(StockLevel, { foreignKey: 'product_id', as: 'stockLevels' });
StockLevel.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
Site.hasMany(StockLevel, { foreignKey: 'site_id', as: 'stockLevels' });
StockLevel.belongsTo(Site, { foreignKey: 'site_id', as: 'site' });

// ─── Product ↔ StockMovement ──────────────────────────────────────────────────
Product.hasMany(StockMovement, { foreignKey: 'product_id', as: 'movements' });
StockMovement.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
Site.hasMany(StockMovement, { foreignKey: 'site_id', as: 'movements' });
StockMovement.belongsTo(Site, { foreignKey: 'site_id', as: 'sourceSite' });
Site.hasMany(StockMovement, { foreignKey: 'destination_site_id', as: 'incomingMovements' });
StockMovement.belongsTo(Site, { foreignKey: 'destination_site_id', as: 'destinationSite' });
User.hasMany(StockMovement, { foreignKey: 'created_by', as: 'movements' });
StockMovement.belongsTo(User, { foreignKey: 'created_by', as: 'author' });

// ─── Tenant ↔ Supplier ────────────────────────────────────────────────────────
Tenant.hasMany(Supplier, { foreignKey: 'tenant_id', as: 'suppliers' });
Supplier.belongsTo(Tenant, { foreignKey: 'tenant_id', as: 'tenant' });

// ─── Supplier ↔ PurchaseOrder ─────────────────────────────────────────────────
Supplier.hasMany(PurchaseOrder, { foreignKey: 'supplier_id', as: 'orders' });
PurchaseOrder.belongsTo(Supplier, { foreignKey: 'supplier_id', as: 'supplier' });
Site.hasMany(PurchaseOrder, { foreignKey: 'site_id', as: 'orders' });
PurchaseOrder.belongsTo(Site, { foreignKey: 'site_id', as: 'site' });
User.hasMany(PurchaseOrder, { foreignKey: 'created_by', as: 'orders' });
PurchaseOrder.belongsTo(User, { foreignKey: 'created_by', as: 'author' });

// ─── PurchaseOrder ↔ PurchaseOrderItem ────────────────────────────────────────
PurchaseOrder.hasMany(PurchaseOrderItem, { foreignKey: 'purchase_order_id', as: 'items' });
PurchaseOrderItem.belongsTo(PurchaseOrder, { foreignKey: 'purchase_order_id', as: 'order' });
Product.hasMany(PurchaseOrderItem, { foreignKey: 'product_id', as: 'orderItems' });
PurchaseOrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// ─── Product ↔ Alert ──────────────────────────────────────────────────────────
Product.hasMany(Alert, { foreignKey: 'product_id', as: 'alerts' });
Alert.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
Site.hasMany(Alert, { foreignKey: 'site_id', as: 'alerts' });
Alert.belongsTo(Site, { foreignKey: 'site_id', as: 'site' });

// ─── Sale ↔ SaleItem ──────────────────────────────────────────────────────────
Tenant.hasMany(Sale, { foreignKey: 'tenant_id', as: 'sales' });
Sale.belongsTo(Tenant, { foreignKey: 'tenant_id', as: 'tenant' });
Site.hasMany(Sale, { foreignKey: 'site_id', as: 'sales' });
Sale.belongsTo(Site, { foreignKey: 'site_id', as: 'site' });
User.hasMany(Sale, { foreignKey: 'user_id', as: 'sales' });
Sale.belongsTo(User, { foreignKey: 'user_id', as: 'cashier' });
Sale.hasMany(SaleItem, { foreignKey: 'sale_id', as: 'items' });
SaleItem.belongsTo(Sale, { foreignKey: 'sale_id', as: 'sale' });
Product.hasMany(SaleItem, { foreignKey: 'product_id', as: 'saleItems' });
SaleItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// ─── Role ↔ Permission (many-to-many) ────────────────────────────────────────
const RolePermission = sequelize.define('role_permissions', {}, { timestamps: false });
Role.belongsToMany(Permission, { through: RolePermission, foreignKey: 'role_id',       as: 'permissions' });
Permission.belongsToMany(Role, { through: RolePermission, foreignKey: 'permission_id', as: 'roles' });

// ─── Alert ↔ AlertLog ─────────────────────────────────────────────────────────
Alert.hasMany(AlertLog, { foreignKey: 'alert_id', as: 'logs' });
AlertLog.belongsTo(Alert, { foreignKey: 'alert_id', as: 'alert' });
Product.hasMany(AlertLog, { foreignKey: 'product_id', as: 'alertLogs' });
AlertLog.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
Site.hasMany(AlertLog, { foreignKey: 'site_id', as: 'alertLogs' });
AlertLog.belongsTo(Site, { foreignKey: 'site_id', as: 'site' });
User.hasMany(AlertLog, { foreignKey: 'read_by', as: 'readAlertLogs' });
AlertLog.belongsTo(User, { foreignKey: 'read_by', as: 'reader' });

module.exports = {
  sequelize,
  Role,
  Permission,
  Tenant,
  TenantModule,
  User,
  RefreshToken,
  Site,
  UserSite,
  Category,
  Unit,
  Product,
  StockLevel,
  StockMovement,
  Supplier,
  PurchaseOrder,
  PurchaseOrderItem,
  Alert,
  AlertLog,
  Sale,
  SaleItem,
};
