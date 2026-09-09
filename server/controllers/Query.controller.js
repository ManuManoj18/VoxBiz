import Database from "../models/Database.model.js";
import { executeQuery } from "../services/DatabaseService.js";
import Groq from "groq-sdk";
import { Sequelize } from "sequelize";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// =============================================================
// SCHEMA CACHE
// =============================================================

const dbSchemaCache = {};

// =============================================================
// SENSITIVE FIELDS
// =============================================================

const SENSITIVE_FIELDS = new Set([
  "password",
  "passwordHash",
  "connectionURI",
  "connectionUri",
  "token",
  "secret",
  "apiKey",
  "accessToken",
  "refreshToken",
  "privateKey",
  "clientSecret",
  "authorization",
  "cookie",
  "session",
]);

// =============================================================
// GROQ API
// =============================================================

export async function callGroqAPI(prompt) {
  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not configured.");
    }

    const modelName = "openai/gpt-oss-120b";

    const result = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: modelName,
      temperature: 0.2,
      top_p: 0.9,
      max_tokens: 2048,
    });

    return result.choices?.[0]?.message?.content?.trim() || "";
  } catch (error) {
    console.error("Groq API error:", error.message);
    throw new Error("Failed to generate response with Groq API.");
  }
}

// =============================================================
// DATABASE DIALECT
// =============================================================

function getDialect(dbType) {
  const type = String(dbType || "").toLowerCase();

  if (
    type === "postgres" ||
    type === "postgresql" ||
    type === "postgresql database"
  ) {
    return "postgres";
  }

  if (
    type === "mysql" ||
    type === "mysql database"
  ) {
    return "mysql";
  }

  throw new Error(`Unsupported database type: ${dbType}`);
}

// =============================================================
// CHECK SENSITIVE COLUMN
// =============================================================

function isSensitiveField(fieldName) {
  if (!fieldName) {
    return false;
  }

  return SENSITIVE_FIELDS.has(String(fieldName));
}

// =============================================================
// SAFE SCHEMA FILTER
// =============================================================

function filterSensitiveColumns(columns) {
  return columns
    .filter((column) => {
      const name = String(column.column_name || "");
      return !isSensitiveField(name);
    })
    .map((column) => ({
      name: column.column_name,
      type: column.data_type,
    }));
}

// =============================================================
// GET DATABASE SCHEMA
// =============================================================

async function getDatabaseSchema(databaseId, userId) {
  if (!databaseId || !userId) {
    throw new Error("Database ID and user ID are required.");
  }

  // ===========================================================
  // VERIFY OWNERSHIP BEFORE USING CACHE
  // ===========================================================

  const dbEntry = await Database.findOne({
    where: {
      id: databaseId,
      userId,
    },
  });

  if (!dbEntry) {
    throw new Error("Database not found or access denied.");
  }

  // ===========================================================
  // CACHE
  // ===========================================================

  if (dbSchemaCache[databaseId]) {
    console.log(
      "📦 Using cached DB schema for:",
      databaseId
    );

    return dbSchemaCache[databaseId];
  }

  if (!dbEntry.connectionURI) {
    throw new Error(
      "Database connection information is missing."
    );
  }

  let tempSequelize;

  try {
    const {
      connectionURI,
      databaseName,
      dbType,
    } = dbEntry;

    const dialect = getDialect(dbType);

    console.log(
      "📡 Reading external DB schema:",
      databaseName
    );

    // =========================================================
    // SSL DETECTION
    // =========================================================

    const isSSL =
      connectionURI.includes("sslmode=require") ||
      connectionURI.includes("ssl=true") ||
      connectionURI.includes("avn");

    // =========================================================
    // TEMPORARY CONNECTION
    // =========================================================

    const sequelizeOptions = {
      dialect,
      logging: false,
    };

    if (isSSL) {
      sequelizeOptions.dialectOptions = {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      };
    }

    tempSequelize = new Sequelize(
      connectionURI,
      sequelizeOptions
    );

    // Verify connection before reading schema
    await tempSequelize.authenticate();

    // =========================================================
    // GET TABLES
    // =========================================================

    let tablesQuery;

    if (dialect === "postgres") {
      tablesQuery = `
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_type = 'BASE TABLE'
        ORDER BY table_name;
      `;
    } else {
      tablesQuery = `
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = DATABASE()
          AND table_type = 'BASE TABLE'
        ORDER BY table_name;
      `;
    }

    const [tablesResult] =
      await tempSequelize.query(tablesQuery);

    const tables = tablesResult.map(
      (row) => row.table_name
    );

    const schema = {};

    // =========================================================
    // GET COLUMNS FOR EVERY TABLE
    // =========================================================

    for (const table of tables) {
      let columnsQuery;

      if (dialect === "postgres") {
        columnsQuery = `
          SELECT
            column_name,
            data_type
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = :table
          ORDER BY ordinal_position;
        `;
      } else {
        columnsQuery = `
          SELECT
            column_name,
            data_type
          FROM information_schema.columns
          WHERE table_schema = DATABASE()
            AND table_name = :table
          ORDER BY ordinal_position;
        `;
      }

      const [columnsResult] =
        await tempSequelize.query(
          columnsQuery,
          {
            replacements: {
              table,
            },
          }
        );

      const safeColumns =
        filterSensitiveColumns(columnsResult);

      schema[table] = safeColumns;
    }

    console.log(
      "📦 Safe schema loaded for:",
      databaseName
    );

    // =========================================================
    // CACHE SAFE SCHEMA ONLY
    // =========================================================

    dbSchemaCache[databaseId] = schema;

    return schema;
  } catch (error) {
    console.error(
      "❌ Schema loading error:",
      error.message
    );

    throw new Error(
      "Unable to read the selected database schema."
    );
  } finally {
    if (tempSequelize) {
      try {
        await tempSequelize.close();
      } catch (closeError) {
        console.error(
          "⚠️ Error closing database connection:",
          closeError.message
        );
      }
    }
  }
}

