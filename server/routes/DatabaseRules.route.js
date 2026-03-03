// routes/databaseRules.routes.js
import express from "express";
import { DatabaseRulesController } from "../controllers/DatabaseRules.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Rules CRUD
router.get("/database/:dbId/rules", DatabaseRulesController.getRulesByDatabase);
router.get("/rules/:id", DatabaseRulesController.getRule);
router.post("/rules", DatabaseRulesController.createRule);
router.put("/rules/:id", DatabaseRulesController.updateRule);
router.delete("/rules/:id", DatabaseRulesController.deleteRule);

// Rule testing
router.post("/rules/test", DatabaseRulesController.testRule);

// Query execution with rules
router.post("/database/:dbId/query", DatabaseRulesController.executeQuery);

export default router; 