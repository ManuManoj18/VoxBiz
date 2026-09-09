import Database from "../models/Database.model.js";
import { Sequelize } from "sequelize";
import sequelize from "../config/Database.config.js";
import { getDatabaseSchema, callGroqAPI } from "./Query.controller.js";
import { differenceInDays } from "date-fns";

/**
 * Detect database dialect from database type or connection URI.
 */
const getDialect = (type, connectionURI) => {
  if (type) {
    const normalizedType = type.toLowerCase();

    if (
      normalizedType === "postgres" ||
      normalizedType === "postgresql"
    ) {
      return "postgres";
    }

    if (normalizedType === "mysql") {
      return "mysql";
    }

    return null;
  }

  if (
    connectionURI.startsWith("postgres://") ||
    connectionURI.startsWith("postgresql://")
  ) {
    return "postgres";
  }

  if (connectionURI.startsWith("mysql://")) {
    return "mysql";
  }

  return null;
};

/**
 * Create a safe database object for API responses.
 *
 * IMPORTANT:
 * Never send connectionURI to the frontend because it can contain
 * database credentials.
 */
const sanitizeDatabase = (database) => {
  const plainDatabase = database.get
    ? database.get({ plain: true })
    : database;

  return {
    id: plainDatabase.id,
    name: plainDatabase.databaseName,
    type: plainDatabase.dbType || "PostgreSQL",
    role: plainDatabase.role,
    createdAt: plainDatabase.createdAt,
    updatedAt: plainDatabase.updatedAt,
  };
};

/**
 * Create a new database entry.
 */
export const createDatabase = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const { databaseName, connectionURI } = req.body;
    const userId = req.user.id;

    if (!connectionURI) {
      return res.status(400).json({
        success: false,
        error: "Missing connection URI",
      });
    }

    let finalName = databaseName;

    try {
      if (!finalName) {
        finalName = new URL(connectionURI).pathname.slice(1);
      }
    } catch {
      return res.status(400).json({
        success: false,
        error: "Invalid connection URI format",
      });
    }

    if (!finalName) {
      return res.status(400).json({
        success: false,
        error: "Database name is required",
      });
    }

    // Check if this user already has a database with this name.
    const existingDatabase = await Database.findOne({
      where: {
        userId,
        databaseName: finalName,
      },
    });

    if (existingDatabase) {
      return res.status(400).json({
        success: false,
        error: "You already have a database with this name",
      });
    }

    const dialect = getDialect(null, connectionURI);

    if (!dialect) {
      return res.status(400).json({
        success: false,
        error: "Unsupported or unknown database type",
      });
    }

    /**
     * Verify the external database connection before storing it.
     */
    try {
      const tempSequelize = new Sequelize(connectionURI, {
        dialect,
        logging: false,
        dialectOptions: {
          connectTimeout: 10000,
        },
      });

      await tempSequelize.authenticate();
      await tempSequelize.close();

      console.log("✅ Connection test successful:", dialect);
    } catch (connError) {
      console.error(
        "❌ Connection test failed:",
        connError?.name || "Database connection error"
      );

      return res.status(400).json({
        success: false,
        error: "Failed to connect with the provided database",
      });
    }

    /**
     * Store database ownership.
     */
    const database = await Database.create({
      userId,
      databaseName: finalName,
      connectionURI,
      role: "owner",
      dbType: dialect === "postgres" ? "PostgreSQL" : "MySQL",
    });

    /**
     * Cache schema after successful database creation.
     *
     * IMPORTANT:
     * Pass userId so getDatabaseSchema can enforce ownership.
     */
    try {
      await getDatabaseSchema(database.id, userId);
      console.log("✅ Schema cached for new database");
    } catch (schemaError) {
      console.warn(
        "⚠️ Could not cache schema:",
        schemaError?.message || "Schema caching failed"
      );
    }

    return res.status(201).json({
      success: true,
      message: "Database created successfully",
      database: sanitizeDatabase(database),
    });
  } catch (error) {
    console.error(
      "❌ Failed to create database:",
      error?.name || "Unknown error"
    );

    return res.status(500).json({
      success: false,
      error: "Failed to create database",
    });
  }
};

/**
 * Connect to an existing database.
 * Connected databases are stored as read-only.
 */
