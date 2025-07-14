// รายการตำแหน่งและสิทธิ์การใช้งานเริ่มต้น
const roles = [
  {
    name: 'Admin',
    permissions: [
      'manage_users',
      'manage_roles',
      'manage_products',
      'view_sales_history',
      'manage_settings',
      'create_sale',
      'view_products'
    ],
  },
  {
    name: 'Sales',
    permissions: ['create_sale', 'view_products'],
  },
  {
    name: 'Stock Manager',
    permissions: ['manage_products', 'view_products'],
  },
];

export default roles;
