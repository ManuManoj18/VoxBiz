// services/RuleService.js
 import DatabaseRule from "../models/DatabaseRule.model.js";
 import { executeQuery } from "./QueryExecutionService.js";
 import { maskData } from "./DataMaskingService.js";
 import Database from "../models/Database.model.js";
 
 /**
  * Applies database rules to SQL queries and results
  */
 export class RuleService {
   /**
    * Get all rules for a specific database
    * @param {string} databaseId - The database ID
    * @returns {Promise<Array>} List of database rules
    */
   static async getRulesByDatabaseId(databaseId) {
     return await DatabaseRule.findAll({
       where: {
         databaseId,
         active: true
       }
     });
   }
 
   /**
    * Apply masking policies to database if any are added/updated
    * @param {Object} rule - The rule with masking policies
    * @returns {Promise<void>}
    */
   static async applyMaskingPolicies(rule) {
     try {
       // Check if rule has masking policies
       if (!rule.maskingPolicies || rule.maskingPolicies.length === 0) {
         return;
       }
 
       const database = await Database.findByPk(rule.databaseId);
       if (!database) {
         throw new Error("Database not found");
       }
 
       // For each masking policy, create a function in the PostgreSQL database
       for (const policy of rule.maskingPolicies) {
         let maskFunction = "";
         const columnName = policy.column;
         const maskType = policy.type;
 
         // Determine masking function based on type
         switch (maskType) {
           case "partial":
             maskFunction = `
               CREATE OR REPLACE FUNCTION mask_${columnName}_partial()
               RETURNS TRIGGER AS $$
               BEGIN
                 IF NEW.${columnName} IS NOT NULL THEN
                   NEW.${columnName} = CONCAT(REPEAT('*', LENGTH(NEW.${columnName}) - 4), RIGHT(NEW.${columnName}, 4));
                 END IF;
                 RETURN NEW;
               END;
               $$ LANGUAGE plpgsql;
               
               DROP TRIGGER IF EXISTS mask_${columnName}_trigger ON "${database.databaseName}";
               
               CREATE TRIGGER mask_${columnName}_trigger
               BEFORE INSERT OR UPDATE ON "${database.databaseName}"
               FOR EACH ROW
               EXECUTE FUNCTION mask_${columnName}_partial();
             `;
             break;
             
           case "full":
             maskFunction = `
               CREATE OR REPLACE FUNCTION mask_${columnName}_full()
               RETURNS TRIGGER AS $$
               BEGIN
                 IF NEW.${columnName} IS NOT NULL THEN
                   NEW.${columnName} = REPEAT('*', LENGTH(NEW.${columnName}));
                 END IF;
                 RETURN NEW;
               END;
               $$ LANGUAGE plpgsql;
               
               DROP TRIGGER IF EXISTS mask_${columnName}_trigger ON "${database.databaseName}";
               
               CREATE TRIGGER mask_${columnName}_trigger
               BEFORE INSERT OR UPDATE ON "${database.databaseName}"
               FOR EACH ROW
               EXECUTE FUNCTION mask_${columnName}_full();
             `;
             break;
             
           case "hash":
             maskFunction = `
               CREATE OR REPLACE FUNCTION mask_${columnName}_hash()
               RETURNS TRIGGER AS $$
               BEGIN
                 IF NEW.${columnName} IS NOT NULL THEN
                   NEW.${columnName} = MD5(NEW.${columnName})::text;
                 END IF;
                 RETURN NEW;
               END;
               $$ LANGUAGE plpgsql;
               
               DROP TRIGGER IF EXISTS mask_${columnName}_trigger ON "${database.databaseName}";
               
               CREATE TRIGGER mask_${columnName}_trigger
               BEFORE INSERT OR UPDATE ON "${database.databaseName}"
               FOR EACH ROW
               EXECUTE FUNCTION mask_${columnName}_hash();
             `;
             break;
             
           case "custom":
             // Custom pattern would need additional parameters
             // For simplicity, defaulting to a basic pattern
             maskFunction = `
               CREATE OR REPLACE FUNCTION mask_${columnName}_custom()
               RETURNS TRIGGER AS $$
               BEGIN
                 IF NEW.${columnName} IS NOT NULL THEN
                   NEW.${columnName} = CONCAT(LEFT(NEW.${columnName}, 2), '-XXX-', RIGHT(NEW.${columnName}, 2));
                 END IF;
                 RETURN NEW;
               END;
               $$ LANGUAGE plpgsql;
               
               DROP TRIGGER IF EXISTS mask_${columnName}_trigger ON "${database.databaseName}";
               
               CREATE TRIGGER mask_${columnName}_trigger
               BEFORE INSERT OR UPDATE ON "${database.databaseName}"
               FOR EACH ROW
               EXECUTE FUNCTION mask_${columnName}_custom();
             `;
             break;
             
           case "none":
             // Remove any existing masking trigger
             maskFunction = `
               DROP TRIGGER IF EXISTS mask_${columnName}_trigger ON "${database.databaseName}";
             `;
             break;
         }
 
         // Execute the function creation SQL if needed
         if (maskFunction) {
           await executeQuery(database, maskFunction);
         }
       }
     } catch (error) {
       console.error("Error applying masking policies:", error);
       throw new Error("Failed to apply masking policies");
     }
   }
 
   /**
    * Apply conditions to modify a SQL query before execution
    * @param {Object} rule - The rule with conditions
    * @param {string} sqlQuery - Original SQL query
    * @returns {string} Modified SQL query
    */
   static applyConditionsToQuery(rule, sqlQuery) {
     if (!rule.conditions || rule.conditions.length === 0) {
       return sqlQuery;
     }
 
     let modifiedQuery = sqlQuery;
     
     // Determine query type
     const upperQuery = sqlQuery.toUpperCase().trim();
     let queryType = null;
     
     if (upperQuery.startsWith('SELECT')) queryType = 'SELECT';
     else if (upperQuery.startsWith('INSERT')) queryType = 'INSERT';
     else if (upperQuery.startsWith('UPDATE')) queryType = 'UPDATE';
     else if (upperQuery.startsWith('DELETE')) queryType = 'DELETE';
     
     // Only apply rules for matching query types
     if (!rule.queryTypes.includes(queryType)) {
       return sqlQuery;
     }
 
     // Apply each condition based on its type
     for (const condition of rule.conditions) {
       switch (condition.type) {
         case 'enforce_where':
           // Add WHERE clause or append to existing WHERE
           if (queryType === 'SELECT' || queryType === 'UPDATE' || queryType === 'DELETE') {
             if (!modifiedQuery.toUpperCase().includes(' WHERE ')) {
               modifiedQuery = `${modifiedQuery} WHERE ${condition.value}`;
             } else {
               modifiedQuery = modifiedQuery.replace(/WHERE /i, `WHERE (${condition.value}) AND `);
             }
           }
           break;
           
         case 'restrict_columns':
           // For SELECT queries, restrict columns
           if (queryType === 'SELECT') {
             const allowedColumns = condition.value.split(',').map(col => col.trim());
             
             // Very basic column extraction and replacement (would need more robust parsing in production)
             const selectPart = modifiedQuery.toUpperCase().split('FROM')[0].replace('SELECT', '').trim();
             
             if (selectPart === '*') {
               // Replace * with specific columns
               modifiedQuery = modifiedQuery.replace(/SELECT \*/i, `SELECT ${allowedColumns.join(', ')}`);
             } else {
               // Filter existing columns
               // Note: This is a simplified approach and would need a proper SQL parser in production
             }
           }
           break;
           
         case 'row_limit':
           // Add LIMIT clause for SELECT queries
           if (queryType === 'SELECT' && !modifiedQuery.toUpperCase().includes(' LIMIT ')) {
             modifiedQuery = `${modifiedQuery} LIMIT ${condition.value}`;
           }
           break;
           
         case 'time_window':
           // Add time window restriction
           // This is a simplified approach - would need specific implementation based on schema
           if (queryType === 'SELECT' && condition.value) {
             const timeField = condition.value.split(':')[0];
             const timeWindow = condition.value.split(':')[1] || '30 days';
             
             if (timeField) {
               if (!modifiedQuery.toUpperCase().includes(' WHERE ')) {
                 modifiedQuery = `${modifiedQuery} WHERE ${timeField} > NOW() - INTERVAL '${timeWindow}'`;
               } else {
                 modifiedQuery = modifiedQuery.replace(/WHERE /i, `WHERE (${timeField} > NOW() - INTERVAL '${timeWindow}') AND `);
               }
             }
           }
           break;
       }
     }
 
     return modifiedQuery;
   }
 
   /**
    * Apply masking to query results based on masking policies
    * @param {Object} rule - The rule with masking policies
    * @param {Array} results - Query results to mask
    * @returns {Array} Masked query results
    */
   static applyMaskingToResults(rule, results) {
     if (!rule.maskingPolicies || rule.maskingPolicies.length === 0 || !Array.isArray(results)) {
       return results;
     }
 
     // Apply each masking policy to results
     return results.map(row => {
       const maskedRow = { ...row };
       
       rule.maskingPolicies.forEach(policy => {
         const columnName = policy.column;
         
         if (maskedRow[columnName] !== undefined) {
           switch (policy.type) {
             case 'partial':
               if (typeof maskedRow[columnName] === 'string') {
                 const len = maskedRow[columnName].length;
                 if (len > 4) {
                   maskedRow[columnName] = '*'.repeat(len - 4) + maskedRow[columnName].slice(-4);
                 }
               }
               break;
               
             case 'full':
               if (typeof maskedRow[columnName] === 'string') {
                 maskedRow[columnName] = '*'.repeat(maskedRow[columnName].length);
               } else if (maskedRow[columnName] !== null) {
                 maskedRow[columnName] = '****';
               }
               break;
               
             case 'hash':
               // Simple representation of hashing (would use proper crypto in production)
               if (maskedRow[columnName] !== null) {
                 const str = String(maskedRow[columnName]);
                 let hash = 0;
                 for (let i = 0; i < str.length; i++) {
                   hash = ((hash << 5) - hash) + str.charCodeAt(i);
                   hash |= 0;
                 }
                 maskedRow[columnName] = 'HASH_' + Math.abs(hash).toString(16);
               }
               break;
               
             case 'custom':
               if (typeof maskedRow[columnName] === 'string') {
                 const val = maskedRow[columnName];
                 if (val.length > 4) {
                   maskedRow[columnName] = val.substring(0, 2) + '-XXX-' + val.slice(-2);
                 }
               }
               break;
           }
         }
       });
       
       return maskedRow;
     });
   }
 
   /**
    * Process a SQL query through all applicable rules
    * @param {string} databaseId - ID of the database
    * @param {string} sqlQuery - Original SQL query
    * @returns {Promise<{modifiedQuery: string, rules: Array}>} Modified query and applied rules
    */
   static async processQuery(databaseId, sqlQuery) {
     // Get all active rules for this database
     const rules = await this.getRulesByDatabaseId(databaseId);
     let modifiedQuery = sqlQuery;
     const appliedRules = [];
     
     // Apply all matching rules' conditions to modify the query
     for (const rule of rules) {
       const beforeQuery = modifiedQuery;
       modifiedQuery = this.applyConditionsToQuery(rule, modifiedQuery);
       
       // If the query was modified, add this rule to applied rules
       if (beforeQuery !== modifiedQuery) {
         appliedRules.push(rule);
       }
     }
     
     return { modifiedQuery, appliedRules };
   }
 
   /**
    * Process query results through all applicable masking rules
    * @param {string} databaseId - ID of the database
    * @param {Array} results - Query results
    * @returns {Promise<Array>} Masked query results
    */
   static async processResults(databaseId, results) {
     // Get all active rules for this database
     const rules = await this.getRulesByDatabaseId(databaseId);
     let processedResults = results;
     
     // Apply all matching rules' masking policies to the results
     for (const rule of rules) {
       processedResults = this.applyMaskingToResults(rule, processedResults);
     }
     
     return processedResults;
   }
 
   /**
    * Test a rule against a query
    * @param {Object} rule - The rule to test
    * @param {string} query - The query to test
    * @returns {Object} Test results
    */
   static testRule(rule, query) {
     try {
       // Apply conditions to modify the query
       const modifiedQuery = this.applyConditionsToQuery(rule, query);
       
       // Check if any modification was made
       const passed = query !== modifiedQuery;
       
       return {
         passed,
         modifiedQuery: passed ? modifiedQuery : null,
         error: null
       };
     } catch (error) {
       return {
         passed: false,
         modifiedQuery: null,
         error: error.message
       };
     }
   }
 }