export const connectDatabase = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const {
      databaseName,
      connectionURI,
      sslRequired = false,
      type,
    } = req.body;

    const userId = req.user.id;

    if (!connectionURI) {
      return res.status(400).json({
        success: false,
        error: "Missing connection URI",
      });
    }

    let finalName = databaseName;

    try {
      if (!finalName) {
        finalName = new URL(connectionURI).pathname.slice(1);
      }
    } catch {
      return res.status(400).json({
        success: false,
        error: "Invalid connection URI format",
      });
    }

    if (!finalName) {
      return res.status(400).json({
        success: false,
        error: "Database name is required",
      });
    }

    // Check ownership/name only for this authenticated user.
    const existingDatabase = await Database.findOne({
      where: {
        userId,
        databaseName: finalName,
      },
    });

    if (existingDatabase) {
      return res.status(400).json({
        success: false,
        error: "You have already connected this database",
      });
    }

    const dialect = getDialect(type, connectionURI);

    if (!dialect) {
      return res.status(400).json({
        success: false,
        error:
          "Unsupported database type. Only PostgreSQL and MySQL are supported.",
      });
    }

    /**
     * SSL configuration.
     *
     * rejectUnauthorized=true is safer for production because it verifies
     * the database server certificate.
     */
    const dialectOptions = {
      connectTimeout: 10000,
    };

    if (
      sslRequired ||
      connectionURI.includes("sslmode=require")
    ) {
      dialectOptions.ssl = {
        require: true,
        rejectUnauthorized: true,
      };
    }

    /**
     * Test external database connection.
     */
    try {
      const tempSequelize = new Sequelize(connectionURI, {
        dialect,
        logging: false,
        dialectOptions,
      });

      await tempSequelize.authenticate();
      await tempSequelize.close();

      console.log("✅ Connection successful:", dialect);
    } catch (connError) {
      console.error(
        "❌ Connection test failed:",
        connError?.name || "Database connection error"
      );

      return res.status(400).json({
        success: false,
        error: "Failed to connect with the provided database",
      });
    }

    /**
     * Store database with read-only role.
     */
    const database = await Database.create({
      userId,
      databaseName: finalName,
      connectionURI,
      role: "read-only",
      dbType: dialect === "postgres" ? "PostgreSQL" : "MySQL",
    });

    return res.status(201).json({
      success: true,
      message: "Database connected successfully",
      database: sanitizeDatabase(database),
    });
  } catch (error) {
    console.error(
      "❌ Failed to connect database:",
      error?.name || "Unknown error"
    );

    return res.status(500).json({
      success: false,
      error: "Failed to connect database",
    });
  }
};

/**
 * Get all databases belonging to the authenticated user.
 */
export const listDatabases = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const userId = req.user.id;

    const databases = await Database.findAll({
      where: {
        userId,
      },
    });

    const plainDatabases = databases.map((db) => {
      const {
        id,
        databaseName,
        role,
        updatedAt,
        dbType,
      } = db.get({ plain: true });

      return {
        id,
        name: databaseName,
        accessLevel: role,
        lastAccessed: updatedAt,
        type: dbType || "PostgreSQL",
      };
    });

    console.log(`Databases found: ${databases.length}`);

    return res.status(200).json(plainDatabases);
  } catch (error) {
    console.error(
      "❌ Failed to fetch databases:",
      error?.name || "Unknown error"
    );

    return res.status(500).json({
      success: false,
      error: "Failed to fetch databases",
    });
  }
};

/**
 * Get detailed information about a database.
 *
 * IMPORTANT:
 * The database must belong to the authenticated user.
 */
