import { Sequelize } from "sequelize";

/**
 * Get Sequelize dialect from database type.
 */
const getDialect = (dbType = "") => {
    const type = dbType.toLowerCase();

    if (type === "postgres" || type === "postgresql") {
        return "postgres";
    }

    if (type === "mysql") {
        return "mysql";
    }

    throw new Error(`Unsupported database type: ${dbType}`);
};

/**
 * Allow only read-only SELECT queries.
 *
 * This is a second security layer.
 * Query.controller.js should also validate the generated SQL.
 */
const validateReadOnlyQuery = (sqlQuery) => {
    if (typeof sqlQuery !== "string" || !sqlQuery.trim()) {
        throw new Error("Invalid SQL query.");
    }

    const normalized = sqlQuery
        .trim()
        .replace(/^```(?:sql)?/i, "")
        .replace(/```$/i, "")
        .trim();

    // Only SELECT statements are allowed.
    if (!/^select\b/i.test(normalized)) {
        throw new Error("Only SELECT queries are allowed.");
    }

    // Prevent multiple statements.
    if (normalized.includes(";")) {
        throw new Error("Multiple SQL statements are not allowed.");
    }

    // Block write/admin operations.
    const blockedKeywords = [
        "insert",
        "update",
        "delete",
        "drop",
        "alter",
        "truncate",
        "create",
        "grant",
        "revoke",
        "comment",
        "rename",
        "replace",
        "merge",
        "call",
        "execute",
    ];

    const blockedPattern = new RegExp(
        `\\b(${blockedKeywords.join("|")})\\b`,
        "i"
    );

    if (blockedPattern.test(normalized)) {
        throw new Error("Potentially unsafe SQL operation detected.");
    }

    // Prevent SQL comments from being used to bypass validation.
    if (normalized.includes("--") || normalized.includes("/*") || normalized.includes("*/")) {
        throw new Error("SQL comments are not allowed.");
    }

    return normalized;
};

/**
 * Executes a read-only SQL query on a user-selected database.
 *
 * @param {Object} dbEntry - Database record belonging to the authenticated user.
 * @param {string} sqlQuery - SQL SELECT query.
 * @returns {Promise<Array>} Query result.
 */
export const executeQuery = async (dbEntry, sqlQuery) => {
    let sequelize;

    try {
        if (!dbEntry) {
            throw new Error("Database configuration not found.");
        }

        if (!dbEntry.connectionURI) {
            throw new Error("Database connection information is missing.");
        }

        // Security layer: validate query before connecting.
        const safeQuery = validateReadOnlyQuery(sqlQuery);

        const dialect = getDialect(dbEntry.dbType);

        const sequelizeOptions = {
            dialect,
            logging: false,
            pool: {
                max: 1,
                min: 0,
                idle: 1000,
                acquire: 10000,
            },
        };

        // Create a fresh connection for this request.
        sequelize = new Sequelize(
            dbEntry.connectionURI,
            sequelizeOptions
        );

        // Verify connection.
        await sequelize.authenticate();

        console.log(
            `✅ Database connection established (${dialect})`
        );

        // Execute the validated read-only query.
        const [results] = await sequelize.query(safeQuery);

        console.log("✅ Read-only query executed successfully.");

        return results;

    } catch (error) {
        console.error(
            "❌ Database query execution error:",
            error.message
        );

        throw new Error(
            error.message || "Failed to execute query."
        );

    } finally {
        // Always close the dynamic database connection.
        if (sequelize) {
            try {
                await sequelize.close();
                console.log("🔌 Database connection closed.");
            } catch (closeError) {
                console.error(
                    "❌ Error closing database connection:",
                    closeError.message
                );
            }
        }
    }
};