// services/EnhancedQueryExecutionService.js
import { executeQuery } from "./QueryExecutionService.js";
import { RuleService } from "./RuleService.js";
import Database from "../models/Database.model.js";

/**
 * Execute SQL queries with rule enforcement
 */
export class EnhancedQueryExecutionService {
  /**
   * Execute a query with rule enforcement
   * @param {string} databaseId - The database ID
   * @param {string} sqlQuery - The SQL query to execute
   * @returns {Promise<Object>} Query results with metadata
   */
  static async executeWithRules(databaseId, sqlQuery) {
    try {
      // Step 1: Get the database
      const database = await Database.findByPk(databaseId);
      if (!database) {
        throw new Error("Database not found");
      }
      
      // Step 2: Process the query through rules
      const { modifiedQuery, appliedRules } = await RuleService.processQuery(databaseId, sqlQuery);
      
      // Step 3: Execute the modified query
      const results = await executeQuery(database, modifiedQuery);
      
      // Step 4: Apply masking to results
      const maskedResults = await RuleService.processResults(databaseId, results);
      
      // Return results with metadata
      return {
        originalQuery: sqlQuery,
        executedQuery: modifiedQuery,
        appliedRules: appliedRules.map(rule => ({ id: rule.id, name: rule.name })),
        results: maskedResults
      };
    } catch (error) {
      console.error("Error executing query with rules:", error);
      throw new Error("Failed to execute query: " + error.message);
    }
  }
}