export const getDatabaseInfo = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { id } = req.params;
    const userId = req.user.id;

    if (!id || id.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Invalid database ID",
      });
    }

    const now = new Date();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    /**
     * OWNERSHIP CHECK
     *
     * This prevents User A from accessing User B's database
     * simply by changing the database ID in the URL.
     */
    const dbRecord = await Database.findOne({
      where: {
        id,
        userId,
      },
    });

    if (!dbRecord) {
      return res.status(404).json({
        success: false,
        message: "Database not found",
      });
    }

    /**
     * Query logs are stored in the application's own database.
     */
    const logs = await sequelize.query(
      `
      SELECT success, response_time, timestamp
      FROM query_logs
      WHERE database_id = :id
      `,
      {
        replacements: { id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    let totalQueries = 0;
    let successRate = "0%";
    let avgResponseTime = "0s";
    let lastQueried = null;

    const queryFrequency = Array(7).fill(0);

    if (logs && logs.length > 0) {
      totalQueries = logs.length;

      const successfulQueries = logs.filter(
        (log) => log.success
      ).length;

      avgResponseTime = (
        logs.reduce(
          (sum, log) =>
            sum + parseFloat(log.response_time || 0),
          0
        ) / totalQueries
      ).toFixed(2);

      successRate =
        ((successfulQueries / totalQueries) * 100).toFixed(1) + "%";

      lastQueried = logs.reduce((latest, log) => {
        const ts = new Date(log.timestamp);
        return ts > latest ? ts : latest;
      }, new Date(0));

      const last7DaysLogs = logs.filter(
        (log) =>
          new Date(log.timestamp) >= sevenDaysAgo
      );

      last7DaysLogs.forEach((log) => {
        const dayDiff = differenceInDays(
          now,
          new Date(log.timestamp)
        );

        if (dayDiff >= 0 && dayDiff < 7) {
          queryFrequency[6 - dayDiff] += 1;
        }
      });
    }

    /**
     * Get tables from the application's connected PostgreSQL database.
     *
     * NOTE:
     * This currently assumes PostgreSQL for this dashboard query.
     * If MySQL databases need full dashboard support later, we should
     * add a separate information-schema query for MySQL.
     */
    let tables = [];

    if (
      dbRecord.dbType === "PostgreSQL" ||
      !dbRecord.dbType
    ) {
      const tableResult = await sequelize.query(
        `
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        `,
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );

      tables = tableResult.map(
        (row) => row.table_name
      );
    }

    /**
     * Get schema for Groq recommendations.
     *
     * Ownership has already been verified above.
     *
     * IMPORTANT:
     * Pass userId so getDatabaseSchema can enforce ownership.
     */
    const schema = await getDatabaseSchema(id, userId);

    const recommendationPrompt = `
Based on the following database schema:

${JSON.stringify(schema)}

Generate 5-7 insightful and relevant natural language questions that are strictly suitable for graphical or tabular data visualizations.

These should include:

- Quantitative comparisons over time
- Aggregations
- Trends and patterns
- Rankings or distributions
- Grouped statistics

Examples:

- "What is the monthly sales trend over the last year?"
- "Which products had the highest returns last quarter?"
- "Show the average response time per endpoint in the last 7 days"
- "Display user signups by week"
- "How many orders were placed per category?"

Return only a JSON array of strings:

["Question 1", "Question 2", "Question 3"]
`;

    let recommendedQuestions = [];

    try {
      const recommendationResponse =
        await callGroqAPI(recommendationPrompt);

      const jsonMatch =
        recommendationResponse.match(
          /\[[\s\S]*\]/
        );

      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);

        if (Array.isArray(parsed)) {
          recommendedQuestions = parsed
            .filter(
              (question) =>
                typeof question === "string"
            )
            .slice(0, 7);
        }
      }
    } catch (err) {
      console.warn(
        "⚠️ Failed to generate recommendations:",
        err?.message || "Unknown error"
      );
    }

    /**
     * IMPORTANT:
     * connectionURI is intentionally NOT included.
     *
     * It may contain database credentials.
     */
    const dbInfo = {
      id: dbRecord.id,
      name: dbRecord.databaseName,
      type: dbRecord.dbType || "PostgreSQL",
      status: "Connected",
      lastAccessed:
        lastQueried || dbRecord.updatedAt,
      permissions:
        dbRecord.role || "read-only",
      createdAt: dbRecord.createdAt,
      totalQueries,
      successRate,
      avgResponseTime: `${avgResponseTime}`,
      queryFrequency,
      tables,
      recommendedQuestions,
    };

    return res.status(200).json(dbInfo);
  } catch (error) {
    console.error(
      "❌ Error in getDatabaseInfo:",
      error?.name || "Unknown error"
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/**
 * Disconnect a database.
 *
 * A user can only disconnect a database that belongs to them.
 * Owners cannot disconnect their own database.
 */
export const disconnectDatabase = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const { databaseId } = req.params;
    const userId = req.user.id;

    const database = await Database.findOne({
      where: {
        id: databaseId,
        userId,
      },
    });

    if (!database) {
      return res.status(404).json({
        success: false,
        error: "Database not found",
      });
    }

    if (database.role === "owner") {
      return res.status(403).json({
        success: false,
        error: "Owners cannot disconnect their own database",
      });
    }

    await database.destroy();

    return res.status(200).json({
      success: true,
      message: "Database disconnected successfully",
    });
  } catch (error) {
    console.error(
      "❌ Failed to disconnect database:",
      error?.name || "Unknown error"
    );

    return res.status(500).json({
      success: false,
      error: "Failed to disconnect database",
    });
  }
};