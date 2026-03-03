import Database from "../models/Database.model.js";
import User from "../models/User.model.js";
import { Sequelize } from "sequelize";
import sequelize from '../config/Database.config.js'; // your pg client instance


import { getDatabaseSchema } from "./Query.controller.js"; // Adjust path as needed
import { callGroqAPI } from "./Query.controller.js"; // Ensure it's exported
import { differenceInDays } from "date-fns"; // If not already imported

// Create a new database entry
export const createDatabase = async (req, res) => {
  try {
    console.log("Create database route hit ->", req.user);
    console.log("Body received ->", req.body);
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized: Missing user information" });
    }

    const { databaseName, connectionURI } = req.body;
    const userId = req.user.id;

    if (!connectionURI) {
      return res.status(400).json({ error: "Missing connection URI" });
    }

    let finalName = databaseName;
    try {
      if (!finalName) {
        finalName = new URL(connectionURI).pathname.slice(1);
      }
    } catch (err) {
      return res.status(400).json({ error: "Invalid connection URI format" });
    }

    // Check if database already exists for this user
    const existingDatabase = await Database.findOne({
      where: { userId, databaseName: finalName }
    });

    if (existingDatabase) {
      return res.status(400).json({ error: "You already have a database with this name" });
    }

    // Verify connection before creating
    try {
      // Use getDatabaseSchema to validate the connection
     // Detect dialect from URI
let dialect;
if (connectionURI.startsWith("postgres://") || connectionURI.startsWith("postgresql://")) {
  dialect = "postgres";
} else if (connectionURI.startsWith("mysql://")) {
  dialect = "mysql";
} else {
  return res.status(400).json({ error: "Unsupported or unknown database type." });
}

const tempSequelize = new Sequelize(connectionURI, {
  dialect,
  logging: false,
  dialectOptions: {
    ssl: false,
    connectTimeout: 10000,
  },
});
      
      
      // Test the connection
      await tempSequelize.authenticate();
      console.log("✅ Connection test successful for new database");
      await tempSequelize.close();
    } catch (connError) {
      console.error("❌ Connection test failed:", connError.message);
      return res.status(400).json({ 
        error: "Failed to connect with the provided URI",
        details: connError.message
      });
    }

    // Create the database entry with owner role
    const database = await Database.create({
      userId,
      databaseName: finalName,
      connectionURI,
      role: "owner",
      dbType: dialect === "postgres" ? "PostgreSQL" : "MySQL"
    });

    // Immediately cache the schema
    try {
      await getDatabaseSchema(database.id);
      console.log("✅ Schema cached for new database");
    } catch (schemaError) {
      console.warn("⚠️ Could not cache schema:", schemaError.message);
      // Continue even if schema caching fails
    }

    res.status(201).json({
      success: true,
      message: "Database created successfully",
      database
    });
  } catch (error) {
    console.error("Failed to create database:", error);
    res.status(500).json({ error: "Failed to create database" });
  }
};

// Connect to an existing database (read-only role)


// Connect to an existing database (with SSL support for PostgreSQL/MySQL)
export const connectDatabase = async (req, res) => {
  try {
    console.log("route hit ->>", req.user);
    console.log("Body received ->", req.body);

    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized: Missing user information" });
    }

    const { databaseName, connectionURI, sslRequired = false, type } = req.body;
    const userId = req.user.id;

    if (!connectionURI) {
      return res.status(400).json({ error: "Missing connection URI" });
    }

    let finalName = databaseName;
    try {
      if (!finalName) {
        finalName = new URL(connectionURI).pathname.slice(1);
      }
    } catch (err) {
      return res.status(400).json({ error: "Invalid connection URI format" });
    }

    const existingDatabase = await Database.findOne({
      where: { userId, databaseName: finalName }
    });

    if (existingDatabase) {
      return res.status(400).json({ error: "You have already connected this database" });
    }

    // Validate the `type` field and set dialect
    let dialect;
    if (type) {
      const supportedTypes = ["postgresql", "mysql"];
      if (!supportedTypes.includes(type.toLowerCase())) {
        return res.status(400).json({ error: "Unsupported database type. Only 'postgres' and 'mysql' are supported." });
      }
      dialect = type.toLowerCase();
    } else {
      // Fallback: infer from URI
      if (connectionURI.startsWith("postgres://") || connectionURI.startsWith("postgresql://")) {
        dialect = "postgres";
      } else if (connectionURI.startsWith("mysql://")) {
        dialect = "mysql";
      } else {
        return res.status(400).json({ error: "Could not infer database type from URI. Please specify the 'type'." });
      }
    }

    // Setup SSL options
    const sslOptions = (sslRequired || connectionURI.includes("sslmode=require")) ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    } : {};

    // Test connection
    try {
      const tempSequelize = new Sequelize(connectionURI, {
        dialect,
        logging: false,
        dialectOptions: {
          ...sslOptions,
          connectTimeout: 10000
        }
      });

      await tempSequelize.authenticate();
      console.log("✅ Connection successful:", dialect);
      await tempSequelize.close();
    } catch (connError) {
      console.error("❌ Connection test failed:", connError.message);
      return res.status(400).json({
        error: "Failed to connect with the provided URI",
        details: connError.message
      });
    }

    const database = await Database.create({
      userId,
      databaseName: finalName,
      connectionURI,
      role: "read-only",
      dbType: dialect === "postgresql" ? "PostgreSQL" : "MySQL"
    });

    res.status(201).json({
      success: true,
      message: "Database connected successfully",
      database
    });

  } catch (error) {
    console.error("Failed to connect database:", error);
    res.status(500).json({ error: "Failed to connect database" });
  }
};
// Get all databases for a user
export const listDatabases = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log("Fetching databases for user:", userId);
        const databases = await Database.findAll({
            where: { userId: req.user.id }
          });
          
          const plainDatabases = databases.map(db => {
              const { id, databaseName, role, updatedAt , dbType } = db.get({ plain: true });
              return {
                  id,
                  name: databaseName,
                  accessLevel: role,
                  lastAccessed: updatedAt,
                   type: dbType || "PostgreSQL"
              };
          });
         
        console.log("Databases found:", databases);
        res.status(200).json(plainDatabases);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch databases" });
    }
};






