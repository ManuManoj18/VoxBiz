import Database from "../models/Database.model.js";
import Groq from 'groq-sdk';
import { getDatabaseSchema } from "./Query.controller.js"; // Assuming this is exported

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Get natural language descriptions of all databases for the current user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Natural language descriptions of all user databases
 */
export const getDatabaseNaturalDescriptions = async (req, res) => {
    try {
      console.log("🔍 Generating natural language descriptions for user databases...");
      const userId = req.user.id;
      
      // Get all databases for the current user - removed dbType from attributes
      const databases = await Database.findAll({
        where: { userId },
        attributes: ['id', 'databaseName',  'connectionURI']
      });
  
      if (!databases || databases.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No databases found for this user",
          databases: []
        });
      }
  
      // Process each database to get schema and natural language description
      const databaseDescriptions = [];

for (const database of databases) {
  try {
    const schema = await getDatabaseSchema(database.id);

    if (!schema || typeof schema !== "object") {
      databaseDescriptions.push({
        id: database.id,
        name: database.databaseName,
        type: "database",
        naturalDescription: "Could not generate schema information for this database",
        error: "Invalid schema"
      });
      continue;
    }

    const tables = Object.keys(schema);
    const relationships = {};

    for (const sourceTable of tables) {
      const columns = schema[sourceTable];

      for (const column of columns) {
        if (column.name.endsWith('_id')) {
          const potentialEntity = column.name.replace('_id', '');
          for (const targetTable of tables) {
            const singularTarget = targetTable.endsWith('s') ? targetTable.slice(0, -1) : targetTable;
            if (potentialEntity === targetTable || potentialEntity === singularTarget) {
              const relationKey = JSON.stringify([targetTable, sourceTable]);
              if (!relationships[relationKey]) {
                relationships[relationKey] = {
                  [`${targetTable}.id`]: `${sourceTable}.${column.name}`
                };
              }
            }
          }
        }
      }
    }

    const prompt = `
Generate a natural language description of this database schema:

Database Name: ${database.databaseName}

Schema:
${JSON.stringify(schema, null, 2)}

Relationships:
${JSON.stringify(relationships, null, 2)}

Rules:
1. Describe the database structure in clear, non-technical language that a business user would understand
2. Explain what kind of data is stored in this database
3. Mention important tables and their relationships
4. Suggest 3-5 example questions that could be asked of this database
5. Keep the description under 300 words
6. Format your response in this JSON structure:
{
  "summary": "Brief 1-2 sentence overview",
  "tableDescriptions": {
    "tableName": "description of table purpose and important columns"
  },
  "relationships": "Description of how tables relate to each other",
  "exampleQueries": ["Example question 1", "Example question 2"]
}
`;

    const groqResponse = await callGroqAPI(prompt);

    let naturalDescription;
    try {
      const jsonMatch = groqResponse.match(/\{[\s\S]*\}/);
      naturalDescription = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

      if (!naturalDescription) {
        throw new Error("Failed to parse natural description");
      }
    } catch (error) {
      console.warn(`Failed to parse description for database ${database.id}:`, error.message);
      naturalDescription = {
        summary: "Database schema available but description generation failed",
        tableDescriptions: {},
        relationships: "Could not generate relationship descriptions",
        exampleQueries: ["What tables are in this database?"]
      };
    }

    databaseDescriptions.push({
      id: database.id,
      name: database.databaseName,
      type: "database",
      naturalDescription,
      tableCount: tables.length,
      tables: tables,
      hasSchema: true
    });

    // ✅ Wait 1 second before next Groq call to avoid rate limit
    await new Promise(resolve => setTimeout(resolve, 1000));

  } catch (error) {
    console.error(`Error processing database ${database.id}:`, error);
    databaseDescriptions.push({
      id: database.id,
      name: database.databaseName,
      type: "database",
      naturalDescription: {
        summary: "Could not analyze this database",
        tableDescriptions: {},
        relationships: "No information available",
        exampleQueries: ["Is this database connected properly?"]
      },
      tableCount: 0,
      tables: [],
      hasSchema: false,
      error: error.message
    });
  }
}
  
      return res.status(200).json({
        success: true,
        databases: databaseDescriptions
      });
  
    } catch (error) {
      console.error("❌ Error generating database descriptions:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to generate database descriptions",
        error: error.message
      });
    }
  };
  async function callGroqAPI(prompt) {
    try {
      const modelName = "llama-3.3-70b-versatile";
      
      const result = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: modelName,
        temperature: 0.7,
        top_p: 0.95,
        max_tokens: 2048,
      });
      
      return result.choices[0]?.message?.content || "";
    } catch (error) {
      console.error("Groq API error:", error);
      throw new Error("Failed to generate response with Groq API");
    }
  }