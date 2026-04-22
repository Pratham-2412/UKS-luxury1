const { restrictTo } = require("./auth.middleware");

module.exports = {
  adminOnly: restrictTo("admin", "superadmin"),
  superAdminOnly: restrictTo("superadmin"),
};