export const getDatabaseInfo = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id.length < 8) {
      return res.status(400).json({ success: false, message: 'Invalid database ID' });
    }

    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    const dbRecord = await Database.findByPk(id);
    if (!dbRecord) {
      return res.status(404).json({ success: false, message: 'Database not found' });
    }

    const logs = await sequelize.query(
      `SELECT success, response_time, timestamp 
       FROM query_logs 
       WHERE database_id = :id`,
      {
        replacements: { id },
        type: sequelize.QueryTypes.SELECT
      }
    );

    let totalQueries = 0;
    let successRate = "0%";
    let avgResponseTime = "0s";
    let lastQueried = null;
    let queryFrequency = Array(7).fill(0);

    if (logs && logs.length > 0) {
      totalQueries = logs.length;
      const successfulQueries = logs.filter(log => log.success).length;
      avgResponseTime = (
        logs.reduce((sum, log) => sum + parseFloat(log.response_time || 0), 0) / totalQueries
      ).toFixed(2);
      successRate = ((successfulQueries / totalQueries) * 100).toFixed(1) + '%';

      lastQueried = logs.reduce((latest, log) => {
        const ts = new Date(log.timestamp);
        return ts > latest ? ts : latest;
      }, new Date(0));

      const last7DaysLogs = logs.filter(
        log => new Date(log.timestamp) >= sevenDaysAgo
      );

      last7DaysLogs.forEach(log => {
        const dayDiff = differenceInDays(now, new Date(log.timestamp));
        if (dayDiff < 7) {
          queryFrequency[6 - dayDiff] += 1;
        }
      });
    }

    const tableResult = await sequelize.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema='public'`,
      { type: sequelize.QueryTypes.SELECT }
    );
    const tables = tableResult.map(row => row.table_name);

    // ✅ Get database schema for Groq recommendation
    const schema = await getDatabaseSchema(id);

    // ✨ Groq prompt for recommended questions
    const recommendationPrompt = `
    Based on the following PostgreSQL database schema:
    ${JSON.stringify(schema)}
    
    Generate 5-7 insightful and relevant natural language questions that are **strictly suitable for graphical or tabular data visualizations**. 
    These should include:
    - Quantitative comparisons over time
    -  aggregations
    - Trends and patterns
    - Rankings or distributions
    - Grouped statistics
    
    Examples:
    - "What is the monthly sales trend over the last year?"
    - "Which products had the highest returns last quarter?"
    - "Show the average response time per endpoint in the last 7 days"
    - "Display user signups by week"
    - "How many orders were placed per category?"
    
    Return only a JSON array of strings, like:
    ["Question 1", "Question 2", ...]
    `;

    const recommendationResponse = await callGroqAPI(recommendationPrompt);
    let recommendedQuestions = [];

    try {
      const jsonMatch = recommendationResponse.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        recommendedQuestions = JSON.parse(jsonMatch[0]);
      }
    } catch (err) {
      console.warn("⚠️ Failed to parse Groq recommendations:", err.message);
    }

    const dbInfo = {
      id: dbRecord.id,
      name: dbRecord.databaseName,
      type: dbRecord.dbType || 'PostgreSQL',
      status: 'Connected',
      lastAccessed: lastQueried || dbRecord.updatedAt,
      connectionString: dbRecord.connectionURI,
      permissions: dbRecord.role || 'read-only',
      createdAt: dbRecord.createdAt,
      totalQueries,
      successRate,
      avgResponseTime: `${avgResponseTime}`,
      queryFrequency,
      tables,
      recommendedQuestions  // ✨ Included in frontend response
    };

    return res.status(200).json(dbInfo);
  } catch (error) {
    console.error('Error in getDatabaseInfo:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
// Disconnect a database (only if it's not owned by the user)
export const disconnectDatabase = async (req, res) => {
    try {
        const { databaseId } = req.params;
        const userId = req.user.id;

        const database = await Database.findOne({ where: { id: databaseId, userId } });
        
        if (!database) {
            return res.status(404).json({ error: "Database not found" });
        }

        if (database.role === "owner") {
            return res.status(403).json({ error: "Owners cannot disconnect their own database" });
        }

        await database.destroy();
        res.status(200).json({ message: "Database disconnected successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to disconnect database" });
    }
};

