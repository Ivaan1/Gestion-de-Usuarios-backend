const userSchema = require('./user.schema');
const clientSchema = require('./client.schema');
const companySchema = require('./company.schema');
const projectSchema = require('./project.schema.js');
const albaranSchema = require('./albaranes.schema.js');

module.exports = {
  components: {
    schemas: {
        ...userSchema,
        ...clientSchema,
        ...companySchema,
        ...projectSchema,
        ...albaranSchema
    }
  }
};