// =============================================================
// EXTRACT SQL FROM GROQ RESPONSE
// =============================================================

function extractSQL(response) {
  if (!response) {
    return "";
  }

  let sql = response.trim();

  // Remove markdown fences
  sql = sql
    .replace(/^```sql\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  // Remove accidental leading/trailing explanation
  const selectIndex = sql.search(/\bSELECT\b/i);

  if (selectIndex > 0) {
    sql = sql.substring(selectIndex);
  }

  // Remove trailing semicolon
  sql = sql
    .replace(/;+\s*$/, "")
    .trim();

  return sql;
}

// =============================================================
// SQL SAFETY VALIDATION
// =============================================================

function validateSQL(sql) {
  if (!sql || !sql.trim()) {
    return {
      valid: false,
      error: "Generated SQL is empty.",
    };
  }

  const normalized = sql.trim();

  // ===========================================================
  // ONLY SELECT
  // ===========================================================

  if (!/^SELECT\b/i.test(normalized)) {
    return {
      valid: false,
      error: "Only SELECT queries are allowed.",
    };
  }

  // ===========================================================
  // NO MULTIPLE STATEMENTS
  // ===========================================================

  if (normalized.includes(";")) {
    return {
      valid: false,
      error:
        "Multiple SQL statements are not allowed.",
    };
  }

  // ===========================================================
  // BLOCK WRITE / ADMIN OPERATIONS
  // ===========================================================

  const forbiddenSQL =
    /\b(INSERT|UPDATE|DELETE|DROP|ALTER|TRUNCATE|CREATE|GRANT|REVOKE|MERGE|REPLACE|CALL|EXEC|EXECUTE|COPY|VACUUM|ANALYZE|COMMENT|SET|RESET)\b/i;

  if (forbiddenSQL.test(normalized)) {
    return {
      valid: false,
      error: "Unsafe SQL query blocked.",
    };
  }

  // ===========================================================
  // BLOCK COMMENTS
  // ===========================================================

  if (
    normalized.includes("--") ||
    normalized.includes("/*") ||
    normalized.includes("*/")
  ) {
    return {
      valid: false,
      error: "SQL comments are not allowed.",
    };
  }

  // ===========================================================
  // BLOCK SENSITIVE FIELD ACCESS
  // ===========================================================

  const sensitivePattern =
    /\b(password|passwordHash|connectionURI|connectionUri|token|secret|apiKey|accessToken|refreshToken|privateKey|clientSecret|authorization|cookie|session)\b/i;

  if (sensitivePattern.test(normalized)) {
    return {
      valid: false,
      error:
        "Query attempts to access a protected field.",
    };
  }

  // ===========================================================
  // BLOCK SYSTEM / INFORMATION SCHEMA ACCESS
  // ===========================================================

  const systemTablePattern =
    /\b(pg_catalog|pg_authid|pg_roles|pg_shadow|information_schema)\b/i;

  if (systemTablePattern.test(normalized)) {
    return {
      valid: false,
      error:
        "System database tables cannot be queried.",
    };
  }

  // ===========================================================
  // BLOCK DATABASE CONNECTION FUNCTIONS
  // ===========================================================

  const dangerousFunctionPattern =
    /\b(dblink|dblink_connect|lo_import|lo_export|pg_read_file|pg_write_file|pg_ls_dir|load_file)\s*\(/i;

  if (dangerousFunctionPattern.test(normalized)) {
    return {
      valid: false,
      error:
        "Restricted database functions are not allowed.",
    };
  }

  return {
    valid: true,
  };
}

// =============================================================
// SANITIZE QUERY RESULTS
// =============================================================

function sanitizeResults(result) {
  if (!Array.isArray(result)) {
    return result;
  }

  return result.map((row) => {
    const cleanRow = {};

    Object.entries(row).forEach(
      ([key, value]) => {
        if (!isSensitiveField(key)) {
          cleanRow[key] = value;
        }
      }
    );

    return cleanRow;
  });
}

// =============================================================
// PROCESS NATURAL LANGUAGE QUERY
// =============================================================

export const processQuery = async (req, res) => {
  try {
    console.log(
      "🔍 Processing natural language database query..."
    );

    // =========================================================
    // AUTHENTICATED USER
    // =========================================================

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        error: "Authentication required.",
      });
    }

    // =========================================================
    // REQUEST DATA
    // =========================================================

    const { databaseId } = req.params;
    const { transcript } = req.body;

    if (!databaseId) {
      return res.status(400).json({
        error: "Database ID is required.",
      });
    }

    if (
      !transcript ||
      typeof transcript !== "string" ||
      !transcript.trim()
    ) {
      return res.status(400).json({
        error: "Transcript is required.",
      });
    }

    const cleanTranscript =
      transcript.trim();

    // =========================================================
    // BLOCK DESTRUCTIVE NATURAL-LANGUAGE REQUESTS
    // =========================================================

    const destructiveRequestPattern =
      /\b(delete|remove|update|modify|change|insert|add|create|drop|alter|truncate|destroy|erase|clear)\b/i;

    if (
      destructiveRequestPattern.test(
        cleanTranscript
      )
    ) {
      console.warn(
        "🚫 Destructive natural-language request blocked:",
        cleanTranscript
      );

      return res.status(400).json({
        error:
          "This database is read-only. INSERT, UPDATE, DELETE, DROP, ALTER, TRUNCATE, and other data-changing operations are not allowed.",
      });
    }

    // =========================================================
    // STEP 1 — DATABASE OWNERSHIP CHECK
    // =========================================================

    const dbEntry = await Database.findOne({
      where: {
        id: databaseId,
        userId,
      },
    });

    if (!dbEntry) {
      console.warn(
        "🚫 Unauthorized database query attempt:",
        {
          databaseId,
          userId,
        }
      );

      return res.status(403).json({
        error:
          "You are not connected to this database.",
      });
    }

    // =========================================================
    // STEP 2 — GET SAFE DATABASE SCHEMA
    // =========================================================

    const schema =
      await getDatabaseSchema(
        databaseId,
        userId
      );

    if (
      !schema ||
      typeof schema !== "object"
    ) {
      return res.status(400).json({
        error:
          "Database schema is not available.",
      });
    }

    // =========================================================
    // STEP 3 — GENERATE SQL
    // =========================================================

    const queryGenerationPrompt = `

You are a database SQL generation engine.

Generate ONE safe PostgreSQL SELECT query from the user's natural-language request.

DATABASE SCHEMA:

${JSON.stringify(schema, null, 2)}

USER REQUEST:

"${cleanTranscript}"

IMPORTANT:

The database is READ-ONLY.

If the user asks to modify, delete, insert, update, create, alter, drop, truncate, remove, destroy, erase, or otherwise change data or database structure, DO NOT generate SQL.

For any such request, return exactly:

UNSAFE_REQUEST

RULES:

1. Generate exactly ONE SELECT statement for safe read-only requests.

2. Never generate:

INSERT
UPDATE
DELETE
DROP
ALTER
TRUNCATE
CREATE
GRANT
REVOKE
MERGE
REPLACE
CALL
EXEC
EXECUTE
COPY
VACUUM
ANALYZE

3. Only use tables that exist in the supplied schema.

4. Only use columns that exist in the supplied schema.

5. Never invent tables.

6. Never invent columns.

7. Never invent relationships between tables.

8. Only use JOIN when the supplied schema clearly supports it.

9. Never access sensitive fields.

10. Never access:

password
passwordHash
connectionURI
token
secret
apiKey
accessToken
refreshToken
privateKey
clientSecret

11. Always quote table names exactly as they appear in the schema.

12. Quote camelCase column names using double quotes.

13. If aggregation is requested, use the appropriate aggregate function.

14. If ranking is requested:

   - highest → ORDER BY calculated value DESC
   - lowest → ORDER BY calculated value ASC

15. If the user requests one highest result:

   ORDER BY ... DESC LIMIT 1

16. If the user requests one lowest result:

   ORDER BY ... ASC LIMIT 1

17. "past month" means exactly one month.

18. "past 3 months" means exactly three months.

19. "past 6 months" means exactly six months.

20. "past year" means exactly one year.

21. "past week" means exactly one week.

22. "last 30 days" means exactly 30 days.

23. Do not invent a different time period.

24. Understand minor speech-to-text errors.

25. Return ONLY SQL for safe requests.

26. Return ONLY UNSAFE_REQUEST for destructive requests.

Do not use markdown.

Do not provide explanations.

Do not provide multiple queries.

`;

    const groqQueryResponse =
      await callGroqAPI(
        queryGenerationPrompt
      );

    // =========================================================
    // BLOCK UNSAFE AI RESPONSE
    // =========================================================

    if (
      groqQueryResponse
        .trim()
        .toUpperCase() === "UNSAFE_REQUEST"
    ) {
      console.warn(
        "🚫 Groq identified destructive request:",
        cleanTranscript
      );

      return res.status(400).json({
        error:
          "This database is read-only. Data-changing operations are not allowed.",
      });
    }

    const sqlQuery =
      extractSQL(groqQueryResponse);

    console.log(
      "🔹 Generated SQL:",
      sqlQuery
    );

    // =========================================================
    // STEP 4 — SQL SAFETY CHECK
    // =========================================================

    const validation =
      validateSQL(sqlQuery);

    if (!validation.valid) {
      console.warn(
        "🚫 Unsafe SQL blocked:",
        validation.error
      );

      return res.status(400).json({
        error: validation.error,
      });
    }

    // =========================================================
    // STEP 5 — DATABASE DESCRIPTION
    // =========================================================

    const descriptionPrompt = `

Describe this database schema in simple English.

Database name:

${dbEntry.databaseName}

Schema:

${JSON.stringify(schema, null, 2)}

Explain:

1. What kind of data the database contains.

2. The important tables.

3. What the tables represent.

4. Any relationships that can be clearly inferred from the schema.

Do not mention passwords, connection strings, tokens, secrets, or credentials.

Keep the response under 250 words.

Return only plain text.

`;

    const naturalDescription =
      await callGroqAPI(
        descriptionPrompt
      );

    // =========================================================
    // STEP 6 — SQL EXPLANATION
    // =========================================================

    const reasoningPrompt = `

Explain the following SQL query in simple terms.

SQL:

${sqlQuery}

User request:

"${cleanTranscript}"

Explain only the observable SQL behavior.

Mention:

- tables used
- columns used
- filters
- joins
- aggregation
- sorting
- limits

Do not reveal hidden reasoning or chain-of-thought.

Keep the explanation under 150 words.

Return only the explanation.

`;

    const reasoning =
      await callGroqAPI(
        reasoningPrompt
      );

    // =========================================================
    // STEP 7 — EXECUTE QUERY
    // =========================================================

    const result =
      await executeQuery(
        dbEntry,
        sqlQuery
      );

    // =========================================================
    // STEP 8 — SANITIZE RESULTS
    // =========================================================

    const sanitizedData =
      sanitizeResults(result);

    // =========================================================
    // STEP 9 — RESPONSE
    // =========================================================

    return res.status(200).json({
      success: true,
      sql: sqlQuery,
      data: sanitizedData,
      naturalDescription:
        naturalDescription.trim(),
      reasoning:
        reasoning.trim(),
    });

  } catch (error) {
    console.error(
      "❌ NLP query processing error:",
      error.message
    );

    return res.status(500).json({
      error:
        "Failed to process the natural language query.",
    });
  }
};

// =============================================================
// EXPORT SCHEMA FUNCTION
// =============================================================

export { getDatabaseSchema };