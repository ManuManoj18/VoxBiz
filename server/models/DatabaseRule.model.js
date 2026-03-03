// models/DatabaseRule.model.js
import { DataTypes } from "sequelize";
import sequelize from "../config/Database.config.js";
import Database from "./Database.model.js";

const DatabaseRule = sequelize.define("DatabaseRule", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  databaseId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Database,
      key: "id",
    },
    onDelete: "CASCADE",
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  queryTypes: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
    defaultValue: [],
    validate: {
      isValidQueryType(value) {
        const validTypes = ["SELECT", "INSERT", "UPDATE", "DELETE", "JOIN"];
        if (!Array.isArray(value) || value.some(type => !validTypes.includes(type))) {
          throw new Error("Invalid query type specified");
        }
      }
    }
  },
  conditions: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: [],
  },
  maskingPolicies: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: [],
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
});

// Establish relationships
Database.hasMany(DatabaseRule, { foreignKey: "databaseId", onDelete: "CASCADE" });
DatabaseRule.belongsTo(Database, { foreignKey: "databaseId" });

export default DatabaseRule;